'use client';

import { History, Globe, Send } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSearchTextarea } from '@/hooks/useSearchTextarea';

interface SearchTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string, searchType: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchType?: string;
  onSearchTypeChange?: (type: string) => void;
}

export function SearchTextarea({
  value = '',
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  searchType = 'web',
  onSearchTypeChange,
}: SearchTextareaProps) {
  const {
    inputValue,
    searchType: currentSearchType,
    placeholder: dynamicPlaceholder,
    handleInputChange,
    handleSearchTypeChange,
    handleSubmit,
    handleKeyDown,
  } = useSearchTextarea({
    value,
    searchType,
    placeholder,
    onChange,
    onSearchTypeChange,
    onSubmit,
    disabled,
  });

  const canSubmit = inputValue.trim() !== '' && !disabled;

  return (
    <div className="rounded-md border shadow-xs">
      <Textarea
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={dynamicPlaceholder}
        className="no-scrollbar max-h-30 resize-none rounded-t-md rounded-b-none border-none shadow-none focus:outline-none focus-visible:ring-0"
        rows={2}
        id="search-input"
        autoFocus={false}
      />

      <div className="dark:bg-input/30 flex items-center justify-between rounded-b-md px-3 py-2">
        <ToggleGroup
          type="single"
          value={currentSearchType}
          onValueChange={handleSearchTypeChange}
          variant="outline"
          size="lg"
        >
          <ToggleGroupItem value="history">
            <History />
          </ToggleGroupItem>
          <ToggleGroupItem value="web">
            <Globe />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="lg"
          variant="ghost"
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
