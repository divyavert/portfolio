'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PersonalInfo } from '@/lib/sanity/types';

gsap.registerPlugin(ScrollTrigger);

type TerminalStep =
  | 'name'
  | 'email'
  | 'subject'
  | 'message'
  | 'confirm'
  | 'complete';

interface TerminalLine {
  type: 'prompt' | 'input' | 'error' | 'success' | 'info';
  content: string;
  timestamp?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactProps {
  personalInfo: PersonalInfo | null;
}

const PROMPTS = {
  name: '> SENDER_NAME:',
  email: '> SENDER_EMAIL:',
  subject: '> MESSAGE_SUBJECT:',
  message: '> MESSAGE_CONTENT:',
  confirm: '> CONFIRM_TRANSMISSION? (yes/no):',
};

export default function Contact({ personalInfo }: ContactProps) {
  // Fallback data
  const email = personalInfo?.email || 'dpanchori94@gmail.com';
  const github = personalInfo?.social?.github || 'https://github.com/divyavert';
  const linkedin =
    personalInfo?.social?.linkedin || 'https://linkedin.com/in/divya-panchori';

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const orbitsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState<TerminalStep>('name');
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    {
      type: 'info',
      content: '> INITIALIZING_MESSAGE_TERMINAL...',
      timestamp: new Date().toISOString(),
    },
    {
      type: 'success',
      content: '> SYSTEM_READY',
      timestamp: new Date().toISOString(),
    },
    {
      type: 'info',
      content: '> Please provide the following information:',
      timestamp: new Date().toISOString(),
    },
    {
      type: 'prompt',
      content: PROMPTS.name,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync cursor position from the real (hidden) input element
  const syncCursor = () => {
    const el = inputRef.current;
    if (el && 'selectionStart' in el && el.selectionStart !== null) {
      setCursorPosition(el.selectionStart);
    }
  };

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current && currentStep !== 'complete') {
      inputRef.current.focus();
    }
  }, [currentStep]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title glitch entrance
      gsap.fromTo(titleRef.current,
        { autoAlpha: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          immediateRender: false,
        }
      );

