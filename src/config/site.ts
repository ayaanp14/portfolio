export const siteConfig = {
  name: "Ayaan Pathan",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "Ayaan Pathan | Creative Frontend Engineer",
  description:
    "Interactive portfolio for a frontend engineer focused on polished interfaces, creative development, and immersive web experiences.",
  links: {
    github: null,
    linkedin: null,
    email: null,
  },
} as const;
