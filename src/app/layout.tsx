import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./category.css";
import "./catalog-first.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Astron — Digital Invitations", template: "%s | Astron" },
  description: "Create beautiful digital invitations for weddings, birthdays and special celebrations.",
  applicationName: "Astron Digital Invitations",
  openGraph: {
    type: "website",
    siteName: "Astron",
    title: "Astron — Digital Invitations",
    description: "Choose a design, personalize it step by step, and share your invitation."
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f8f7f2" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
