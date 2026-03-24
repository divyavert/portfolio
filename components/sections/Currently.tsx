'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { getMusicData } from '@/lib/api/itunes';
import { getMoviePoster } from '@/lib/api/tmdb';
import type { CurrentlyLoving, RecentlyWatched, BlogPost, PersonalInfo } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';
import { CircularMusicPlayer } from '@/components/CircularMusicPlayer';
import { FootballMatchCard } from '@/components/FootballMatchCard';

gsap.registerPlugin(ScrollTrigger);

interface CurrentlyProps {
  currentlyLoving: CurrentlyLoving | null;
  recentlyWatched: RecentlyWatched | null;
  latestBlogPost: BlogPost | null;
  personalInfo: PersonalInfo | null;
  skillSprint: any;
}

export default function Currently({ 
  currentlyLoving, 
  recentlyWatched, 
  latestBlogPost,
  personalInfo,
  skillSprint 
}: CurrentlyProps) {
  // Fallback data
  const musicData = currentlyLoving || {
    songName: 'Shape of You',
    artistName: 'Ed Sheeran',
    albumName: '÷ (Divide)',
  };
  
  const movieData = recentlyWatched || {
    title: 'Inception',
    type: 'movie' as const,
    year: 2010,
    rating: 5,
    genre: 'Sci-Fi',
  };
  
  const location = personalInfo?.location || 'Ahmedabad, India';
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [albumCover, setAlbumCover] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [moviePoster, setMoviePoster] = useState<string | null>(null);
  const [loadingAlbum, setLoadingAlbum] = useState(true);
  const [loadingMovie, setLoadingMovie] = useState(true);

  // Fetch music data (album cover and preview URL)
  useEffect(() => {
    async function fetchMusicData() {
      setLoadingAlbum(true);
      const data = await getMusicData(
        musicData.songName,
        musicData.artistName
      );
      setAlbumCover(data.albumCover);
      setPreviewUrl(data.previewUrl);
      setLoadingAlbum(false);
    }
    fetchMusicData();
  }, [musicData.songName, musicData.artistName]);

  // Fetch movie poster
  useEffect(() => {
    async function fetchMoviePoster() {
      setLoadingMovie(true);
      const poster = await getMoviePoster(
        movieData.title,
        movieData.type
      );
      setMoviePoster(poster);
      setLoadingMovie(false);
    }
    fetchMoviePoster();
  }, [movieData.title, movieData.type]);

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
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const filled = i < Math.floor(rating);
      const halfFilled = !filled && i < rating;
      
      if (halfFilled) {
        // Half star
        return (
          <svg
            key={i}
            className="w-4 h-4 text-accent-yellow"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="rgb(156, 163, 175, 0.3)" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
      
      return (
        <svg
          key={i}
          className={`w-4 h-4 ${filled ? 'text-accent-yellow' : 'text-muted/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    });
  };

  return (
    <section
      id="currently"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-background"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div ref={titleRef} className="mb-12">
          <h2 className="text-6xl md:text-8xl font-display font-bold mb-2">
            Currently <span className="italic text-primary">Vibing</span>
          </h2>
          <p className="text-primary text-xs tracking-widest font-label font-bold uppercase">
            CURATION OF THE DIGITAL PRESENT // VOL. 24
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Latest Blog Post - 2 columns wide, Row 1 */}
          {latestBlogPost && (
            <div className="currently-card lg:col-span-2 relative rounded-xl overflow-hidden h-[400px] group">
              {/* Full-bleed background image */}
              {latestBlogPost.mainImage && (
                <Image
                  src={urlFor(latestBlogPost.mainImage).width(800).height(600).url()}
                  alt={latestBlogPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Category tag */}
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-label font-bold bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm uppercase tracking-wider">
                    DIGITAL ETHOS
                  </span>
                </div>
                
                {/* Title and Read More at bottom */}
                <div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-3 leading-tight">
                    {latestBlogPost.title}
                  </h3>
                  <button className="text-sm text-primary hover:underline font-body font-medium flex items-center gap-2">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Music Player - Row 1 */}
          <div className="currently-card h-[400px]">
            <CircularMusicPlayer
              songName={musicData.songName}
              artistName={musicData.artistName}
              albumCover={albumCover}
              previewUrl={previewUrl}
              loading={loadingAlbum}
            />
          </div>

          {/* Football Match - Row 2, Col 1 */}
          <FootballMatchCard />

          {/* Skill Sprint - Row 2, Col 2 */}
          <div className="currently-card bg-surface-container rounded-xl p-6 min-h-[280px] flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <span className="text-xs font-label font-bold text-tertiary tracking-wider uppercase">
                SKILL SPRINT
              </span>
              <svg className="w-5 h-5 text-tertiary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-heading font-bold text-white mb-6">
                {skillSprint?.courseName || 'Java Spring Boot Masterclass'}
              </h3>

              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground font-label mb-2">
                  <span>Course Progress</span>
                  <span>{skillSprint?.progress || 65}%</span>
                </div>
                <div className="h-2 bg-surface-bright rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-tertiary to-accent-purple rounded-full transition-all duration-1000"
                    style={{ width: `${skillSprint?.progress || 65}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-label mb-1 uppercase tracking-wider">Up Next:</p>
                <p className="text-sm text-white font-body font-medium">
                  {skillSprint?.upNextLesson || 'Building RESTful APIs'}
                </p>
              </div>
            </div>
          </div>

          {/* Recently Watched - Row 2, Col 3 */}
          <div className="currently-card relative rounded-xl overflow-hidden min-h-[280px] group">
            {/* Full poster background */}
            {loadingMovie ? (
              <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : moviePoster ? (
              <Image
                src={moviePoster}
                alt={`${movieData.title} poster`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
                <svg className="w-16 h-16 text-surface-bright" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
            )}
            
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              {/* Label */}
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-label font-bold bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm uppercase tracking-wider">
                  RECENTLY WATCHED
                </span>
              </div>
              
              {/* Title and Rating at bottom */}
              <div>
                <h3 className="text-xl font-heading font-bold text-white mb-2 leading-tight">
                  {movieData.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(movieData.rating || 5)}
                  </div>
                  <span className="text-sm text-white font-body font-medium">
                    {(movieData.rating || 5).toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
