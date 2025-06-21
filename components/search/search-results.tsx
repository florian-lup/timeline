'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResult {
  summary: string;
}

interface SearchResultsProps {
  query?: string;
  loading?: boolean;
  result?: SearchResult;
}

// Mock data for development
const mockResult: SearchResult = {
  summary: `Analysis: Iran Offers Conditional Diplomacy Amid Escalation

Historical Context

The Iran-Israel rivalry has long been a central axis of Middle Eastern instability, rooted in ideological opposition, regional power struggles, and, crucially, the controversy over Iran nuclear ambitions. Since the early 2000s, Iran nuclear program has prompted international concern, leading to cycles of negotiations and sanctions, most notably the 2015 Joint Comprehensive Plan of Action (JCPOA), which the U.S. exited in 2018. Israel, perceiving a nuclear-armed Iran as an existential threat, has consistently lobbied for tougher action and, at times, engaged in covert operations against Iranian interests.

The current escalation, as of June 2025, represents a dramatic intensification: direct missile exchanges, attacks on critical infrastructure (such as Iran Arak heavy water reactor and Israeli hospitals), and mounting civilian casualties. This is not only a military confrontation but also a diplomatic crisis with global ramifications.

Current Developments

Amid this violence, Iran has publicly stated it will only consider diplomatic engagement—particularly with the United States—if Israeli "aggression" ceases. Iranian Foreign Minister Abbas Araghchi articulated this position, emphasizing that talks, especially regarding Iran nuclear program, are off the table while Iran is under attack. He further demanded that Israel be "held accountable for the crimes he committed" before any negotiations can resume (The Guardian, BBC).

This stance comes as European diplomats attempt to mediate in Geneva, warning that "there can be no definitive solution through military means to the Iran nuclear problem" and cautioning against "dangerous" regime change efforts (BBC). Despite these diplomatic overtures, the violence continues: Israel reported a barrage of 20 Iranian missiles targeting Haifa, resulting in further casualties, while Iranian infrastructure, including state television headquarters, has suffered significant damage (Euronews, AP).

The United States, under President Donald Trump, is reportedly deliberating its own military response, underscoring the risk of broader regional or even global conflict (CBS News, PBS News). The conflict has reached a "week mark," with both sides showing no signs of de-escalation, even as international actors push for return to diplomacy.

Analysis

Iran conditional offer of diplomacy is both a tactical and strategic maneuver. By linking talks to an end to Israeli attacks, Tehran seeks to shift the diplomatic burden onto Israel and its Western allies, framing itself as a victim rather than an aggressor. This also buys Iran time to regroup militarily and politically, while appealing to European and global audiences wary of further escalation.

Conversely, Israel continued military operations, including strikes on nuclear facilities, reflect its determination to degrade Iran capabilities and deter future threats. However, these actions risk further entrenching Iranian intransigence and undermining any remaining prospects for negotiation.

European diplomats insistence that "no definitive solution" is possible through force highlights the international community recognition that military escalation only deepens the crisis. Their warnings against regime change echo the lessons of past interventions in the region, which have often led to protracted instability.

Potential Future Implications

Prolonged Conflict and Regional Destabilization: With both sides escalating and diplomacy stalled, the risk of a wider regional war grows. Spillover into Lebanon, Syria, and the Gulf is increasingly likely, threatening global energy supplies and international security.

Diplomatic Window Narrowing: Iran conditional stance may harden if Israeli operations continue or intensify. Conversely, if international pressure—especially from Europe and the U.S.—can secure a ceasefire, there may be a narrow window for renewed talks.

Nuclear Proliferation Risks: Attacks on nuclear sites and the suspension of negotiations raise the specter of unchecked Iranian nuclear advancement, potentially triggering a regional arms race.

Humanitarian Crisis: Civilian casualties and infrastructure damage are mounting on both sides, with hospitals and media outlets among the targets. Prolonged conflict will exacerbate humanitarian suffering and displacement.

Global Diplomatic Realignment: The U.S. response will be crucial. If Washington opts for military intervention, it could draw in NATO and further polarize global alliances. Alternatively, a strong diplomatic push could help broker a ceasefire, though this would require significant concessions from both Iran and Israel.

Conclusion

Iran offer of conditional diplomacy amid escalating violence is a calculated attempt to leverage international sympathy and shift the narrative. However, as long as military operations persist, the prospects for meaningful negotiation remain bleak. The international community faces a critical juncture: without swift and effective mediation, the conflict risks spiraling into a broader, more destructive war with profound regional and global consequences.`,
};

export function SearchResults({
  query,
  loading = false,
  result = mockResult,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">Searching...</div>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {query != null && query !== '' && (
        <div className="text-muted-foreground text-sm">
          Results for &quot;{query}&quot;
        </div>
      )}

      <Card>
        <CardContent>
          <div className="prose prose-sm prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted text-muted-foreground mb-4 max-w-none">
            <ReactMarkdown>{result.summary}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
