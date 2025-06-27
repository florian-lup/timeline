import { useRef, useState } from 'react';

export type AnchorState =
  | 'idle'
  | 'generating'
  | 'playing'
  | 'paused'
  | 'error';

export interface UseAnchorBroadcastReturn {
  state: AnchorState;
  error: string | null;
  generateAnchor: () => Promise<void>;
  pauseAudio: () => void;
  stopAudio: () => void;
  resetState: () => void;
}

/**
 * Custom hook for managing anchor broadcast functionality with auto-play streaming
 * Each generateAnchor() call creates a completely fresh broadcast instance
 */
export function useAnchorBroadcast(): UseAnchorBroadcastReturn {
  const [state, setState] = useState<AnchorState>('idle');
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanupAudio = () => {
    if (audioRef.current) {
      const audio = audioRef.current;

      // Remove all event listeners to prevent errors during cleanup
      audio.removeEventListener('error', () => {});
      audio.removeEventListener('ended', () => {});
      audio.removeEventListener('play', () => {});
      audio.removeEventListener('pause', () => {});
      audio.removeEventListener('canplay', () => {});
      audio.removeEventListener('loadeddata', () => {});
      audio.removeEventListener('loadstart', () => {});
      audio.removeEventListener('progress', () => {});

      // Pause and clear source without triggering events
      audio.pause();
      audio.src = '';
      audio.load(); // This helps clear the audio pipeline

      audioRef.current = null;
    }
  };

  const generateAnchor = async () => {
    try {
      // ALWAYS clean up any previous instance first
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      cleanupAudio();

      // Reset state for fresh start
      setState('generating');
      setError(null);

      const startTime = Date.now();

      // Create NEW abort controller for this fresh instance
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Create NEW audio element for this broadcast
      const audio = new Audio();
      audioRef.current = audio;

      // Enable auto-play and preload for faster start
      audio.preload = 'auto';
      audio.autoplay = true;

      // Set up audio event listeners for this instance
      const handleLoadStart = () => {
        // Audio load started
      };

      const handleLoadedData = () => {
        // Audio ready
      };

      const handleCanPlay = () => {
        // Auto-play as soon as we can
        audio
          .play()
          .then(() => {
            setState('playing');
          })
          .catch(err => {
            console.error('Auto-play failed:', err);
            setState('paused');
          });
      };

      const handlePlay = () => {
        setState('playing');
      };

      const handlePause = () => {
        setState('paused');
      };

      const handleEnded = () => {
        setState('idle');
      };

      const handleError = (e: Event) => {
        // Only handle errors if we're not in the process of stopping
        if (state !== 'idle' && !abortController.signal.aborted) {
          console.error('Audio error:', e);
          setState('error');
          setError('Failed to load or play audio stream');
        }
      };

      const handleProgress = () => {
        // Progress tracking for buffering
      };

      // Add event listeners
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('progress', handleProgress);

      // Create FRESH endpoint URL with unique timestamp to prevent any caching
      const freshUrl =
        '/api/anchor?' +
        new URLSearchParams({
          timestamp: Date.now().toString(),
          instance: Math.random().toString(36).substring(7), // Extra uniqueness
        });

      audio.src = freshUrl;

      // Start loading the fresh stream
      audio.load();

      // Handle abort signal for this instance
      abortController.signal.addEventListener('abort', () => {
        cleanupAudio();
      });
    } catch (err) {
      console.error('Generate anchor error:', err);
      setState('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      if (state === 'paused') {
        // Resume playback
        audioRef.current.play().catch(err => {
          console.error('Resume failed:', err);
          setState('error');
          setError('Failed to resume audio');
        });
      } else {
        // Pause playback
        audioRef.current.pause();
      }
    }
  };

  const stopAudio = () => {
    // Cancel any ongoing API request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clean up audio
    cleanupAudio();

    // Reset to idle - ready for NEW instance
    setState('idle');
    setError(null);
  };

  const resetState = () => {
    // Cancel any ongoing API request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clean up audio
    cleanupAudio();

    setState('idle');
    setError(null);
  };

  return {
    state,
    error,
    generateAnchor,
    pauseAudio,
    stopAudio,
    resetState,
  };
}
