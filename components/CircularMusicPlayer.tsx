'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

interface CircularMusicPlayerProps {
  songName: string;
  artistName: string;
  albumName?: string;
  albumCover: string | null;
  previewUrl: string | null;
  loading?: boolean;
}

export function CircularMusicPlayer({ 
  songName, 
  artistName, 
  albumName,
  albumCover, 
  previewUrl,
  loading = false 
}: CircularMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (previewUrl && typeof window !== 'undefined') {
      audioRef.current = new Audio(previewUrl);
      
      const audio = audioRef.current;

      const updateProgress = () => {
        if (audio.duration) {
          setCurrentTime(audio.currentTime);
          setDuration(audio.duration);
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        audio.src = '';
      };
    }
  }, [previewUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !previewUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="currently-card relative flex h-full min-h-[280px] flex-col rounded-2xl border border-white/10 bg-surface-container p-5 shadow-[0_2px_10px_rgba(0,0,0,0.16)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="text-[10px] font-label font-bold uppercase tracking-[0.24em] text-primary">
          Listening to
        </span>
        <svg className="h-4 w-4 text-primary/70" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      </div>

      <div className="relative mx-auto mb-5 aspect-square w-full max-w-[170px] flex-shrink-0">
        <div className={`absolute inset-0 overflow-hidden rounded-full border border-white/10 bg-surface-container-high ${isPlaying ? 'animate-spin-slow' : ''}`}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : albumCover ? (
            <Image
              src={albumCover}
              alt={`${songName} album cover`}
              fill
              className="object-cover"
              sizes="180px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-surface-bright" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
          )}
        </div>
        
        {isPlaying && (
          <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <div className="flex items-center justify-center gap-0.5">
              <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 text-center">
        <h3 className="mb-1 line-clamp-1 text-xl font-display font-bold text-foreground">
          {songName}
        </h3>
        <p className="text-[11px] font-label uppercase tracking-[0.22em] text-muted-foreground">
          {artistName}
        </p>
        {albumName ? (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-1">{albumName}</p>
        ) : null}
      </div>

      <div className="mb-4 space-y-2">
        <div className="h-1 overflow-hidden rounded-full bg-surface-bright">
          <div 
            className="h-full rounded-full bg-primary transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        {previewUrl && (
          <div className="flex justify-between text-[10px] font-label uppercase tracking-[0.16em] text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}
      </div>

      <div className="mt-auto flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-surface-container-high p-2">
          <button 
            onClick={handleSkipBack}
            className="flex h-11 items-center gap-1.5 rounded-full px-3 text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-foreground disabled:opacity-30"
            disabled={!previewUrl}
            aria-label="Skip back 10s"
          >
            <SkipBack className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-[10px] font-label font-bold uppercase tracking-[0.2em]">10</span>
          </button>

          <button 
            onClick={togglePlay}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_6px_18px_rgba(0,0,0,0.2)] transition-colors duration-200 hover:bg-primary/90 disabled:opacity-30"
            disabled={!previewUrl}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" strokeWidth={2.4} />
            ) : (
              <Play className="ml-0.5 h-5 w-5" strokeWidth={2.4} fill="currentColor" />
            )}
          </button>

          <button 
            onClick={handleSkipForward}
            className="flex h-11 items-center gap-1.5 rounded-full px-3 text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-foreground disabled:opacity-30"
            disabled={!previewUrl}
            aria-label="Skip forward 10s"
          >
            <span className="text-[10px] font-label font-bold uppercase tracking-[0.2em]">10</span>
            <SkipForward className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
