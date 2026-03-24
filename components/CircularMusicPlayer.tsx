'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface CircularMusicPlayerProps {
  songName: string;
  artistName: string;
  albumCover: string | null;
  previewUrl: string | null;
  loading?: boolean;
}

export function CircularMusicPlayer({ 
  songName, 
  artistName, 
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
    <div className="currently-card relative bg-surface-container rounded-xl p-6 hover:bg-surface-container-high transition-all duration-300 group hover:scale-[1.02] h-full flex flex-col">
      {/* Decorative Music Note Icon - Top Right */}
      <div className="absolute top-4 right-4 text-primary/20 group-hover:text-primary/40 transition-colors">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      </div>

      {/* Circular Album Art */}
      <div className="relative w-full aspect-square max-w-[180px] mx-auto mb-4 flex-shrink-0">
        <div className={`absolute inset-0 rounded-full overflow-hidden bg-gradient-to-br from-surface-bright to-surface-container shadow-xl ${isPlaying ? 'animate-spin-slow' : ''}`}>
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
        
        {/* Small Equalizer Icon on Album (when playing) */}
        {isPlaying && (
          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <div className="flex items-center justify-center gap-0.5">
              <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="text-center mb-3">
        <h3 className="text-lg font-heading font-bold text-white mb-1 line-clamp-1">
          {songName}
        </h3>
        <p className="text-xs text-muted-foreground font-label uppercase tracking-wider">
          {artistName}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-3">
        <div className="h-1 bg-surface-bright rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        {previewUrl && (
          <div className="flex justify-between text-[10px] text-muted-foreground font-label">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-auto">
        {/* Previous */}
        <button 
          onClick={handleSkipBack}
          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-300 disabled:opacity-30 rounded-full hover:bg-surface-bright"
          disabled={!previewUrl}
          aria-label="Skip back 10s"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        {/* Play/Pause - Main Button */}
        <button 
          onClick={togglePlay}
          className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#ff7948] hover:shadow-lg hover:shadow-primary/50 text-white transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
          disabled={!previewUrl}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button 
          onClick={handleSkipForward}
          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-300 disabled:opacity-30 rounded-full hover:bg-surface-bright"
          disabled={!previewUrl}
          aria-label="Skip forward 10s"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
