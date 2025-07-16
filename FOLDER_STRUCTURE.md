# 📁 Project Folder Structure

This project is a modern portfolio built with **Next.js 13+**, featuring server components, dynamic routing, reusable UI, and clean modular architecture.

---

## 🧭 Overview

/
├── app/ # Main application routes (Next.js App Router)
│ ├── about/ # About page route
│ ├── contact/ # Contact page route
│ ├── projects/ # Projects page route
│ ├── resume/ # Resume page route
│ ├── api/ # API routes (e.g., contact form handler)
│ ├── layout.tsx # Root layout (global HTML wrapper)
│ └── page.tsx # Home page (landing screen)

├── components/ # All reusable React components
│ ├── ui/ # ShadCN & Radix UI components (Button, Input, etc.)
│ ├── shared/ # Shared UI: Navbar, Footer, ThemeToggle, etc.
│ ├── cards/ # Cards: ProjectCard, ExperienceCard, etc.
│ ├── sections/ # HeroSection, AboutSection, ContactSection, etc.
│ ├── forms/ # ContactForm, ResumeForm
│ └── icons/ # Custom SVGs or Lucide icon wrappers

├── lib/ # Utility and helper functions
│ ├── utils.ts # General helper functions
│ ├── constants.ts # Static values (skills, links, tech stacks)
│ ├── email.ts # Email handler logic (Email.js or Nodemailer)
│ └── shadcn-config.ts # Theme customization for ShadCN (optional)

├── types/ # Global TypeScript types
│ └── index.ts # Types for Project, Experience, etc.

├── styles/ # Styling system
│ ├── globals.css # Global styles
│ ├── tailwind.config.ts # TailwindCSS configuration
│ └── theme.css # Custom theme variables (light/dark)

├── public/ # Static assets accessible in the browser
│ └── images/ # Profile pic, project screenshots, favicon

├── data/ # Static JSON/TS data sources
│ ├── projects.ts # Project data
│ └── experience.ts # Work history / timeline data

├── .env.local # Local environment variables (API keys, etc.)
├── next.config.js # Next.js project configuration
└── README.md # Project overview and instructions

markdown
Copy code


---

## ✅ Key Concepts

- **Modularity**: Each UI component is isolated for reuse and scalability.
- **Server & Client** separation: API logic lives in `app/api`, form logic in `lib/email.ts`.
- **Static data**: Data lives in `data/` for fast loading and easy CMS migration.
- **Design system**: Uses `shadcn/ui` with Tailwind and custom tokens.
- **SEO-ready** and deployable via Vercel, Netlify, or custom setup.

---

## 📌 Tips

- Update `.env.local` with your EmailJS, Resend, or SMTP keys.
- Customize `tailwind.config.ts` and `theme.css` for brand theming.
- Keep `types/index.ts` in sync with `data/` and API response shapes.
