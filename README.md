# CYBERFORAGE

> **Explore. Build. Defend.**  
> A technology ecosystem for cybersecurity, security research, intelligent automation, and defensive engineering.  
> Official Domain: [https://cyberforage.space](https://cyberforage.space)

---

## 🌐 Overview

Cyberforage is an independent technology and security platform bringing together security research, defensive engineering, AI automation, and hands-on laboratory environments into a unified ecosystem.

### Core Architecture

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Visuals**: Native HTML5 Canvas 3D Particle Globe & SVG Micro-architectures
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

---

## 📁 Project Structure

```
cyberforage/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata, OG/Twitter tags
│   ├── page.tsx                # Complete 11-section homepage
│   ├── globals.css             # Dark theme styling, cyan glow utilities, custom scrollbars
│   ├── robots.ts               # Robots.txt configuration
│   ├── sitemap.ts              # Dynamic sitemap generator
│   └── favicon.ico / svg       # Hexagonal brand icon
├── components/
│   ├── ui/
│   │   └── BrandLogo.tsx       # SVG geometric hexagon cyber mark with glowing core
│   ├── navbar/
│   │   └── Navbar.tsx          # Sticky responsive header with active indicator & drawer
│   ├── hero/
│   │   ├── Hero.tsx            # Hero typography, CTA buttons, metadata indicator
│   │   └── CyberGlobe.tsx      # Canvas 3D particle globe with orbital rings & node connections
│   ├── ecosystem/
│   │   └── Ecosystem.tsx       # "More Than Just Projects" intro & 3 pillar cards
│   ├── projects/
│   │   └── FeaturedProjects.tsx# SentinelX, CyberForge, and PDF Malware Analyzer
│   ├── exploration/
│   │   └── WhatWeExplore.tsx   # 6 domain cards (Cyber Defense, Threat Intel, DFIR, etc.)
│   ├── labs/
│   │   └── CyberforageLabs.tsx # Hands-on labs split section & Available Labs panel
│   ├── technologies/
│   │   └── Technologies.tsx    # 10 Modern tool tiles, telemetry equalizer, and Big Picture
│   ├── research/
│   │   └── ResearchInsights.tsx# Latest research & insights article previews
│   ├── open-source/
│   │   └── OpenSourceBanner.tsx# GitHub link + "Build something secure" CTA
│   ├── contact/
│   │   └── ContactModal.tsx    # Accessible modal for "Get in touch"
│   └── footer/
│       └── Footer.tsx          # Minimalist dark footer matching reference design
├── lib/
│   ├── constants/
│   │   └── siteData.ts         # Centralized navigation, projects, labs, and research data
│   └── utils/
│       └── cn.ts               # Class merging utility
└── public/
    ├── favicon.svg             # SVG vector favicon
    └── og-image.png            # Open Graph social preview
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## ⚡ Deployment to Vercel

1. Push this repository to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Cyberforage homepage"
git remote add origin https://github.com/nishchaygaur/cyberforage.git
git push -u origin main
```

2. Import the repository into [Vercel](https://vercel.com).
3. Set the domain to `cyberforage.space`.
4. Deploy with standard Next.js preset.

---

## 🛡️ License

© 2026 Cyberforage. All rights reserved.
