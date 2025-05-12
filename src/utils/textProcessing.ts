/**
 * Strips markdown formatting from text
 * @param text Input text with potential markdown formatting
 * @returns Cleaned text without markdown
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  
  // Remove common markdown formatting
  return text
    .replace(/\*\*/g, '')         // Bold: **text**
    .replace(/\*/g, '')           // Italics: *text*
    .replace(/\_\_/g, '')         // Bold: __text__
    .replace(/\_/g, '')           // Italics: _text_
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Links: [text](url) -> text
    .replace(/\[(\d+)\]/g, '')    // Citation references: [5]
    .replace(/\`\`\`[^`]*\`\`\`/g, '')        // Code blocks: ```code```
    .replace(/\`([^`]+)\`/g, '$1')            // Inline code: `code`
    .replace(/\#{1,6}\s?/g, '')               // Headers: # Heading
    .trim();
} 