"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FolderOpen, Wrench, Mountain, Mail, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "home", label: "Home", icon: Home, href: "#home" },
  { id: "projects", label: "Projects", icon: FolderOpen, href: "#projects" },
  { id: "skills", label: "Skills", icon: Wrench, href: "#skills" },
  { id: "experience", label: "Experience", icon: Mountain, href: "#experience" },
  { id: "blog", label: "Blog", icon: NotebookPen, href: "/blog" },
  { id: "contact", label: "Contact", icon: Mail, href: "#contact" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isBlogRoute = pathname.startsWith('/blog');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isBlogRoute) {
      setActiveSection('blog');
    }
  }, [isBlogRoute]);

  const scrollToSection = (href: string) => {
    if (pathname !== '/') {
      router.push(`/${href}`);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-surface-glass/60 backdrop-blur-glass border border-border rounded-full px-6 py-3 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'blog' ? isBlogRoute : activeSection === item.id && pathname === '/';
          const isPageLink = item.href.startsWith('/');

          const classes = cn(
            "relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
            "hover:bg-primary/10",
            isActive && "bg-primary text-primary-foreground"
          );

          if (isPageLink) {
            return (
              <Link key={item.id} href={item.href} className={classes} title={item.label}>
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.href);
                setActiveSection(item.id);
              }}
              className={classes}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden md:inline text-sm font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
