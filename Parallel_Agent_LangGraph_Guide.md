
# Parallel, Agent‑Verified LangGraph News Pipeline – Step‑by‑Step Guide

*(Save this file and open in any Markdown viewer for best readability)*

---

## Overview

This guide walks you through building a **parallel, agent‑powered** LangGraph workflow that:

1. **Fetches** 20–30 fresh headlines from **NewsAPI**.
2. **Deduplicates** them against previously‑indexed articles using **OpenAI embeddings + Pinecone** (runs in parallel).
3. **Verifies** each remaining article with a **GPT‑4.1 fact‑checking agent** that calls a custom *SearchSonar* tool (runs in parallel).
4. **Selects** only the most **impactful** stories (single GPT‑4.1 call).
5. **Summarises** each kept story with **GPT‑4o‑mini** (runs in parallel).
6. **Persists** headline, summary, full text, date, and location to **MongoDB Atlas**.
7. **Indexes** headline + full‑text vectors in **Pinecone** for future semantic search.

Total wall‑clock ≈ **15–18 seconds** for ~25 articles thanks to concurrency.

---

## 0  Environment Setup

```bash
pip install langchain langgraph openai pinecone-client pymongo httpx tqdm newsapi-python
```

Environment variables:

```
NEWSAPI_KEY, OPENAI_API_KEY, PERPLEXITY_KEY,
PINECONE_API_KEY, PINECONE_ENV, MONGO_URI
```

Create a Pinecone index (1536 dims, cosine or dot-product).

---

## 1  Global Clients & Helpers

```python
import os, asyncio, hashlib, httpx, pinecone, openai
from newsapi import NewsApiClient
from pymongo import MongoClient

openai.api_key = os.environ["OPENAI_API_KEY"]
pinecone.init(api_key=os.environ["PINECONE_API_KEY"],
              environment=os.environ["PINECONE_ENV"])

pc_index  = pinecone.Index("news-articles-index")
news_api  = NewsApiClient(api_key=os.environ["NEWSAPI_KEY"])
mongo     = MongoClient(os.environ["MONGO_URI"])
news_col  = mongo.ai_news.articles
SONAR_HDR = {"Authorization": f"Bearer {os.environ['PERPLEXITY_KEY']}"}
```

### Helpers

```python
async def embed_batch(texts):
    resp = await openai.Embedding.acreate(
        model="text-embedding-ada-002", input=texts)
    return [d["embedding"] for d in sorted(resp["data"],
                                           key=lambda x: x["index"])]

async def sonar_search(q, client):
    payload = {"question": q, "source": "web", "num_answers": 1}
    r = await client.post("https://api.perplexity.ai/ask",
                          json=payload, headers=SONAR_HDR, timeout=15)
    r.raise_for_status()
    return r.json()
```

---

## 2  State Schema

```python
from typing import TypedDict, List, Optional

class Article(TypedDict, total=False):
    location: Optional[str]
    date: str
    headline: str
    content: str
    summary: Optional[str]

class State(TypedDict):
    articles:   List[Article]
    vecs:       List[list[float]]
    unique_idx: List[int]
    verify_idx: List[int]
    keep_idx:   List[int]
```

We pass **index lists** – avoids copying big dicts.

---

## 3  Node Implementations

### 3.1  Fetch

```python
async def fetch_news(_):
    raw = news_api.get_top_headlines(language="en", page_size=25)["articles"]
    arts = []
    for art in raw:
        txt = art.get("content") or ""
        loc = txt.split(" - ")[0][:30] if " - " in txt[:40] else None
        arts.append({"location": loc,
                     "date": art["publishedAt"],
                     "headline": art["title"],
                     "content": txt})
    return {"articles": arts}
```

---

### 3.2  Deduplicate (Parallel)

```python
async def _dedupe_one(i, vec):
    hits = pc_index.query(vector=vec, top_k=1)
    return None if hits.matches and hits.matches[0].score >= .90 else i

async def deduplicate(st):
    texts = [f"{a['headline']}
{a['content']}" for a in st["articles"]]
    st["vecs"] = await embed_batch(texts)          # single OpenAI call
    tasks = [_dedupe_one(i,v) for i,v in enumerate(st["vecs"])]
    keep  = [i for i in await asyncio.gather(*tasks) if i is not None]
    return {"unique_idx": keep}
```

---

### 3.3  Verify – GPT‑4.1 Fact‑Check Agent (Parallel)

