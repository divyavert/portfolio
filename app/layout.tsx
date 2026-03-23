import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Divya Panchori - Software Engineer | Frontend Specialist",
  description:
    "Portfolio of Divya Panchori, Software Engineer specializing in React, Go, and AI-integrated applications. 2+ years of experience building innovative solutions.",
  keywords: [
    "software engineer",
    "frontend developer",
    "react developer",
    "full stack",
    "portfolio",
    "Divya Panchori",
  ],
  authors: [{ name: "Divya Panchori" }],
  creator: "Divya Panchori",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Divya Panchori - Software Engineer",
    description:
      "Portfolio showcasing software engineering projects and expertise in React, Go, and AI integration.",
    siteName: "Divya Panchori Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Divya Panchori - Software Engineer",
    description:
      "Portfolio showcasing software engineering projects and expertise in React, Go, and AI integration.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="preload">
        {children}
      </body>
    </html>
  );
}
