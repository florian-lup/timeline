'use client';

import { History, Globe, Send } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TextareaInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string, searchType: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchType?: string;
  onSearchTypeChange?: (type: string) => void;
}

export function TextareaInput({
  value = '',
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  searchType = 'web',
  onSearchTypeChange,
}: TextareaInputProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const [currentSearchType, setCurrentSearchType] = React.useState(searchType);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  React.useEffect(() => {
    setCurrentSearchType(searchType);
  }, [searchType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSearchTypeChange = (type: string) => {
    if (type !== '') {
      setCurrentSearchType(type);
      onSearchTypeChange?.(type);
    }
  };

  const handleSubmit = () => {
    const isInputValid = inputValue.trim() !== '';
    if (isInputValid && !disabled) {
      onSubmit?.(inputValue.trim(), currentSearchType);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getDynamicPlaceholder = () => {
    if (placeholder != null) return placeholder;
    return currentSearchType === 'history'
      ? 'Search history...'
      : 'Search web...';
  };

  return (
    <div className="rounded-md border shadow-xs">
      <Textarea
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={getDynamicPlaceholder()}
        disabled={disabled}
        className="no-scrollbar max-h-30 resize-none rounded-t-md rounded-b-none border-none shadow-none focus-visible:ring-0"
        rows={2}
        id="search-input"
      />

      <div className="dark:bg-input/30 flex items-center justify-between rounded-b-md px-3 py-2">
        <ToggleGroup
          type="single"
          value={currentSearchType}
          onValueChange={handleSearchTypeChange}
          variant="outline"
          size="sm"
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
          disabled={disabled || inputValue.trim() === ''}
          size="sm"
          variant="ghost"
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