      // Terminal boot-up animation
      gsap.fromTo(terminalRef.current,
        { autoAlpha: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: terminalRef.current,
            start: 'top 75%',
          },
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          immediateRender: false,
        }
      );

      // Orbital social links
      const orbitals = orbitsRef.current?.querySelectorAll('.orbital') || [];
      gsap.fromTo(orbitals,
        { scale: 0, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: orbitsRef.current,
            start: 'top 70%',
          },
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          immediateRender: false,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToHistory = (line: TerminalLine) => {
    setTerminalHistory((prev) => [
      ...prev,
      { ...line, timestamp: new Date().toISOString() },
    ]);
  };

  const validateInput = (step: TerminalStep, value: string): string | null => {
    switch (step) {
      case 'name':
        if (!value.trim()) return '> ERROR: NAME_REQUIRED';
        if (value.trim().length < 2) return '> ERROR: NAME_TOO_SHORT';
        return null;
      case 'email':
        if (!value.trim()) return '> ERROR: EMAIL_REQUIRED';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return '> ERROR: INVALID_EMAIL_FORMAT';
        return null;
      case 'subject':
        if (!value.trim()) return '> ERROR: SUBJECT_REQUIRED';
        return null;
      case 'message':
        if (!value.trim()) return '> ERROR: MESSAGE_REQUIRED';
        if (value.trim().length < 10)
          return '> ERROR: MESSAGE_TOO_SHORT (minimum 10 characters)';
        return null;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    addToHistory({ type: 'info', content: '> TRANSMITTING...' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      addToHistory({ type: 'success', content: '> TRANSMISSION_SUCCESSFUL' });
      addToHistory({
        type: 'info',
        content: '> Message received. Response incoming within 24h.',
      });

      setCurrentStep('complete');
    } catch {
      addToHistory({ type: 'error', content: '> TRANSMISSION_FAILED' });
      addToHistory({ type: 'info', content: `> Try direct email: ${email}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processInput();
    }
  };

  const handleKeyUp = () => {
    syncCursor();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
    setCursorPosition(e.target.selectionStart ?? e.target.value.length);
  };

  const processInput = () => {
    const input = currentInput.trim();

    // Add user input to history
    addToHistory({ type: 'input', content: `  ${input}` });

    // Handle confirmation step
    if (currentStep === 'confirm') {
      if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'y') {
        handleSubmit();
      } else {
        addToHistory({ type: 'info', content: '> TRANSMISSION_CANCELLED' });
        addToHistory({ type: 'info', content: '> Starting over...' });

        setTimeout(() => {
          setCurrentStep('name');
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTerminalHistory([
            {
              type: 'info',
              content: '> INITIALIZING_MESSAGE_TERMINAL...',
              timestamp: new Date().toISOString(),
            },
            {
              type: 'success',
              content: '> SYSTEM_READY',
              timestamp: new Date().toISOString(),
            },
            {
              type: 'info',
              content: '> Please provide the following information:',
              timestamp: new Date().toISOString(),
            },
            {
              type: 'prompt',
              content: PROMPTS.name,
              timestamp: new Date().toISOString(),
            },
          ]);
        }, 1000);
      }
      setCurrentInput('');
      setCursorPosition(0);
      return;
    }

    // Validate current step
    const error = validateInput(currentStep, input);
    if (error) {
      addToHistory({ type: 'error', content: error });
      const prompt = PROMPTS[currentStep as keyof typeof PROMPTS];
      if (prompt) {
        addToHistory({ type: 'prompt', content: prompt });
      }
      setCurrentInput('');
      setCursorPosition(0);
      return;
    }

    // Save to form data
    setFormData((prev) => ({ ...prev, [currentStep]: input }));

    // Move to next step
    const stepOrder: TerminalStep[] = [
      'name',
      'email',
      'subject',
      'message',
      'confirm',
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    const nextStep = stepOrder[currentIndex + 1];

    if (nextStep === 'confirm') {
      // Show summary before confirmation
      addToHistory({ type: 'info', content: '> SUMMARY:' });
      addToHistory({
        type: 'info',
        content: `  Name: ${formData.name || (currentStep === 'name' ? input : '')}`,
      });
      addToHistory({
        type: 'info',
        content: `  Email: ${formData.email || (currentStep === 'email' ? input : '')}`,
      });
      addToHistory({
        type: 'info',
        content: `  Subject: ${formData.subject || (currentStep === 'subject' ? input : '')}`,
      });
      addToHistory({
        type: 'info',
        content: `  Message: ${formData.message || (currentStep === 'message' ? input : '')}`,
      });
      const confirmPrompt = PROMPTS[nextStep as keyof typeof PROMPTS];
      if (confirmPrompt) {
        addToHistory({ type: 'prompt', content: confirmPrompt });
      }
    } else if (nextStep) {
      const nextPrompt = PROMPTS[nextStep as keyof typeof PROMPTS];
      if (nextPrompt) {
        addToHistory({ type: 'prompt', content: nextPrompt });
      }
    }

    setCurrentStep(nextStep);
    setCurrentInput('');
    setCursorPosition(0);
  };

  const resetTerminal = () => {
    setCurrentStep('name');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTerminalHistory([
      {
        type: 'info',
        content: '> INITIALIZING_MESSAGE_TERMINAL...',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'success',
        content: '> SYSTEM_READY',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'info',
        content: '> Please provide the following information:',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'prompt',
        content: PROMPTS.name,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <section
      id='contact'
      ref={sectionRef}
      className='min-h-screen flex items-center justify-center px-4 py-20 bg-background relative overflow-hidden'
    >
      {/* CRT Scanlines Effect */}
      <div
        className='absolute inset-0 pointer-events-none opacity-[0.03]'
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          animation: 'scanlines 8s linear infinite',
        }}
      />

      {/* Glitch Grid Background */}
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,144,105,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,144,105,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className='container mx-auto max-w-6xl relative z-10'>
        {/* Section Header */}
        <div ref={titleRef} className='mb-16 text-center gsap-hidden'>
          <div className='inline-block mb-4'>
            <span className='text-xs font-mono text-accent-green tracking-wider'>
              {'>'} INITIALIZING_CONNECTION...
            </span>
          </div>
          <h2 className='text-6xl md:text-8xl font-display font-bold mb-4 relative'>
            <span className='relative inline-block'>
              Let&apos;s{' '}
              <span className='italic text-primary relative'>
                Connect
                {/* Glitch effect */}
                <span
                  className='absolute inset-0 text-secondary opacity-70 animate-pulse'
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
                >
                  Connect
                </span>
              </span>
            </span>
          </h2>
          <p className='text-primary text-xs tracking-[0.3em] font-mono font-bold uppercase'>
            {'>'} TRANSMIT_MESSAGE // ESTABLISH_CHANNEL
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          {/* Orbital Social Links - Left Column */}
          <div ref={orbitsRef} className='lg:col-span-1 space-y-6'>
            {/* Floating Social Orbitals */}
            <div className='space-y-4'>
              {/* Email Orbital */}
              <a
                href={`mailto:${email}`}
                className='orbital gsap-hidden block group relative'
              >
                <div className='relative bg-surface-container hover:bg-surface-container-high rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] border border-primary/10 hover:border-primary/20'>
                  {/* Holographic shine */}
                  <div
                    className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    style={{
                      background:
                        'linear-gradient(135deg, transparent 0%, rgba(255,144,105,0.05) 50%, transparent 100%)',
                    }}
                  />

                  <div className='relative flex items-center gap-4'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                      <svg
                        className='w-6 h-6 text-primary'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                        <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-xs font-mono text-muted-foreground mb-1'>
                        {'>'} EMAIL_ADDR
                      </div>
                      <div className='text-sm font-mono text-white truncate'>
                        {email}
                      </div>
                    </div>
                  </div>
                </div>
              </a>

              {/* GitHub Orbital */}
              <a
                href={github}
                target='_blank'
                rel='noopener noreferrer'
                className='orbital gsap-hidden block group relative'
              >
                <div className='relative bg-surface-container hover:bg-surface-container-high rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] border border-secondary/10 hover:border-secondary/20'>
                  <div
                    className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    style={{
                      background:
                        'linear-gradient(135deg, transparent 0%, rgba(0,227,253,0.05) 50%, transparent 100%)',
                    }}
                  />

                  <div className='relative flex items-center gap-4'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors'>
                      <svg
                        className='w-6 h-6 text-secondary'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-xs font-mono text-muted-foreground mb-1'>
                        {'>'} GITHUB_REPO
                      </div>
                      <div className='text-sm font-mono text-white truncate'>
                        {github.replace('https://', '')}
                      </div>
                    </div>
                  </div>
                </div>
              </a>

              {/* LinkedIn Orbital */}
              <a
                href={linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='orbital gsap-hidden block group relative'
              >
                <div className='relative bg-surface-container hover:bg-surface-container-high rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] border border-tertiary/10 hover:border-tertiary/20'>
                  <div
                    className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    style={{
                      background:
                        'linear-gradient(135deg, transparent 0%, rgba(165,140,255,0.05) 50%, transparent 100%)',
                    }}
                  />

                  <div className='relative flex items-center gap-4'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary/20 transition-colors'>
                      <svg
                        className='w-6 h-6 text-tertiary'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-xs font-mono text-muted-foreground mb-1'>
                        {'>'} LINKEDIN_NET
                      </div>
                      <div className='text-sm font-mono text-white truncate'>
                        {linkedin.replace('https://', '')}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* System Status */}
            <div className='bg-surface-container rounded-2xl p-6 border border-accent-green/10'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-2 h-2 rounded-full bg-accent-green animate-pulse' />
                <span className='text-xs font-mono text-accent-green uppercase tracking-wider'>
                  SYSTEM_STATUS
                </span>
              </div>
              <div className='space-y-2 text-xs font-mono'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    {'>'} RESPONSE_TIME:
                  </span>
                  <span className='text-white'>{'< 24H'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    {'>'} AVAILABILITY:
                  </span>
                  <span className='text-accent-green'>ONLINE</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    {'>'} REPLY_RATE:
                  </span>
                  <span className='text-white'>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Terminal - Right 2 Columns */}
          <div ref={terminalRef} className='lg:col-span-2 gsap-hidden'>
            <div className='relative bg-surface-container rounded-2xl overflow-hidden border border-primary/10'>
              {/* Terminal Header */}
              <div className='bg-surface-container-high px-6 py-3 border-b border-primary/10 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-destructive' />
                  <div className='w-3 h-3 rounded-full bg-accent-yellow' />
                  <div className='w-3 h-3 rounded-full bg-accent-green' />
                </div>
                <span className='text-xs font-mono text-muted-foreground'>
                  MESSAGE_TERMINAL_v2.4
                </span>
                {currentStep === 'complete' && (
                  <button
                    onClick={resetTerminal}
                    className='text-xs font-mono text-primary hover:text-primary/80 transition-colors'
                  >
                    RESET
                  </button>
                )}
              </div>

              {/* Terminal Body - Scrollable History */}
              <div
                ref={terminalBodyRef}
                className='p-8 space-y-2 font-mono text-sm h-[500px] overflow-y-auto custom-scrollbar'
              >
                {terminalHistory.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line.type === 'prompt'
                        ? 'text-accent-green font-bold'
                        : line.type === 'input'
                          ? 'text-white'
                          : line.type === 'error'
                            ? 'text-destructive'
                            : line.type === 'success'
                              ? 'text-accent-green'
                              : 'text-muted-foreground'
                    }`}
                  >
                    {line.content}
                  </div>
                ))}

                {/* Active Input Area */}
                {currentStep !== 'complete' && !isSubmitting && (
                  <div className='flex items-start gap-2'>
                    <span className='text-accent-green flex-shrink-0'>
                      {'>'}
                    </span>
                    <div className='flex-1 relative'>
                      {currentStep === 'message' ? (
                        <div className='relative'>
                          {/* Visual display with cursor for textarea */}
                          <div className='w-full font-mono text-white whitespace-pre-wrap break-words min-h-[4.5rem] pointer-events-none'>
                            <span>{currentInput.slice(0, cursorPosition)}</span>
                            <span className='inline-block w-2 h-5 bg-primary animate-pulse align-middle' />
                            <span>{currentInput.slice(cursorPosition)}</span>
                          </div>
                          <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={currentInput}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            onKeyUp={handleKeyUp}
                            onSelect={syncCursor}
                            onClick={syncCursor}
                            className='absolute inset-0 w-full h-full bg-transparent border-none outline-none text-transparent resize-none font-mono caret-transparent'
                            rows={3}
                            disabled={isSubmitting}
                          />
                        </div>
                      ) : (
                        <div className='relative flex items-center w-full min-h-[1.25rem]'>
                          {/* Visual display with cursor split at position */}
                          {currentInput.slice(0, cursorPosition) && (
                            <span className='font-mono text-white whitespace-pre'>{currentInput.slice(0, cursorPosition)}</span>
                          )}
                          <span className='inline-block w-2 h-[1.1em] bg-primary animate-pulse flex-shrink-0 self-center' />
                          {currentInput.slice(cursorPosition) && (
                            <span className='font-mono text-white whitespace-pre'>{currentInput.slice(cursorPosition)}</span>
                          )}
                          <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type={currentStep === 'email' ? 'email' : 'text'}
                            value={currentInput}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            onKeyUp={handleKeyUp}
                            onSelect={syncCursor}
                            onClick={syncCursor}
                            className='absolute inset-0 w-full bg-transparent border-none outline-none text-transparent font-mono caret-transparent'
                            disabled={isSubmitting}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 144, 105, 0.05);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 144, 105, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 144, 105, 0.5);
        }
      `}</style>
    </section>
  );
}