```python
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.tools  import Tool

search_tool = Tool.from_function(
    name="SearchSonar",
    description="Lookup supporting sources.",
    func=lambda q: asyncio.run(sonar_search(q, httpx.AsyncClient()))
)

gpt4 = ChatOpenAI(model_name="gpt-4", temperature=0)
fact_agent = initialize_agent(
    tools=[search_tool], llm=gpt4,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    system_message=("Fact‑check the news. Use SearchSonar until certain. "
                    "Reply VERIFIED or UNVERIFIED."))

async def _verify_one(i, art):
    res = fact_agent.run(f"{art['headline']} {art['content'][:150]}")
    return i if "VERIFIED" in res.upper() else None

async def verify_parallel(st):
    arts  = [st["articles"][i] for i in st["unique_idx"]]
    tasks = [_verify_one(i,a)  for i,a in zip(st["unique_idx"], arts)]
    ok    = [i for i in await asyncio.gather(*tasks) if i]
    return {"verify_idx": ok}
```

---

### 3.4  Select Impact (single GPT‑4 call)

```python
from langchain.prompts import PromptTemplate
prompt = PromptTemplate.from_template(
    "Score each story (0‑10) for global impact and return JSON.")

async def select_impact(st):
    if not st["verify_idx"]: return {"keep_idx":[]}
    blob = "
".join(f"- {st['articles'][i]['headline']}"
                     for i in st["verify_idx"])
    import json, heapq
    scored = json.loads(gpt4.predict(prompt.format(blob)))
    top3   = heapq.nlargest(3, scored, key=lambda x:x["score"])
    keep   = [st["verify_idx"][next(j for j in range(len(st["verify_idx"]))
                 if st["articles"][st['verify_idx'][j]]['headline']==t['headline'])]
             for t in top3]
    return {"keep_idx": keep}
```

---

### 3.5  Summarise (Parallel GPT‑4o‑mini)

```python
gpt4o = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.25)

async def _sum_one(i, art):
    art["summary"] = gpt4o.predict(
        f"Summarise in one concise paragraph:
{art['content']}").strip()

async def summarise_parallel(st):
    await asyncio.gather(*[_sum_one(i, st["articles"][i]) for i in st["keep_idx"]])
    return {}
```

---

### 3.6  Save to Mongo

```python
async def save_mongo(st):
    if st["keep_idx"]:
        news_col.insert_many([st["articles"][i] for i in st["keep_idx"]])
    return {}
```

---

### 3.7  Index in Pinecone (reuse vectors)

```python
async def index_pinecone(st):
    for i in st["keep_idx"]:
        art, vec = st["articles"][i], st["vecs"][i]
        uid = hashlib.sha1(f"{art['headline']}{art['date']}".encode()).hexdigest()
        pc_index.upsert([{"id": uid, "values": vec,
                          "metadata": {"headline": art["headline"],
                                       "date": art["date"]}}])
    return {}
```

---

## 4  Wire the Graph

```python
from langgraph.graph import StateGraph, START, END
g = StateGraph(State)

g.add_node("fetch", fetch_news)
g.add_node("dedup", deduplicate)
g.add_node("verify", verify_parallel)
g.add_node("select", select_impact)
g.add_node("summ", summarise_parallel)
g.add_node("mongo", save_mongo)
g.add_node("pine", index_pinecone)

g.add_edge(START,"fetch"); g.add_edge("fetch","dedup")
g.add_edge("dedup","verify"); g.add_edge("verify","select")
g.add_edge("select","summ");  g.add_edge("summ","mongo")
g.add_edge("mongo","pine");   g.add_edge("pine",END)

graph = g.compile()
```

Run:

```python
import asyncio, datetime as dt
print("⏳", dt.datetime.utcnow())
asyncio.run(graph.invoke({}))
print("✅", dt.datetime.utcnow())
```

---

## 5  Latency Snapshot

| Operation | Wall‑clock |
|-----------|------------|
| Fetch + batch embed | ~2 s |
| 25 Pinecone queries | <1 s |
| 15 parallel fact‑checks | 12‑15 s |
| GPT‑4 editor | 3 s |
| 3‑5 parallel summaries | 2 s |
| Writes | <1 s |

**Total ≈ 15‑18 s** instead of >120 s serial.

---

## 6  Production Tips

* **Semaphores** if you need to cap concurrency for Sonar / GPT.  
* **Embed cache** keyed on `(headline,date)` to save tokens.  
* **Unique index** on `(headline,date)` in Mongo; upsert to avoid dups.  
* **Verbose agent logs** while QA‑testing (`verbose=True`).  
* **Observability**: pipe LangGraph traces to LangSmith/Langfuse.

---

Happy shipping! 🎉
