'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { getMusicData } from '@/lib/api/itunes';
import { getMoviePoster } from '@/lib/api/tmdb';
import type { BlogPost, CurrentlyLoving, PersonalInfo, RecentlyWatched, SkillSprint } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';
import { CircularMusicPlayer } from '@/components/CircularMusicPlayer';
import { FootballMatchCard } from '@/components/FootballMatchCard';

gsap.registerPlugin(ScrollTrigger);

interface CurrentlyProps {
  currentlyLoving: CurrentlyLoving | null;
  recentlyWatched: RecentlyWatched | null;
  latestBlogPost: BlogPost | null;
  personalInfo: PersonalInfo | null;
  skillSprint: SkillSprint | null;
}

export default function Currently({
  currentlyLoving,
  recentlyWatched,
  latestBlogPost,
  personalInfo,
  skillSprint,
}: CurrentlyProps) {
  const musicData = currentlyLoving || {
    songName: 'Shape of You',
    artistName: 'Ed Sheeran',
    albumName: 'Divide',
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
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [albumCover, setAlbumCover] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [moviePoster, setMoviePoster] = useState<string | null>(null);
  const [loadingAlbum, setLoadingAlbum] = useState(true);
  const [loadingMovie, setLoadingMovie] = useState(true);

  useEffect(() => {
    async function fetchMusicData() {
      setLoadingAlbum(true);
      const data = await getMusicData(musicData.songName, musicData.artistName);
      setAlbumCover(data.albumCover);
      setPreviewUrl(data.previewUrl);
      setLoadingAlbum(false);
    }

    fetchMusicData();
  }, [musicData.songName, musicData.artistName]);

  useEffect(() => {
    async function fetchMoviePoster() {
      setLoadingMovie(true);
      const poster = await getMoviePoster(movieData.title, movieData.type);
      setMoviePoster(poster);
      setLoadingMovie(false);
    }

    fetchMoviePoster();
  }, [movieData.title, movieData.type]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
        }
      );

      gsap.fromTo(
        cardsRef.current?.querySelectorAll('.currently-card') || [],
        { y: 48, opacity: 0 },
        {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
          },
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          immediateRender: false,
        }
      );
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

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const filled = index < Math.floor(rating);
      const halfFilled = !filled && index < rating;

      if (halfFilled) {
        return (
          <svg
            key={index}
            className="h-4 w-4 text-accent-yellow"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-${index}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="rgb(156, 163, 175, 0.3)" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${index})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      }

      return (
        <svg
          key={index}
          className={`h-4 w-4 ${filled ? 'text-accent-yellow' : 'text-muted/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    });
  };

  return (
    <section id="currently" ref={sectionRef} className="px-4 py-24 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div ref={titleRef} className="mb-12">
          <p className="mb-3 text-[11px] font-label font-bold uppercase tracking-[0.28em] text-primary">
            Right now
          </p>
          <h2 className="text-4xl font-display font-bold leading-none md:text-6xl">
            Currently <span className="italic text-primary">Vibing</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            A quieter snapshot of what I am listening to, watching, reading, learning, and living lately.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestBlogPost ? (
            <article className="currently-card overflow-hidden rounded-2xl border border-white/10 bg-surface-container shadow-[0_2px_10px_rgba(0,0,0,0.16)]">
              <div className="relative aspect-[4/3] bg-surface-container-high">
                {latestBlogPost.mainImage ? (
                  <Image
                    src={urlFor(latestBlogPost.mainImage).width(800).height(600).url()}
                    alt={latestBlogPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414A2 2 0 0017.414 7L14 3.586A2 2 0 0012.586 3H4zm8 1.414L15.586 8H13a1 1 0 01-1-1V4.414z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex min-h-[208px] flex-col gap-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-[0.24em] text-primary">
                    Latest writing
                  </span>
                  {latestBlogPost.readingTime ? (
                    <span className="text-[11px] font-label uppercase tracking-[0.22em] text-muted-foreground">
                      {latestBlogPost.readingTime} min
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-xl font-display font-bold leading-tight text-foreground">
                    {latestBlogPost.title}
                  </h3>
                  {latestBlogPost.excerpt ? (
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {latestBlogPost.excerpt}
                    </p>
                  ) : null}
                </div>

                {latestBlogPost.categories?.length ? (
                  <div className="mt-auto flex flex-wrap gap-2">
                    {latestBlogPost.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="rounded-lg border border-white/8 bg-surface-container-high px-2.5 py-1 text-[10px] font-label uppercase tracking-[0.18em] text-muted-foreground"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ) : (
            <div className="currently-card flex min-h-[280px] flex-col rounded-2xl border border-white/10 bg-surface-container p-5 shadow-[0_2px_10px_rgba(0,0,0,0.16)]">
              <div className="mb-6 flex items-start justify-between gap-4">
                <span className="text-[10px] font-label font-bold uppercase tracking-[0.24em] text-primary">
                  Latest writing
                </span>
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414A2 2 0 0017.414 7L14 3.586A2 2 0 0012.586 3H4zm8 1.414L15.586 8H13a1 1 0 01-1-1V4.414z" />
                </svg>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold leading-tight text-foreground">
                    No post published yet
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Essays, notes, and longer thoughts will show up here once something new goes live.
                  </p>
                </div>

                <div className="rounded-xl border border-white/8 bg-surface-container-high px-4 py-3">
                  <p className="mb-1 text-[10px] font-label uppercase tracking-[0.22em] text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm font-medium text-foreground">Drafting the next one</p>
                </div>
              </div>
            </div>
          )}

          <div className="currently-card h-full">
            <CircularMusicPlayer
              songName={musicData.songName}
              artistName={musicData.artistName}
              albumName={musicData.albumName}
              albumCover={albumCover}
              previewUrl={previewUrl}
              loading={loadingAlbum}
            />
          </div>

          <FootballMatchCard />

          <div className="currently-card flex min-h-[280px] flex-col rounded-2xl border border-white/10 bg-surface-container p-5 shadow-[0_2px_10px_rgba(0,0,0,0.16)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <span className="text-[10px] font-label font-bold uppercase tracking-[0.24em] text-tertiary">
                Skill sprint
              </span>
              <svg className="h-4 w-4 text-tertiary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <div className="space-y-2">
                <h3 className="text-xl font-display font-bold leading-tight text-foreground">
                  {skillSprint?.courseName || 'Java Spring Boot Masterclass'}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Deepening backend fundamentals with short, consistent study sessions.
                </p>
              </div>

              {skillSprint?.focus || skillSprint?.cadence ? (
                <div className="grid grid-cols-2 gap-3">
                  {skillSprint?.focus ? (
                    <div className="rounded-xl border border-white/8 bg-surface-container-high px-4 py-3">
                      <p className="mb-1 text-[10px] font-label uppercase tracking-[0.22em] text-muted-foreground">
                        Focus
                      </p>
                      <p className="text-sm font-medium text-foreground">{skillSprint.focus}</p>
                    </div>
                  ) : null}
                  {skillSprint?.cadence ? (
                    <div className="rounded-xl border border-white/8 bg-surface-container-high px-4 py-3">
                      <p className="mb-1 text-[10px] font-label uppercase tracking-[0.22em] text-muted-foreground">
                        Cadence
                      </p>
                      <p className="text-sm font-medium text-foreground">{skillSprint.cadence}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-auto space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-[11px] font-label uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Progress</span>
                    <span>{skillSprint?.progress || 65}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-bright">
                    <div
                      className="h-full rounded-full bg-tertiary transition-all duration-700"
                      style={{ width: `${skillSprint?.progress || 65}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/8 bg-surface-container-high px-4 py-3">
                  <p className="mb-1 text-[10px] font-label uppercase tracking-[0.22em] text-muted-foreground">
                    Up next
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {skillSprint?.upNextLesson || 'Building RESTful APIs'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <article className="currently-card overflow-hidden rounded-2xl border border-white/10 bg-surface-container shadow-[0_2px_10px_rgba(0,0,0,0.16)]">
            <div className="relative aspect-[4/3] bg-surface-container-high">
              {loadingMovie ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : moviePoster ? (
                <Image
                  src={moviePoster}
                  alt={`${movieData.title} poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex min-h-[208px] flex-col gap-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-[0.24em] text-primary">
                  Recently watched
                </span>
                {movieData.year ? (
                  <span className="text-[11px] font-label uppercase tracking-[0.18em] text-muted-foreground">
                    {movieData.year}
                  </span>
                ) : null}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-display font-bold leading-tight text-foreground">
                  {movieData.title}
                </h3>
                {movieData.genre ? (
                  <p className="text-sm leading-6 text-muted-foreground">{movieData.genre}</p>
                ) : null}
              </div>

              <div className="mt-auto flex items-center gap-2 text-sm text-foreground">
                <div className="flex items-center gap-1">{renderStars(movieData.rating || 5)}</div>
                <span className="text-muted-foreground">{(movieData.rating || 5).toFixed(1)} / 5.0</span>
              </div>
            </div>
          </article>

          <div className="currently-card flex min-h-[280px] flex-col rounded-2xl border border-white/10 bg-surface-container p-5 shadow-[0_2px_10px_rgba(0,0,0,0.16)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <span className="text-[10px] font-label font-bold uppercase tracking-[0.24em] text-accent-blue">
                Local time
              </span>
              <svg className="h-4 w-4 text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-8V6a1 1 0 10-2 0v5a1 1 0 00.293.707l2.5 2.5a1 1 0 101.414-1.414L11 10z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <div>
                <p className="text-4xl font-display font-bold leading-none text-foreground xl:text-[4.5rem]">
                  {formatTime(currentTime)}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Based in {location}. Usually online late evenings and early mornings IST.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/8 bg-surface-container-high px-4 py-3">
                  <p className="mb-1 text-[10px] font-label uppercase tracking-[0.22em] text-muted-foreground">
                    Today
                  </p>
                  <p className="text-sm font-medium text-foreground">{formatDay(currentTime)}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-surface-container-high px-4 py-3">
                  <p className="mb-1 text-[10px] font-label uppercase tracking-[0.22em] text-muted-foreground">
                    Window
                  </p>
                  <p className="text-sm font-medium text-foreground">Evenings IST</p>
                </div>
              </div>

              <div className="mt-auto rounded-xl border border-white/8 bg-surface-container-high px-4 py-3">
                <p className="mb-1 text-[10px] font-label uppercase tracking-[0.22em] text-muted-foreground">
                  Timezone
                </p>
                <p className="text-sm font-medium text-foreground">Asia/Kolkata</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
