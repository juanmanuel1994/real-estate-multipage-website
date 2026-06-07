================================================================
  CRESTVIEW ESTATES — Real Estate Website
  readme.txt
================================================================

OVERVIEW
--------
This is a complete, multi-page real estate website built with
pure HTML, CSS, and vanilla JavaScript. No frameworks, no npm,
no build step required. Ready to upload directly to any web host
(Hostinger, Netlify, Cloudflare Pages, etc.) via FTP or drag-and-drop.


PAGES INCLUDED
--------------
- index2.html     : Home page — hero, featured listings, stats,
                    services preview, testimonials, blog preview, CTA

- about2.html     : About page — company story, core values,
                    team section, track record stats, testimonials

- services2.html  : Services page — 6 service cards, 4-step process,
                    split section with image, CTA

- portfolio2.html : Portfolio / Listings page — 6 property cards with
                    filter by type (All / Single Family / Condos /
                    Luxury / Townhouses), market insights blog section

- contact2.html   : Contact page — full contact form with validation,
                    office info, map embed, FAQ section


DESIGN
------
- Visual style: Glassmorphism — animated mesh gradient background,
  translucent glass cards with blur effect, soft peach/lavender palette
- Typography: Cormorant Garamond (display) + Inter (body)
- Animations: scroll-reveal on all sections, 3D card tilt on hover,
  animated count-up stats, seamless marquee ticker
- Fully responsive: desktop, tablet, and mobile with hamburger nav


FEATURES
--------
- Contact form with field validation and success state animation
- Portfolio property filter (by type) with smooth show/hide
- Animated statistics counter (triggered on scroll)
- Horizontal marquee ticker with real estate keywords
- Sticky navigation that adds glass blur on scroll
- Active nav link highlighting per page
- GSAP + ScrollTrigger for parallax on hero image
- .htaccess included for correct cache headers on Apache/Hostinger


SEO
---
Every page includes:
- Unique <title> and <meta description>
- <meta keywords> targeting real estate searches
- Open Graph tags (og:title, og:description, og:image, og:type)
- Twitter Card tags
- JSON-LD structured data (LocalBusiness, Service, ItemList schemas)
- Semantic HTML: <article>, <header>, <nav>, aria-label, alt on all images
- <link rel="canonical"> ready to fill with your domain


TECHNOLOGY STACK
----------------
- HTML5 (semantic, accessible)
- CSS3 (custom properties, grid, flexbox, backdrop-filter, animations)
- Vanilla JavaScript (IIFE pattern, no ES modules, works on file://)
- GSAP 3.12.5 + ScrollTrigger (local, in /lib/)
- Google Fonts (Cormorant Garamond + Inter, loaded via CDN)
- No npm, no build tool, no dependencies to install


FILE STRUCTURE
--------------
crestview-estates/
  index2.html         Home page
  about2.html         About page
  services2.html      Services page
  portfolio2.html     Portfolio / Listings page
  contact2.html       Contact page
  styles2.css         All styles
  main2.js            All JavaScript logic
  .htaccess           Cache headers for Apache hosting
  readme.txt          This file
  lib/
    manifest2.js      Site data (brand info, listings, services, etc.)
    gsap.min.js       GSAP animation library
    ScrollTrigger.min.js  GSAP scroll plugin
    lenis.min.js      Smooth scroll library (available, not active by default)
  assets/
    img/              All stock photos (JPG format)


HOW TO CUSTOMIZE
----------------
1. BRAND NAME / COLORS
   Open styles2.css and edit the :root variables at the top:
     --accent     (main color, currently terracotta orange)
     --accent-2   (secondary color, currently soft indigo)
     --bg         (background, currently warm cream)
   Change the brand name "Crestview Estates" by searching and replacing
   it across all HTML files.

2. CONTACT INFORMATION
   Open lib/manifest2.js and fill in:
     phone, email, address, social links
   These are injected automatically into every page footer.
   Also update the JSON-LD blocks in each HTML <head> with the same data.

3. LISTINGS / PROPERTIES
   Open lib/manifest2.js and edit the "listings" array.
   Each listing has: title, type, price, beds, baths, sqft, img, location.
   Replace the image files in assets/img/ with your own photos.

4. SERVICES
   Edit the "services" array in lib/manifest2.js.

5. TEAM
   Edit the "team" array in lib/manifest2.js.

6. BLOG / NEWS
   Edit the "blog" array in lib/manifest2.js.

7. CANONICAL URLS + OG TAGS
   In each HTML file's <head>, replace the placeholder URLs with
   your actual domain (e.g., https://www.yourdomain.com).

8. MAP EMBED (contact2.html)
   Replace the Google Maps iframe src with your own embed URL.
   Get it from: maps.google.com → Share → Embed a map.


HOW TO DEPLOY
-------------
Option A — Hostinger (recommended):
  1. Log into Hostinger File Manager or use FTP (FileZilla).
  2. Upload the entire crestview-estates/ folder to public_html/.
  3. The .htaccess file will handle cache headers automatically.
  4. Open yourdomain.com/index2.html to verify.

Option B — Netlify / Cloudflare Pages:
  1. Drag the crestview-estates/ folder into the Netlify dashboard.
  2. Done — live in seconds.

Option C — Local preview:
  Open a terminal in the project folder and run:
    python -m http.server 8080
  Then open: http://localhost:8080/index2.html


CACHE BUSTING
-------------
All <script> and <link> tags use ?v=20260602 cache busters.
When you update CSS or JS after deploy, bump the date number
(e.g., ?v=20260603) in all HTML files to force browsers to
reload the new version.


NOTES
-----
- All contact info, phone numbers, emails, addresses, and URLs
  in this deliverable are set to "Example" placeholders.
  Replace them with the client's real information before going live.

- Stock photos are sourced from Openverse (open license).
  Credits have been removed from this deliverable.
  Verify image licenses at openverse.org before commercial use,
  or replace with client-provided photos.

- The .htaccess file is configured for Apache servers (Hostinger default).
  If the host uses Nginx, cache headers must be set via server config instead.

================================================================
