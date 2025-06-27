'use client';

import { AudioLines, Loader2, Pause, Play, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAnchorBroadcast } from '@/hooks/useAnchorBroadcast';

interface AnchorBroadcastProps {
  disabled?: boolean;
}

/**
 * Inline anchor broadcast component for header
 */
export function AnchorBroadcast({ disabled = false }: AnchorBroadcastProps) {
  const { state, generateAnchor, pauseAudio, stopAudio } = useAnchorBroadcast();

  const handleMainButtonClick = () => {
    if (state === 'idle' || state === 'error') {
      void generateAnchor();
    }
  };

  const handleStop = () => {
    stopAudio();
  };

  const renderMainButton = () => {
    const isLoading = state === 'generating';
    const isPlaying = state === 'playing';
    const isPaused = state === 'paused';
    const isError = state === 'error';

    return (
      <Button
        variant="default"
        size="icon"
        aria-label="AI News Broadcast"
        disabled={disabled || isLoading}
        onClick={handleMainButtonClick}
        className={isPlaying || isPaused ? 'cursor-default' : ''}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <AudioLines
            className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''} ${
              isError ? 'text-destructive' : ''
            }`}
          />
        )}
      </Button>
    );
  };

  const renderControlButtons = () => {
    if (state !== 'playing' && state !== 'paused') {
      return null;
    }

    const isPaused = state === 'paused';

    return (
      <>
        <Button
          variant="outline"
          size="icon"
          onClick={pauseAudio}
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleStop}
          aria-label="Stop"
        >
          <Square className="h-4 w-4" />
        </Button>
      </>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {renderMainButton()}
      {renderControlButtons()}
    </div>
  );
}
