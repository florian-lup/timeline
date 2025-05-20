export function normalizeMarkdown(md: string): string {
  if (!md) return md;

  let cleaned = md;

  // 1. Remove trailing spaces at end of lines – they force <br> in markdown.
  cleaned = cleaned.replace(/[ \t]+\n/g, '\n');

  // 2. Ensure there is a blank line before headings (`#`, `##`, etc.).
  cleaned = cleaned.replace(/([^\n])\n(\s*#+\s)/g, '$1\n\n$2');

  // 3. Ensure there is a blank line before list markers (-, *, +, or 1.)
  cleaned = cleaned.replace(/([^\n])\n(\s*(?:[-*+]|\d+\. )\s?)/g, '$1\n\n$2');

  return cleaned;
}
