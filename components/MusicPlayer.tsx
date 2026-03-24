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
    <div className="currently-card relative bg-gradient-to-br from-[#F5F3F0] via-[#EAE7E3] to-[#E0DDD8] rounded-3xl overflow-hidden border-2 border-[#D5D2CD]/50 hover:border-[#C5C2BD]/70 transition-all duration-500 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:scale-[1.02]">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }} />
      
      {/* Subtle paper grain */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(93,78,55,0.03) 2px, rgba(93,78,55,0.03) 4px)'
      }} />
      
      {/* Decorative elements - Ghibli style clouds/sparkles */}
      <div className="absolute top-2 right-8 w-12 h-12 rounded-full bg-[#D5D2CD]/40 blur-2xl animate-pulse" />
      <div className="absolute bottom-4 left-6 w-16 h-16 rounded-full bg-[#C5C2BD]/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Album Art Section */}
      <div className="relative p-5 pb-3">
        <div className="w-full aspect-square rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#EAE7E3] to-[#E0DDD8] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#D5D2CD]/40">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B958D]"></div>
                {/* Cute sparkles while loading */}
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#9B958D] rounded-full animate-ping" />
                <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-[#B5B0A8] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          ) : albumCover ? (
            <>
              <Image
                src={albumCover}
                alt={`${songName} album cover`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Soft gradient overlay for dreamy effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#E0DDD8]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-[#9B958D]/40" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
          )}
          
          {/* Cute musical notes floating animation when playing */}
          {isPlaying && (
            <>
              <div className="absolute top-4 right-6 text-[#9B958D] animate-bounce drop-shadow-sm" style={{ animationDuration: '2s', animationDelay: '0s' }}>
                <span className="text-2xl">♪</span>
              </div>
              <div className="absolute top-8 right-12 text-[#8B8780] animate-bounce drop-shadow-sm" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>
                <span className="text-lg">♫</span>
              </div>
              <div className="absolute top-6 left-8 text-[#B5B0A8] animate-bounce drop-shadow-sm" style={{ animationDuration: '2.2s', animationDelay: '0.6s' }}>
                <span className="text-xl opacity-70">♪</span>
              </div>
            </>
          )}
          
          {/* Heart Icon - Top Right - More Ghibli style */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FAFAF8] flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg border border-[#E0DDD8]"
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <svg 
              className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'text-[#E07A5F] fill-[#E07A5F] scale-110' : 'text-[#9B958D]'}`}
              fill={isLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="px-5 pb-5 space-y-4 relative">
        {/* Song Info with handwritten style feel */}
        <div className="text-center space-y-1">
          <p className="font-heading font-bold text-base mb-0.5 line-clamp-1 text-[#5D4E37]">
            {songName}
          </p>
          <p className="text-xs text-[#8B7355] line-clamp-1 tracking-wide">
            {artistName}
          </p>
        </div>

        {/* Progress Bar with Ghibli aesthetic */}
        <div className="space-y-2">
          <div 
            className="h-2 bg-[#D5D2CD]/40 rounded-full cursor-pointer group/progress relative overflow-hidden shadow-inner"
            onClick={handleProgressClick}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/progress:animate-[shimmer_1.5s_ease-in-out_infinite]" />
            
            <div 
              className="h-full bg-gradient-to-r from-[#9B958D] via-[#8B8780] to-[#7A766F] rounded-full relative transition-all duration-200 shadow-sm"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing dot at the end */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_8px_rgba(155,149,141,0.6)] opacity-0 group-hover/progress:opacity-100 transition-opacity border-2 border-[#9B958D]" />
              {/* Trail sparkle effect */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
          </div>
          {/* Time Display */}
          {previewUrl && (
            <div className="flex justify-between text-[10px] text-[#8B7355] font-medium tracking-wider">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Player Controls - More whimsical */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {/* Repeat */}
          <button 
            className="w-9 h-9 flex items-center justify-center text-[#8B7355] hover:text-[#6B5E4F] transition-all duration-300 disabled:opacity-30 rounded-full hover:bg-[#E0DDD8]/50"
            disabled={!previewUrl}
            aria-label="Repeat"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Skip Back */}
          <button 
            onClick={handleSkipBack}
            className="w-9 h-9 flex items-center justify-center text-[#8B7355] hover:text-[#6B5E4F] transition-all duration-300 disabled:opacity-30 rounded-full hover:bg-[#E0DDD8]/50 hover:scale-110"
            disabled={!previewUrl}
            aria-label="Skip back"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          {/* Play/Pause - Main button with extra charm */}
          <button 
            onClick={togglePlay}
            className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#D5D2CD] via-[#C5C2BD] to-[#B5B0A8] hover:from-[#C5C2BD] hover:via-[#B5B0A8] hover:to-[#9B958D] text-[#5D4E37] transition-all duration-500 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 shadow-[0_3px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border-2 border-[#E0DDD8]"
            disabled={!previewUrl}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {/* Pulsing ring when playing */}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border-2 border-[#9B958D] animate-ping opacity-50" />
            )}
            {isPlaying ? (
              <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Skip Forward */}
          <button 
            onClick={handleSkipForward}
            className="w-9 h-9 flex items-center justify-center text-[#8B7355] hover:text-[#6B5E4F] transition-all duration-300 disabled:opacity-30 rounded-full hover:bg-[#E0DDD8]/50 hover:scale-110"
            disabled={!previewUrl}
            aria-label="Skip forward"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>

          {/* Shuffle */}
          <button 
            className="w-9 h-9 flex items-center justify-center text-[#8B7355] hover:text-[#6B5E4F] transition-all duration-300 disabled:opacity-30 rounded-full hover:bg-[#E0DDD8]/50"
            disabled={!previewUrl}
            aria-label="Shuffle"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
