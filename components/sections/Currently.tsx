'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { getAlbumCover } from '@/lib/api/itunes';
import { getMoviePoster } from '@/lib/api/tmdb';

gsap.registerPlugin(ScrollTrigger);

// Placeholder data - will be replaced with Sanity CMS
const placeholderData = {
  music: {
    songName: 'Shape of You',
    artistName: 'Ed Sheeran',
    albumName: '÷ (Divide)',
  },
  movie: {
    title: 'Inception',
    type: 'movie' as const,
    year: 2010,
    rating: 5,
    genre: 'Sci-Fi',
  },
  learning: {
    skill: 'Java Spring Boot',
    progress: 65,
  },
  location: {
    city: 'Ahmedabad',
    country: 'India',
    timezone: 'Asia/Kolkata',
  },
};

export default function Currently() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [albumCover, setAlbumCover] = useState<string | null>(null);
  const [moviePoster, setMoviePoster] = useState<string | null>(null);
  const [loadingAlbum, setLoadingAlbum] = useState(true);
  const [loadingMovie, setLoadingMovie] = useState(true);

  // Fetch album cover
  useEffect(() => {
    async function fetchAlbumCover() {
      setLoadingAlbum(true);
      const cover = await getAlbumCover(
        placeholderData.music.songName,
        placeholderData.music.artistName
      );
      setAlbumCover(cover);
      setLoadingAlbum(false);
    }
    fetchAlbumCover();
  }, []);

  // Fetch movie poster
  useEffect(() => {
    async function fetchMoviePoster() {
      setLoadingMovie(true);
      const poster = await getMoviePoster(
        placeholderData.movie.title,
        placeholderData.movie.type
      );
      setMoviePoster(poster);
      setLoadingMovie(false);
    }
    fetchMoviePoster();
  }, []);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Cards stagger animation
      gsap.from(cardsRef.current?.querySelectorAll('.currently-card') || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: placeholderData.location.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-accent-yellow' : 'text-muted/30'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section
      id="currently"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-card/10"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Currently <span className="text-primary">Vibing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A glimpse into what I'm up to right now - music, shows, learning, and more.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Latest Blog Post - Large Card */}
          <div className="currently-card md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary/10 to-accent-purple/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Latest Blog Post</h3>
                <p className="text-xl font-heading font-bold group-hover:text-primary transition-colors">
                  Building a Modern Portfolio
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              Exploring the latest trends in web development and how to create an engaging portfolio
              that stands out...
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">2 days ago</span>
              <button className="text-sm text-primary hover:underline font-medium">
                Read More →
              </button>
            </div>
          </div>

          {/* Currently Loving Music */}
          <div className="currently-card bg-gradient-to-br from-accent-pink/10 to-accent-purple/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-pink/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-pink" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Currently Loving</h3>
              </div>
            </div>
            
            {/* Album Cover */}
            <div className="w-full aspect-square rounded-xl mb-4 relative overflow-hidden group-hover:scale-105 transition-transform bg-gradient-to-br from-accent-pink/20 to-accent-purple/20">
              {loadingAlbum ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-pink"></div>
                </div>
              ) : albumCover ? (
                <>
                  <Image
                    src={albumCover}
                    alt={`${placeholderData.music.songName} album cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Animated equalizer bars overlay */}
                  <div className="absolute bottom-3 right-3 flex items-end gap-1 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-accent-pink rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 12 + 8}px`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-muted/30" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
              )}
            </div>

            <div>
              <p className="font-heading font-bold text-sm mb-1 line-clamp-1">
                {placeholderData.music.songName}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {placeholderData.music.artistName}
              </p>
            </div>
          </div>

          {/* Barcelona FC */}
          <div className="currently-card bg-gradient-to-br from-[#004d98]/10 to-[#a50044]/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-[#a50044]/50 transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#004d98]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#a50044]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-.5 4.5c-1.657 0-3-.895-3-2h6c0 1.105-1.343 2-3 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Força Barça!</h3>
              </div>
            </div>

            {/* Barcelona Badge */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#004d98] to-[#a50044] p-1">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-br from-[#004d98] to-[#a50044] bg-clip-text text-transparent">
                    FCB
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">Next Match</p>
              <p className="font-heading font-bold text-sm">Real Madrid</p>
              <p className="text-xs text-muted-foreground">El Clásico • 3 days</p>
            </div>
          </div>

          {/* Currently Learning */}
          <div className="currently-card bg-gradient-to-br from-accent-green/10 to-accent-blue/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Currently Learning</h3>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent-green/20 to-accent-blue/20 mb-4">
                <span className="text-3xl">☕</span>
              </div>
              <p className="font-heading font-bold text-center mb-2">
                {placeholderData.learning.skill}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{placeholderData.learning.progress}%</span>
              </div>
              <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full transition-all duration-1000"
                  style={{ width: `${placeholderData.learning.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recently Watched */}
          <div className="currently-card bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Recently Watched</h3>
              </div>
            </div>

            {/* Movie Poster */}
            <div className="w-full aspect-[2/3] rounded-xl mb-4 relative overflow-hidden group-hover:scale-105 transition-transform bg-gradient-to-br from-accent-blue/20 to-accent-purple/20">
              {loadingMovie ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
                </div>
              ) : moviePoster ? (
                <Image
                  src={moviePoster}
                  alt={`${placeholderData.movie.title} poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-muted/30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div>
              <p className="font-heading font-bold text-sm mb-1 line-clamp-1">
                {placeholderData.movie.title}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {placeholderData.movie.genre} • {placeholderData.movie.year}
              </p>
              <div className="flex items-center gap-1">
                {renderStars(placeholderData.movie.rating)}
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="currently-card bg-gradient-to-br from-accent-yellow/10 to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-yellow/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-yellow" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
              </div>
            </div>

            <div className="text-center space-y-4">
              {/* Location */}
              <div>
                <p className="text-2xl font-heading font-bold mb-1">
                  {placeholderData.location.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  {placeholderData.location.country}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-primary/20"></div>

              {/* Live Clock */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Local Time</p>
                <p className="text-3xl font-heading font-bold font-mono text-primary">
                  {formatTime(currentTime)}
                </p>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
                <span className="text-xs text-accent-green font-medium">Available for work</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
