'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface MusicPlayerProps {
  songName: string;
  artistName: string;
  albumCover: string | null;
  previewUrl: string | null;
  loading?: boolean;
}

export function MusicPlayer({ 
  songName, 
  artistName, 
  albumCover, 
  previewUrl,
  loading = false 
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Default 30s for iTunes previews
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (previewUrl && typeof window !== 'undefined') {
      audioRef.current = new Audio(previewUrl);
      
      const audio = audioRef.current;

      // Update progress as song plays
      const updateProgress = () => {
        if (audio.duration) {
          setCurrentTime(audio.currentTime);
          setDuration(audio.duration);
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      // Handle song end
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
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = audioRef.current.duration;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !previewUrl) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(percentage * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="currently-card bg-gradient-to-br from-[#FFE5D9]/20 to-[#FFD4C4]/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#FFCCBC]/30 hover:border-[#FFCCBC]/60 transition-all duration-300 group hover:scale-[1.02]">
      {/* Album Art Section */}
      <div className="relative p-4 pb-3">
        <div className="w-full aspect-square rounded-xl relative overflow-hidden bg-gradient-to-br from-[#FFE5D9]/30 to-[#FFD4C4]/30">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB4A2]"></div>
            </div>
          ) : albumCover ? (
            <Image
              src={albumCover}
              alt={`${songName} album cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-muted/30" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
          )}
          
          {/* Heart Icon - Top Right */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <svg 
              className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`}
              fill={isLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="px-4 pb-4 space-y-3">
        {/* Song Info */}
        <div className="text-center">
          <p className="font-heading font-bold text-sm mb-0.5 line-clamp-1">
            {songName}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {artistName}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div 
            className="h-1.5 bg-background/50 rounded-full cursor-pointer group/progress"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-[#FFB4A2] to-[#FFDDC1] rounded-full relative transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFB4A2] rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>
          {/* Time Display */}
          {previewUrl && (
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-2">
          {/* Repeat */}
          <button 
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#FF9E80] transition-colors disabled:opacity-30"
            disabled={!previewUrl}
            aria-label="Repeat"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Skip Back */}
          <button 
            onClick={handleSkipBack}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#FF9E80] transition-colors disabled:opacity-30"
            disabled={!previewUrl}
            aria-label="Skip back"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FFB4A2] to-[#FF9E80] hover:from-[#FF9E80] hover:to-[#FFB4A2] text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
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

          {/* Skip Forward */}
          <button 
            onClick={handleSkipForward}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#FF9E80] transition-colors disabled:opacity-30"
            disabled={!previewUrl}
            aria-label="Skip forward"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>

          {/* Shuffle */}
          <button 
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#FF9E80] transition-colors disabled:opacity-30"
            disabled={!previewUrl}
            aria-label="Shuffle"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
