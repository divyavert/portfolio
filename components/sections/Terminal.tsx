'use client';

import { useState, useEffect, useRef } from 'react';

interface CommandHistory {
  input: string;
  output: string | JSX.Element;
}

const commands = {
  help: `Available commands:
  
  help         - Show this help message
  about        - Learn more about me
  skills       - View my technical skills
  projects     - See my featured projects
  contact      - Get my contact information
  snake        - Play a snake game (easter egg!)
  clear        - Clear the terminal
  
Type a command and press Enter.`,

  about: `Hey there! 👋

I'm Divya Panchori, a passionate Software Engineer with 2+ years of experience.
I love building innovative solutions and creating seamless user experiences.

My journey in tech has been driven by curiosity and a constant desire to learn.
I specialize in full-stack development, with a focus on modern web technologies.

Fun fact: I've written more lines of code than I can count! ☕`,

  skills: `Technical Skills:

Frontend:
  • React.js / Next.js
  • TypeScript / JavaScript
  • Tailwind CSS / CSS3
  • HTML5

Backend:
  • Node.js
  • Python
  • RESTful APIs
  • Database Design

Tools & Other:
  • Git / GitHub
  • Docker
  • CI/CD
  • Agile Methodologies`,

  projects: `Featured Projects:

1. Portfolio Website (This site!)
   • Next.js 14, TypeScript, Sanity CMS
   • GSAP animations, Interactive CLI
   
2. E-commerce Platform
   • Full-stack solution with React & Node.js
   • Payment integration, Admin dashboard
   
3. Task Management App
   • Real-time collaboration features
   • Drag-and-drop interface

Type 'contact' to discuss projects with me!`,

  contact: `Let's Connect! 📬

Email:    dpanchori94@gmail.com
GitHub:   github.com/divyavert
LinkedIn: linkedin.com/in/divya-panchori

Feel free to reach out for collaborations, opportunities, or just to say hi!`,

  clear: '__CLEAR__',
  snake: '__SNAKE__',
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      input: '',
      output: (
        <div className="text-accent-green">
          Welcome to my interactive terminal! 🚀
          <br />
          Type <span className="text-primary font-bold">'help'</span> to see available commands.
        </div>
      ),
    },
  ]);
  const [commandIndex, setCommandIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const commandHistoryRef = useRef<string[]>([]);

  useEffect(() => {
    // Auto-scroll to bottom when history updates
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    commandHistoryRef.current.push(trimmedCmd);
    setCommandIndex(-1);

    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmedCmd === 'snake') {
      setHistory((prev) => [
        ...prev,
        {
          input: cmd,
          output: (
            <div className="text-accent-yellow">
              🎮 Snake game coming soon! Stay tuned for this easter egg...
            </div>
          ),
        },
      ]);
      return;
    }

    const output = commands[trimmedCmd as keyof typeof commands] || 
      `Command not found: ${trimmedCmd}. Type 'help' for available commands.`;

    setHistory((prev) => [
      ...prev,
      {
        input: cmd,
        output: typeof output === 'string' ? output : output,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = commandIndex + 1;
      const historyLength = commandHistoryRef.current.length;
      
      if (newIndex < historyLength) {
        setCommandIndex(newIndex);
        setInput(commandHistoryRef.current[historyLength - 1 - newIndex]);
      }
    }
    
    // Arrow down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = commandIndex - 1;
      
      if (newIndex >= 0) {
        setCommandIndex(newIndex);
        const historyLength = commandHistoryRef.current.length;
        setInput(commandHistoryRef.current[historyLength - 1 - newIndex]);
      } else {
        setCommandIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <section id="terminal" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Interactive <span className="text-primary">Terminal</span>
          </h2>
          <p className="text-muted-foreground">
            Try typing some commands below. It's more fun than a regular resume!
          </p>
        </div>

        {/* Terminal Window */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary/20 shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-card-hover border-b border-primary/20 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <div className="w-3 h-3 rounded-full bg-success"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm text-muted-foreground font-mono">
                divya@portfolio:~$
              </span>
            </div>
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalRef}
            className="bg-background/50 p-6 font-mono text-sm h-96 overflow-y-auto scroll-smooth"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Command History */}
            {history.map((item, index) => (
              <div key={index} className="mb-4">
                {item.input && (
                  <div className="flex gap-2 mb-2">
                    <span className="text-accent-green">➜</span>
                    <span className="text-accent-blue">~</span>
                    <span className="text-foreground">{item.input}</span>
                  </div>
                )}
                <div className="text-muted-foreground whitespace-pre-wrap pl-6">
                  {item.output}
                </div>
              </div>
            ))}

            {/* Current Input Line */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <span className="text-accent-green">➜</span>
              <span className="text-accent-blue">~</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-foreground caret-primary"
                autoFocus
                spellCheck={false}
              />
            </form>

            {/* Blinking cursor */}
            <div className="inline-block w-2 h-4 bg-primary animate-pulse ml-12"></div>
          </div>

          {/* Terminal Footer */}
          <div className="bg-card-hover border-t border-primary/20 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Use ↑↓ arrows to navigate command history</span>
            <span className="text-accent-green">●</span>
          </div>
        </div>

        {/* Quick Command Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {Object.keys(commands)
            .filter((cmd) => !['clear', 'snake'].includes(cmd))
            .map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setInput(cmd);
                  inputRef.current?.focus();
                }}
                className="px-4 py-2 bg-card hover:bg-primary/10 border border-primary/20 hover:border-primary rounded-lg text-sm font-mono transition-all duration-200 hover:scale-105"
              >
                {cmd}
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}
