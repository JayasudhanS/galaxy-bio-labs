# Galaxy Bio Labs Premiere

You are a senior UI/UX designer, creative director, and full-stack React engineer.

Your mission is to create a WORLD-CLASS premium website for "Galaxy Bio Labs."

DO NOT build a template website.

DO NOT make it look like a bootstrap website.

DO NOT overuse cards.

DO NOT copy any existing website.

The client wants visitors to immediately feel:

Premium.

Modern.

Professional.

Trustworthy.

Innovative.

The entire experience should feel handcrafted.

──────────────────────────────

TECH STACK

React + Vite

Firebase Authentication

Cloud Firestore

Cloudinary Image Upload

React Router

Framer Motion

GSAP where appropriate

Lenis smooth scrolling

Tailwind CSS

Lucide Icons

Responsive Design

Lazy Loading

SEO Ready

Performance Optimized

──────────────────────────────

ROLES

1 User

2 Admin

No other roles.

──────────────────────────────

AUTH

Firebase Authentication

User Register

User Login

Forgot Password

Admin Login

Protected Admin Dashboard

Firestore stores user profile.

──────────────────────────────

ADMIN DASHBOARD

Beautiful modern dashboard.

Sidebar navigation.

Dashboard

Products

Quote Requests

Settings

Logout

Product Management

Admin can

Add Product

Edit Product

Delete Product

Images

Minimum

1 image

Maximum

4 images

Upload directly to Cloudinary.

Store ONLY Cloudinary URLs in Firestore.

Each product contains

Title

Description

Category Dropdown

Dropdown options ONLY

Agri Inputs

Aquaculture

Ornamental Fish

Food Products

Benefits

Specifications

Usage

Status

Created Date

Updated Date

──────────────────────────────

USER WEBSITE

Home

About

Products

Gallery

Contact

Login

Products dropdown

Agri Inputs

Aquaculture

Ornamental Fish

Food Products

──────────────────────────────

HOME PAGE

This page should immediately impress visitors.

Create a cinematic hero section.

Large full-width background image slider.

Auto sliding.

Smooth transitions.

Parallax.

Zoom effect.

Animated overlays.

Elegant typography.

Generate a temporary premium logo reading "Galaxy Bio Labs" with a clean agricultural identity (replaceable later).

Professional navigation bar.

Transparent initially.

Changes beautifully on scroll.

Animated underline.

Premium hover effects.

Beautiful mobile navigation.

──────────────────────────────

SECTIONS

Hero

About Company

Four Main Modules

Featured Products

Why Choose Us

Gallery Preview

Quote CTA

Contact

Footer

──────────────────────────────

FOUR MODULES

Agri Inputs

Aquaculture

Ornamental Fish

Food Products

Each module should have a premium visual section.

Large imagery.

Modern layout.

Animated transitions.

NOT simple cards.

──────────────────────────────

PRODUCT LIST

Products appear automatically under their selected module.

Professional product listing.

Modern filtering.

Search.

Elegant animations.

No prices.

No Add to Cart.

No Buy Now.

Only

GET QUOTE

──────────────────────────────

PRODUCT PAGE

Large image gallery.

If multiple images exist

Smooth image transition

Elegant fade

Thumbnail selector

Swipe support

Large title

Beautiful typography

Description

Benefits

Specifications

Usage

GET QUOTE button

──────────────────────────────

QUOTE SYSTEM

Click GET QUOTE

Open beautiful modal.

Collect

Name

Phone

Email

Location

Message

Submit

Save to Firestore.

Admin dashboard shows

User Details

Product

Category

Date

Status

──────────────────────────────

VISUAL DESIGN

DO NOT create a website made entirely of cards.

Use

Layered layouts

Split layouts

Full-width sections

Curved dividers

Organic shapes

Glass morphism only where appropriate

Premium spacing

Beautiful typography

Creative image compositions

Magazine-quality layouts

High-end visual hierarchy

──────────────────────────────

ANIMATIONS

This is EXTREMELY IMPORTANT.

The website should feel alive.

Use tasteful premium animations.

Navigation animations.

Hover animations.

Image reveal animations.

Parallax.

Text reveal.

Section reveal.

Smooth scrolling.

Counters.

Magnetic buttons.

Floating decorative elements.

Mouse interactions.

Scroll-triggered animations.

Premium page transitions.

Loading animation.

Skeleton loading.

Animated product galleries.

Everything should feel smooth and luxurious.

Never overanimate.

Animations should feel premium.

──────────────────────────────

MOBILE

The mobile experience must be first-class.

Navigation should be elegant.

Buttons easy to reach.

Images optimized.

Animations adapted.

──────────────────────────────

PERFORMANCE

Lazy load images.

Optimize animations.

Responsive images.

Fast loading.

Accessibility.

SEO.

──────────────────────────────

IMPORTANT

Generate placeholder company information and placeholder product content that can easily be replaced later.

Generate a temporary logo.

Generate placeholder hero images using royalty-free placeholder assets.

Organize the project with clean reusable components.

Write production-quality code.

Think like an award-winning creative agency.

The final result should feel polished enough that a client immediately says "wow."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c6e49d47-b52b-4352-832a-44fe4ac8b50e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Authentication (Firebase)

This project uses Firebase Authentication + Firestore for accounts:

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Firestore database** (production or test mode).
4. Copy `.env.example` to `.env` and fill in your Firebase web app config
   (Project settings → General → Your apps → SDK setup and configuration).
5. Restart the dev server after editing `.env`.

**Roles**: every account created via `/register` is written to Firestore as
`users/{uid}` with `role: "user"` — this is never selectable from the UI.
To grant admin access, manually edit that document in the Firestore console
and set `role: "admin"`. Admins are redirected to `/admin` on login; there is
no public admin registration or admin-only login page by design.

Suggested Firestore security rules (adjust to your needs):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId
                    && request.resource.data.role == "user";
      allow update, delete: if false; // manage roles from the console only
    }
  }
}
```
