import { useState, useEffect } from 'react';

interface UseSearchTextareaProps {
  value?: string;
  searchType?: string;
  placeholder?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  onSearchTypeChange?: ((type: string) => void) | undefined;
  onSubmit?: ((value: string, searchType: string) => void) | undefined;
  disabled?: boolean;
}

/**
 * Hook for managing search input state and interactions
 * Handles both the text input and search type toggle, along with submission logic
 */
export function useSearchTextarea({
  value = '',
  searchType = 'web',
  placeholder = undefined,
  onChange,
  onSearchTypeChange,
  onSubmit,
  disabled = false,
}: UseSearchTextareaProps) {
  const [inputValue, setInputValue] = useState(value);
  const [currentSearchType, setCurrentSearchType] = useState(searchType);

  // Sync internal state with props
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    setCurrentSearchType(searchType);
  }, [searchType]);

  // Handle text input changes

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  // Handle search type toggle changes

  const handleSearchTypeChange = (type: string) => {
    if (type !== '') {
      setCurrentSearchType(type);
      onSearchTypeChange?.(type);
    }
  };

  // Handle form submission

  const handleSubmit = () => {
    const isInputValid = inputValue.trim() !== '';
    if (isInputValid && !disabled) {
      onSubmit?.(inputValue.trim(), currentSearchType);
      setInputValue('');
      onChange?.('');
    }
  };

  // Handle keyboard shortcuts

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Generate dynamic placeholder based on search type

  const getDynamicPlaceholder = () => {
    if (placeholder != null) return placeholder;
    return currentSearchType === 'history'
      ? 'search timeline for past events'
      : 'search web for latest news';
  };

  return {
    inputValue,
    searchType: currentSearchType,
    placeholder: getDynamicPlaceholder(),
    handleInputChange,
    handleSearchTypeChange,
    handleSubmit,
    handleKeyDown,
  };
}
