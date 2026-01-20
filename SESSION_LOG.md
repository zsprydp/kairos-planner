# Kairos Planner - Session Log

## Session: January 20, 2025

### What We Built
- **Kairos Planner** - A homeschool planner web app for intentional families who value rhythms, habits, and rich learning

### Technical Stack
- React 19 + Vite 7 + Tailwind CSS 4
- Firebase (Auth, Firestore, Hosting)
- Google Gemini API for AI narration summaries

### Completed This Session

**Landing Page**
- Created animated explainer showing app workflow (4 steps auto-cycle)
- "Founding Families Beta" pricing - free during beta with perks at launch
- Removed Charlotte Mason/Ambleside-specific references to broaden appeal
- Kept peaceful, intentional homeschool vibe ("Move from chaos to kairos")
- Privacy Policy and Terms of Service modals

**App Improvements**
- Added mobile bottom navigation with full-screen "More" menu
- Added "Back to Home" button for anonymous users (was hidden before)
- Updated AI prompt to be more general (was CM-specific)

**Infrastructure**
- Created Firestore security rules (`firestore.rules`)
- Added custom favicon (sage green leaf design)
- Added theme-color meta tag for mobile browsers
- Created `CLAUDE.md` for codebase documentation

**Marketing**
- Created `social-media-copy.md` with authentic copy for Instagram, Facebook, Pinterest
- Recommendation: Wife posts from personal account for authenticity

### Deployed To
- **Live URL:** https://palimpsest-275eb.web.app
- **Firebase Project:** palimpsest-275eb
- **GitHub:** https://github.com/zsprydp/kairos-planner.git

### Git Commits
1. `943f2a8` - Add landing page, mobile nav, security rules, and beta launch features
2. `3b141ca` - Add custom favicon with sage green leaf design

### Still TODO
- [ ] Verify Google Auth enabled in Firebase Console
- [ ] Custom domain (kairosplanner.com or similar)
- [ ] Analytics (track signups/usage)
- [ ] Stripe payment integration (after beta)
- [ ] Email collection for beta user updates

### Notes
- Pricing strategy: Free beta → 50% off for founding families at launch
- Target: $7-9k/month revenue (needs ~700-900 monthly subs at $9.99 or mix with $49.99/year)
- Launch strategy: Wife posts in homeschool Facebook groups from personal account

---

## How to Continue Next Session
1. Run `npm run dev` to start local server
2. Check this file for context
3. Firebase auth may expire - run `firebase login --reauth` if deploy fails
