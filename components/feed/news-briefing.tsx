'use client';

import { AudioLines, Pause, Play, Square, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { fetchLatestPodcast } from '@/lib/api/podcast-feed';
import type { PodcastData } from '@/types/podcast-data';

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
 */
export function NewsBriefing({ disabled = false }: NewsBriefingProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const shouldAutoPlayRef = useRef<boolean>(false);

  // Initialize audio element when podcast is loaded
  useEffect(() => {
    if (
      podcast?.audio_url != null &&
      podcast.audio_url.length > 0 &&
      !audioRef.current
    ) {
      try {
        // Use CDN URL directly - much simpler and better performance!
        const audio = new Audio();

        // Set audio properties for optimal quality
        audio.preload = 'auto'; // Preload the audio
        audio.volume = 1.0; // Full volume
        
        // Enable CORS for CDN audio to allow Web Audio API processing
        audio.crossOrigin = 'anonymous';
        
        // Disable browser audio normalization and compression
        if ('mozPreservesPitch' in audio) audio.mozPreservesPitch = true;
        if ('preservesPitch' in audio) audio.preservesPitch = true;
        if ('disableNormalization' in audio) audio.disableNormalization = true;

        // Set the CDN URL directly
        audio.src = podcast.audio_url;

        audioRef.current = audio;

        // Initialize Web Audio API for high-quality playback
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
          const AudioContextClass =
            (window as unknown as { AudioContext?: new () => AudioContext })
              .AudioContext ||
            (
              window as unknown as {
                webkitAudioContext?: new () => AudioContext;
              }
            ).webkitAudioContext;
          
          if (AudioContextClass && !audioContextRef.current) {
            try {
              // Create audio context for high-quality playback
              const audioContext = new AudioContextClass();
              
              audioContextRef.current = audioContext;
              
              // Create source node from audio element
              const source = audioContext.createMediaElementSource(audio);
              sourceNodeRef.current = source;
              
              // Connect directly to destination without any processing
              // This preserves the original audio quality
              source.connect(audioContext.destination);
              
            } catch (err) {
              console.warn('Failed to initialize Web Audio API, falling back to standard audio:', err);
              // Continue without Web Audio API
            }
          }
        }

        // Add event listeners
        audio.addEventListener('ended', () => {
          setPlaybackState('stopped');
        });

        audio.addEventListener('error', e => {
          console.error('Audio loading error:', e);
          setError('Failed');
          setPlaybackState('error');
        });

        audio.addEventListener('canplay', () => {
          // Only auto-play when initially loading (not when resetting currentTime)
          if (shouldAutoPlayRef.current) {
            shouldAutoPlayRef.current = false;
            
            // Resume audio context if needed (required for some browsers)
            if (audioContextRef.current?.state === 'suspended') {
              void audioContextRef.current.resume();
            }
            
            audio
              .play()
              .then(() => {
                setPlaybackState('playing');
              })
              .catch((err: unknown) => {
                console.error('Failed to auto-play audio:', err);
                setError('Failed to play audio');
                setPlaybackState('error');
              });
          }
        });

        // No blob URL cleanup needed with CDN
      } catch (err) {
        console.error('Failed to initialize audio:', err);
        setError('Failed to initialize audio player');
        setPlaybackState('error');
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Clean up Web Audio API resources
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch {}
        sourceNodeRef.current = null;
      }
      
      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [podcast?.audio_url]); // CDN URL dependency

  const handlePlay = async () => {
    // If we already have audio loaded, just play it
    if (audioRef.current) {
      try {
        // Resume audio context if needed (required for some browsers)
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
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
            className={`h-4 w-4 ${
              isPlaying ? 'animate-pulse text-red-500' : ''
            }`}
          />
        )}
      </Button>
    </div>
  );
}
