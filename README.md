<!-- textura-banner -->
<div align="center">
  <a href="https://github.com/beepboop2025/formcraft"><img src="./banner.svg" width="100%" alt="formcraft" /></a>
</div>

<p align="center">
  <img src="docs/screenshots/hero.png" alt="FormCraft — Beautiful Forms That Convert" width="100%" />
</p>

<h1 align="center">FormCraft</h1>

<p align="center">
  <strong>Beautiful forms that convert.</strong><br/>
  Create stunning forms, surveys, and quizzes in minutes. No response limits. No hidden fees.
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#screenshots">Screenshots</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#pricing">Pricing</a>
</p>

---

## Features

<p align="center">
  <img src="docs/screenshots/features.png" alt="FormCraft Features" width="100%" />
</p>

- **Drag & Drop Builder** — Build forms visually with an intuitive editor. No coding required.
- **Conditional Logic** — Show or hide fields based on previous answers for smart, dynamic forms.
- **No Response Limits** — Collect unlimited responses on paid plans. No per-response fees.
- **Beautiful Themes** — Professionally designed themes or full customization to match your brand.
- **Real-time Analytics** — Track views, completion rates, and drop-off points.
- **Powerful Integrations** — Connect with Zapier, Webhooks, Google Sheets, Slack, and more.
- **File Uploads** — Accept documents, images, videos with configurable size limits.
- **Custom Branding** — Remove FormCraft branding, use your own domain and colors.
- **Embeds & Sharing** — Embed forms anywhere with one line of code, or share via link.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Database** | [Prisma](https://www.prisma.io/) ORM + SQLite (PostgreSQL-ready) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) v4 (Credentials + JWT) |
| **Payments** | [Stripe](https://stripe.com/) (Subscriptions + One-time LTD) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) (API-backed with debounced auto-save) |
| **DnD** | [@dnd-kit](https://dndkit.com/) (Drag & Drop form builder) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/beepboop2025/formcraft.git
cd formcraft

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# Push database schema
npm run db:push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (optional — for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_LTD_PRICE_ID="price_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
STRIPE_BUSINESS_MONTHLY_PRICE_ID="price_..."
STRIPE_BUSINESS_YEARLY_PRICE_ID="price_..."
```

---

## Screenshots

### Landing Page

<p align="center">
  <img src="docs/screenshots/hero.png" alt="Landing Page Hero" width="100%" />
</p>

### Pricing

<p align="center">
  <img src="docs/screenshots/pricing.png" alt="Pricing Plans" width="100%" />
</p>

### Authentication

<p align="center">
  <img src="docs/screenshots/login.png" alt="Login Page" width="100%" />
</p>

### Checkout

<p align="center">
  <img src="docs/screenshots/checkout-success.png" alt="Checkout Success" width="100%" />
</p>

### 404 Page

<p align="center">
  <img src="docs/screenshots/404.png" alt="404 Not Found" width="100%" />
</p>

---

## Architecture

```
formcraft/
├── prisma/
│   └── schema.prisma          # Database schema (User, Form, Response, etc.)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth API route
│   │   │   ├── forms/          # CRUD API for forms
│   │   │   ├── public/         # Public form & submission endpoints
│   │   │   ├── stripe/         # Checkout & webhook handlers
│   │   │   └── user/           # User profile API
│   │   ├── builder/[formId]/   # Form builder editor
│   │   ├── checkout/           # Success & cancel pages
│   │   ├── dashboard/          # Dashboard, account settings, responses
│   │   ├── f/[formId]/         # Public form renderer
│   │   ├── login/              # Auth pages
│   │   └── register/
│   ├── components/
│   │   ├── builder/            # Builder UI (canvas, sidebar, header, share)
│   │   ├── dashboard/          # Dashboard cards, layout
│   │   ├── form/               # FormRenderer, field components
│   │   └── landing/            # Landing page sections
│   ├── lib/
│   │   ├── api.ts              # Client-side API helpers
│   │   ├── auth-helpers.ts     # Server-side auth utilities
│   │   ├── constants.ts        # Site config, pricing, features
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── store.ts            # Zustand store (API-backed)
│   │   └── stripe.ts           # Stripe client
│   └── types.ts                # TypeScript type definitions
├── .env.example
├── tailwind.config.ts
└── package.json
```

### Key Patterns

- **API-backed state**: Zustand store syncs with the server via debounced auto-save. Changes persist immediately without manual save.
- **Plan-based access control**: Free tier limited to 3 forms and 100 responses/month. Middleware enforces limits at the API layer.
- **Slug-based public URLs**: Forms are shared via `/f/[slug]` with auto-generated nanoid slugs.
- **Stripe dual-mode**: Supports both subscription billing (Pro/Business monthly/yearly) and one-time Lifetime Deal payments.

---

## Pricing

| Plan | Price | Highlights |
|------|-------|-----------|
| **Starter** | Free | 3 forms, 100 responses/month, basic themes |
| **Pro** | $29/mo | Unlimited forms & responses, conditional logic, custom branding |
| **Business** | $79/mo | Team collaboration, custom domain, API access, white-label |
| **Lifetime Deal** | $149 one-time | Everything in Pro forever, all future features included |

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push Prisma schema to database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with sample data
```

---

## Deployment

FormCraft is ready for deployment on **Vercel**, **Railway**, or any Node.js hosting platform.

For production, swap SQLite for PostgreSQL by updating `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/formcraft"
```

Then update `prisma/schema.prisma` provider from `sqlite` to `postgresql` and run `npm run db:push`.

---

## License

MIT

---

<p align="center">
  Built with Next.js, Tailwind CSS, Prisma, and Stripe.<br/>
  <strong>FormCraft</strong> — Beautiful forms that convert.
</p>
