# Portfolio Website - Divya Panchori

Modern, animated portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Sanity CMS.

## Features

- 🎨 Easily configurable theme system
- 📝 CMS-driven content (Projects, Skills, Experience, Blog)
- 🎬 Advanced animations with GSAP
- 💻 Interactive terminal interface
- 🏔️ Unique mountain trek experience timeline
- 📱 Fully responsive design
- ⚡ Optimized performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP + Framer Motion
- **CMS**: Sanity
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
portfolio/
├── app/                  # Next.js app directory
├── components/          # React components
│   ├── layout/         # Header, Footer, Navigation
│   ├── sections/       # Page sections (Hero, Projects, etc.)
│   ├── ui/             # Reusable UI components
│   └── animations/     # Animation wrappers
├── lib/                # Utilities and configs
│   ├── theme/         # Theme system
│   ├── sanity/        # Sanity client and queries
│   └── utils.ts       # Helper functions
├── sanity/             # Sanity CMS schemas
├── public/             # Static assets
└── docs/              # Documentation
    ├── PROJECT-SPEC.md
    ├── THEME-SYSTEM.md
    └── CONTENT-STRUCTURE.md
```

## Documentation

- [Project Specification](./PROJECT-SPEC.md) - Complete design specs
- [Theme System](./THEME-SYSTEM.md) - How to customize themes
- [Content Structure](./CONTENT-STRUCTURE.md) - Sanity CMS schemas

## Theme Configuration

To change the theme, edit `lib/theme/theme-config.ts`:

```typescript
export const activeTheme = "warmDark"; // Change to "coolDark", "light", etc.
```

## Development Status

- [x] Project setup
- [x] Theme system
- [ ] Sanity CMS setup
- [ ] Hero section
- [ ] Terminal section
- [ ] Projects section
- [ ] Skills section
- [ ] Experience timeline
- [ ] Contact form
- [ ] Blog pages
- [ ] Animations
- [ ] Deployment

## License

MIT

## Author

**Divya Panchori**  
- GitHub: [@divyavert](https://github.com/divyavert)
- LinkedIn: [divya-panchori](https://linkedin.com/in/divya-panchori)
- Email: dpanchori94@gmail.com
