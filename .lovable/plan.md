

# TEDxGUC — Single-Page Web Application

## Design System
- **Primary accent**: `#EB0028` (TED Red) for buttons, active states, hover accents
- **Backgrounds**: White (`#FFFFFF`) for main sections, Pitch Black (`#000000`) for header/footer/theatre mode
- **Surfaces**: Light Gray (`#F3F4F6`) for cards, `#1A1A1A` for dark surfaces
- **Typography**: Inter font, bold headers, clean body text
- **Style**: Generous whitespace, sharp edges, cinematic feel

## Pages & Features

### 1. Sticky Navbar
- Transparent → solid black on scroll with smooth transition
- TEDxGUC logo on the left
- Links: Talks, Our Team, About, Sign In / Dashboard
- Mobile: hamburger menu with slide-out drawer

### 2. Home / Talks Directory
- **Hero Section**: Full-width cinematic banner with bold theme title and "Watch Latest Talks" CTA
- **Search & Filter Bar**: Filter by Topic tags, Year dropdown, and keyword search
- **Video Grid**: Responsive card grid with thumbnail, speaker name, talk title, duration, and heart icon (save to watchlist for logged-in users)
- **Theatre Mode Modal**: Dark overlay modal with embedded video player, speaker bio, and social links — no page navigation

### 3. Our Team — Interactive Org Tree
- Visual hierarchy diagram with three levels:
  - L1: Chairman
  - L2: Curators (Talks, Operations, OD, Marketing & Coordination)
  - L3: Executives (Coaching, Research & Production, Events, Partnerships, Logistics, Associate Dev, Associate Experience, Media & Design, Campaigns & Copywriting)
- Nodes have red hover/active states with smooth transitions
- Clicking a node opens a slide-out panel or modal with committee responsibilities

### 4. About Section
- TED/TEDx brand compliance text explaining the independently organized nature
- Embedded on the main page as a section

### 5. Footer
- Deep black background
- Newsletter signup input with email field and submit button
- Social media icon links (Instagram, LinkedIn, YouTube, etc.)
- Copyright and legal disclaimers

### 6. Authentication (Supabase via Lovable Cloud)
- **Guest**: Browse talks, view team, read about page
- **User**: Email sign-in, watchlist/favorites, newsletter auto-subscribe
- **Admin**: Hidden `/admin` dashboard to upload video links, add speaker details, manage tags
- Roles stored in a `user_roles` table (not on profiles)

### 7. Admin Dashboard
- Protected route accessible only to admin role
- Forms to add/edit talks (video URL, title, speaker name, bio, tags, year)
- Manage tags list
- Simple table view of all talks with edit/delete actions

## Data & Mock Content
- ~8-10 mock talks with placeholder thumbnails from Unsplash
- Full org tree populated with placeholder names and role descriptions
- All UI fully populated on first load

## Technical Approach
- React + TypeScript + Tailwind CSS
- Smooth CSS transitions on all interactive elements (hover, modals, tab switches)
- Fully responsive — vertical stacks and drawer menu on mobile
- Supabase (Lovable Cloud) for auth, database (talks, watchlist, roles), and edge functions

