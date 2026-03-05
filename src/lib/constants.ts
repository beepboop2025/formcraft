export const SITE_NAME = "FormCraft";
export const SITE_TAGLINE = "Beautiful forms that convert.";
export const SITE_DESCRIPTION =
  "Create stunning forms, surveys, and quizzes in minutes. No response limits. No hidden fees. Just beautiful forms that get results.";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Templates", href: "#templates" },
];

export const FEATURES = [
  {
    title: "Drag & Drop Builder",
    description:
      "Build forms visually with our intuitive drag-and-drop editor. No coding required — just drag fields, customize, and publish.",
    icon: "MousePointerClick",
  },
  {
    title: "Conditional Logic",
    description:
      "Show or hide fields based on previous answers. Create smart, dynamic forms that adapt to each respondent.",
    icon: "GitBranch",
  },
  {
    title: "No Response Limits",
    description:
      "Collect unlimited responses on every plan. No per-response fees, no surprise charges, no artificial caps.",
    icon: "Infinity",
  },
  {
    title: "Beautiful Themes",
    description:
      "Choose from professionally designed themes or customize every detail. Your forms will look as good as your brand.",
    icon: "Palette",
  },
  {
    title: "Real-time Analytics",
    description:
      "Track views, completion rates, and drop-off points. Understand exactly how people interact with your forms.",
    icon: "BarChart3",
  },
  {
    title: "Powerful Integrations",
    description:
      "Connect with Zapier, Webhooks, Google Sheets, Slack, and more. Send form data wherever you need it.",
    icon: "Plug",
  },
  {
    title: "File Uploads",
    description:
      "Accept files of any type — documents, images, videos. Set size limits and allowed file types per field.",
    icon: "Upload",
  },
  {
    title: "Custom Branding",
    description:
      "Remove FormCraft branding, use your own domain, and match your brand colors. Your form, your identity.",
    icon: "Brush",
  },
  {
    title: "Embeds & Sharing",
    description:
      "Embed forms anywhere with a single line of code. Share via link, QR code, or popup widget.",
    icon: "Share2",
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: 0,
    period: "forever",
    description: "Perfect for trying out FormCraft",
    features: [
      "3 forms",
      "100 responses/month",
      "10+ field types",
      "Basic themes",
      "Email notifications",
      "FormCraft branding",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 29,
    period: "per month",
    description: "For professionals and growing businesses",
    features: [
      "Unlimited forms",
      "Unlimited responses",
      "Conditional logic",
      "Custom branding",
      "File uploads (5GB)",
      "Priority support",
      "Zapier & Webhooks",
      "Custom thank you pages",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: 79,
    period: "per month",
    description: "For teams that need more power",
    features: [
      "Everything in Pro",
      "Team collaboration (5 seats)",
      "Custom domain",
      "File uploads (50GB)",
      "API access",
      "Advanced analytics",
      "White-label forms",
      "Dedicated support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
];

export const LTD_PLAN = {
  name: "Lifetime Deal",
  price: 149,
  originalPrice: 348,
  description: "Pay once, use forever. Limited spots available.",
  features: [
    "Everything in Pro — forever",
    "Unlimited forms & responses",
    "All future features included",
    "Conditional logic & branding",
    "Priority support for life",
    "10GB file storage",
  ],
  spotsLeft: 47,
  totalSpots: 200,
};

export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "GrowthLab",
    content:
      "We switched from Typeform and saved over $400/month. FormCraft gives us everything we need without the per-response pricing trap.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Freelance Designer",
    company: "Self-employed",
    content:
      "The form builder is incredibly intuitive. I created a client intake form in 10 minutes that looks more professional than anything I've used before.",
    avatar: "MJ",
  },
  {
    name: "Priya Patel",
    role: "Operations Manager",
    company: "TechScale Inc",
    content:
      "Conditional logic was a game-changer for our employee onboarding forms. We reduced form completion time by 40%.",
    avatar: "PP",
  },
];

export const STATS = [
  { value: "50K+", label: "Forms Created" },
  { value: "10M+", label: "Responses Collected" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "User Rating" },
];
