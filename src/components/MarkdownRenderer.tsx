import React from 'react';
import ReactMarkdown from 'react-markdown';
import { normalizeMarkdown } from '@/utils/markdownHelpers';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer converts a markdown string into React elements.
 *
 * It leverages `react-markdown` with the GitHub Flavored Markdown (GFM)
 * plugin for tables, strikethrough, task lists, etc.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  const normalized = normalizeMarkdown(content);

  return (
    <ReactMarkdown
      className={className}
      // Allow breaks on single newlines to match GitHub behaviour
      skipHtml={false}
      components={{
        a: ({ ...props }) => (
          <a target="_blank" rel="noopener noreferrer" {...props} />
        ),
        ul: ({ ...props }) => (
          <ul className="list-disc ml-5 space-y-1" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal ml-5 space-y-1" {...props} />
        ),
        p: ({ ...props }) => (
          <p className="mb-4" {...props} />
        ),
        h1: ({ ...props }) => (
          <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />
        ),
        h3: ({ ...props }) => (
          <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
        ),
        h4: ({ ...props }) => (
          <h4 className="text-base font-semibold mt-3 mb-2" {...props} />
        ),
        h5: ({ ...props }) => (
          <h5 className="text-sm font-semibold mt-2 mb-2" {...props} />
        ),
        h6: ({ ...props }) => (
          <h6 className="text-sm font-medium mt-2 mb-2 uppercase" {...props} />
        ),
        blockquote: ({ ...props }) => (
          <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4" {...props} />
        ),
        hr: () => <hr className="my-6 border-border" />,
      }}
    >
      {normalized}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer; 