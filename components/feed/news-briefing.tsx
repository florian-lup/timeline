'use client';

import { AudioLines, Pause, Play, Square, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { fetchLatestPodcast } from '@/lib/api/podcast-feed';
import type { PodcastData } from '@/types/podcast-data';
import { toSafeHttpUrl } from '@/utils/safe-url';

interface NewsBriefingProps {
  disabled?: boolean;
}

type PlaybackState =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'error';

/**
 * News briefing component with audio playback functionality
 * Fetches and plays the latest podcast when the audio button is clicked
 *
 * Manages audio playback lifecycle including loading, playing, pausing
 * and handling audio errors. Uses standard HTML5 audio for playback.
 */
export function NewsBriefing({ disabled = false }: NewsBriefingProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const shouldAutoPlayRef = useRef<boolean>(false);

  /**
   * Handle audio element creation and setup event listeners
   */
  useEffect(() => {
    // Initialize audio element
    if (
      typeof podcast?.audio_url !== 'string' ||
      podcast.audio_url.length === 0 ||
      audioRef.current !== null
    ) {
      return;
    }

    try {
      // Create audio element
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = 1.0;

      // Set audio properties
      if ('mozPreservesPitch' in audio) audio.mozPreservesPitch = true;
      if ('preservesPitch' in audio) audio.preservesPitch = true;
      if ('disableNormalization' in audio) audio.disableNormalization = true;

      // Set audio source to a validated http(s) URL
      const safeSrc = toSafeHttpUrl(podcast.audio_url);
      if (!safeSrc) {
        throw new Error('Invalid audio URL');
      }
      audio.src = safeSrc;

      audioRef.current = audio;

      // Add event listeners
      addEventListeners(audio);
    } catch (err) {
      console.error('Failed to initialize audio:', err);
      setError('Failed to initialize audio player');
      setPlaybackState('error');
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [podcast?.audio_url]); // Audio URL dependency for direct CDN access

  // Add event listeners to audio element
  const addEventListeners = (audio: HTMLAudioElement) => {
    audio.addEventListener('ended', () => {
      setPlaybackState('stopped');
    });

    audio.addEventListener('error', e => {
      console.error('Audio loading error:', e);
      setError('Failed');
      setPlaybackState('error');
    });

    audio.addEventListener('canplay', () => {
      if (!shouldAutoPlayRef.current) return;

      shouldAutoPlayRef.current = false;

      void audio
        .play()
        .then(() => {
          setPlaybackState('playing');
        })
        .catch((err: unknown) => {
          console.error('Failed to auto-play audio:', err);
          setError('Failed to play audio');
          setPlaybackState('error');
        });
    });
  };

  const handlePlay = async () => {
    // If we already have audio loaded, just play it
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setPlaybackState('playing');
      } catch (err) {
        console.error('Failed to play audio:', err);
        setError('Failed to play audio');
        setPlaybackState('error');
      }
      return;
    }

    // Otherwise, fetch and play the podcast
    if (!podcast) {
      try {
        setPlaybackState('loading');
        setError(null);

        // Set flag to enable auto-play when audio is ready
        shouldAutoPlayRef.current = true;

        // Fetch the latest podcast
        const latestPodcast = await fetchLatestPodcast();
        setPodcast(latestPodcast);

        // The useEffect will handle creating the audio element and auto-playing it
      } catch (err) {
        console.error('Failed to load podcast:', err);
        setError('Failed to load podcast');
        setPlaybackState('error');
      }
    }
  };

  const handlePause = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setPlaybackState('paused');
  };

  const handleStop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaybackState('stopped');
  };

  const isDisabled =
    disabled || playbackState === 'loading' || playbackState === 'error';
  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const isLoading = playbackState === 'loading';
  const hasStartedPlayback = podcast !== null && (isPlaying || isPaused);

  return (
    <div className="flex items-center gap-2">
      {/* Error Display (hidden by default, only visible when there's an error) */}
      {error !== null && error.length > 0 && (
        <span
          className="max-w-[100px] truncate text-xs text-red-500"
          title={error}
        >
          {error}
        </span>
      )}

      {/* Show Play/Pause button only after playback has started */}
      {hasStartedPlayback && (
        <Button
          variant="outline"
          size="icon"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isDisabled}
          onClick={isPlaying ? handlePause : handlePlay}
        >
          {(() => {
            if (isLoading) {
              return <Loader2 className="h-4 w-4 animate-spin" />;
            }
            if (isPlaying) {
              return <Pause className="h-4 w-4" />;
            }
            return <Play className="h-4 w-4" />;
          })()}
        </Button>
      )}

      {/* Show Stop button only after playback has started */}
      {hasStartedPlayback && (
        <Button
          variant="outline"
          size="icon"
          aria-label="Stop"
          disabled={isDisabled || (!isPlaying && !isPaused)}
          onClick={handleStop}
        >
          <Square className="h-4 w-4" />
        </Button>
      )}

      {/* Main News Briefing Button */}
      <Button
        variant="default"
        size="icon"
        aria-label="AI News Broadcast"
        disabled={isDisabled}
        onClick={!hasStartedPlayback ? () => void handlePlay() : undefined}
        className="relative"
      >
        {isLoading && !hasStartedPlayback ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <AudioLines
            className={`h-4 w-4 ${isPlaying ? 'animate-pulse text-red-500' : ''}`}
          />
        )}
      </Button>
    </div>
  );
}
