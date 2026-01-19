# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kairos Planner is a Charlotte Mason-inspired homeschooling planner built with React and Firebase. It helps families organize curriculum by students, track daily tasks through "rhythms" (time blocks like Morning Basket, Nature Study), and generate student portfolio reports.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build to dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build
firebase deploy  # Deploy to Firebase Hosting
```

## Architecture

### Tech Stack
- **Frontend**: React 19 with Vite 7, Tailwind CSS 4 (PostCSS plugin)
- **Backend**: Firebase (Auth, Firestore)
- **AI**: Google Gemini API for narrative summaries
- **Icons**: lucide-react

### Application Structure

The app is a single-page application with most logic in `src/App.jsx`:

- **Authentication Flow**: Anonymous auth on first visit → optional Google account linking for persistence
- **Landing Page**: Marketing page shown to new users (`src/components/LandingPage.jsx`)
- **Main App**: Task planner with three views: Today, Bank, Calendar

### Data Model (Firestore)

Collections are nested under `/artifacts/{appId}/users/{userId}/`:

- **profiles**: Student records (`display_name`, `color`, `icon`)
- **rhythms**: Time blocks like "Morning Basket" (`name`, `color`, `icon`, `order`)
- **assignments**: Tasks (`title`, `subject`, `duration`, `studentId`, `dueDate`, `status`, `completedAt`)

### Key Component Patterns

1. **Modal Components**: Use `ModalWrapper` for consistent modal styling
2. **Rhythm-Subject Mapping**: `RHYTHM_SUBJECT_MAP` in App.jsx maps rhythm names to their associated subjects (e.g., "Morning Basket" → Copywork, Recitation, etc.)
3. **Real-time Sync**: All data uses Firestore `onSnapshot` listeners

### Environment Variables

Required in `.env` (see `.env.example`):
- `VITE_FIREBASE_*` - Firebase configuration
- `VITE_GOOGLE_AI_API_KEY` - Gemini API key
- `VITE_APP_ID` - App identifier for Firestore paths

### Styling

Uses Tailwind CSS 4 with custom theme in `src/index.css`:
- Custom serif font: Crimson Text
- Safe area utilities for mobile: `pb-safe`, `pt-safe`, `h-safe-screen`
- Color palette: earthy greens (`#5F6F52`, `#A9B388`), warm neutrals (`#2F3E32`, `#FDFBF7`)
