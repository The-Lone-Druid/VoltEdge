# VoltEdge - AI Coding Instructions

## 🔋 Project Overview

VoltEdge is a **B2B SaaS for electrical dealers** specializing in GST calculations, battery warranty tracking, backup estimations, and professional quotation generation. Built with Next.js 15 (App Router), Prisma, and shadcn/ui components.

## 🎯 Core Business Logic Areas

- **GST & Pricing**: Tax calculations, B2C/B2B pricing models
- **Battery Management**: Warranty tracking, backup time calculations for Lead Acid/SMF/Lithium
- **Quotation System**: Professional PDF generation with branding, sharable links, conversion tracking
- **Dealer Portal**: Product catalogs, settings, custom templates

## 🏗️ Architecture & Stack

### Tech Stack

- **Frontend**: Next.js 15 + TurboNext, React 19, TypeScript 5
- **UI**: shadcn/ui (New York style), Tailwind CSS 4, Radix primitives
- **Database**: PostgreSQL + Prisma (custom output: `src/generated/prisma`)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Motion (framer-motion), MagicUI components

### Key Directories

```
src/
├── app/                  # Next.js App Router pages
├── components/
│   ├── ui/              # shadcn/ui components
│   └── magicui/         # Custom animated components (Globe, etc.)
├── generated/prisma/    # Custom Prisma client location
├── hooks/               # React hooks (use-mobile.ts)
└── lib/utils.ts        # Utility functions (cn helper)
```

## 🛠️ Development Workflow

### Essential Commands

```bash
# Development with Turbo
npm run dev              # Uses --turbopack flag

# Database Operations
npm run db:generate      # Generate Prisma client
npm run db:push         # Push schema without migration
npm run db:migrate      # Create and apply migration
npm run db:studio       # Open Prisma Studio
npm run db:reset        # Reset database completely

# Build & Deploy
npm run build           # Turbo build with Prisma generation
npm run type-check      # TypeScript validation
```

### Code Quality Setup

- **ESLint**: Next.js + TypeScript rules with ignore patterns
- **Prettier**: Auto-formatting with Tailwind plugin
- **Husky + lint-staged**: Pre-commit hooks for code quality
- **Commitlint**: Conventional commits enforced

## 📋 Project-Specific Conventions

### Component Patterns

- Use shadcn/ui components from `@/components/ui`
- Custom components in `magicui/` for animated elements
- Utility classes managed via `cn()` helper in `@/lib/utils`
- Form handling with `react-hook-form` + Zod schemas

### Database Patterns

- Prisma client generated to `src/generated/prisma` (not default location)
- PostgreSQL as primary database
- Always run `prisma generate` after schema changes

### Import Aliases (from components.json)

- `@/components` → src/components
- `@/lib` → src/lib
- `@/hooks` → src/hooks
- `@/ui` → src/components/ui

## 🎨 UI/UX Guidelines

- **Design System**: shadcn/ui "new-york" style with neutral base colors
- **Typography**: Geist Sans + Geist Mono fonts
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first approach with `use-mobile` hook

## ⚡ Performance Considerations

- TurboNext enabled for faster builds and dev server
- Motion library for smooth animations
- Prisma client optimized for edge functions
- CSS variables for theming support

## 🔍 Key Files to Reference

- `.github/requirements.md` - Detailed business requirements and user stories
- `components.json` - shadcn/ui configuration and aliases
- `prisma/schema.prisma` - Database schema (currently minimal setup)
- `src/components/magicui/globe.tsx` - Example of complex animated component

## 📝 When Adding Features

1. Check requirements.md for business context and user stories
2. Use existing shadcn/ui components when possible
3. Follow the established import alias patterns
4. Run database commands via npm scripts, not direct Prisma CLI
5. Ensure TypeScript strict mode compliance
6. Test responsive behavior with mobile hook
