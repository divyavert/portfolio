"use client";

import { usePathname } from 'next/navigation';
import { Github, Linkedin, Twitter, Instagram, Download } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/divyavert",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com/in/divya-panchori",
  },
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com",
  },
];

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const resolvedQuickLinks = quickLinks.map((link) => ({
    ...link,
    href: link.href.startsWith('#') && !isHome ? `/${link.href}` : link.href,
  }));

  return (
    <footer className="bg-surface-container">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-display font-bold mb-2">
              Divya Panchori
            </h3>
            <p className="text-muted-foreground mb-2 font-body">Software Engineer</p>
            <p className="text-sm text-muted-foreground font-body">
              Built with Next.js & lots of ☕
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-label text-xs uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {resolvedQuickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors font-body"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-label text-xs uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-surface-bright hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                    title={link.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 outline outline-1 outline-border/15 text-center text-sm text-muted-foreground font-body">
          <p>© {new Date().getFullYear()} Divya Panchori. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
