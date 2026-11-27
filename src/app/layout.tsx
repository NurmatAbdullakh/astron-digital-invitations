import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./category.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Astron — Raqamli taklifnomalar", template: "%s | Astron" },
  description: "To‘y, tug‘ilgan kun va boshqa tadbirlar uchun zamonaviy raqamli taklifnomalar yarating.",
  applicationName: "Astron Digital Invitations",
  openGraph: {
    type: "website",
    siteName: "Astron",
    title: "Astron — Raqamli taklifnomalar",
    description: "Tadbirlaringiz uchun chiroyli, qulay va ulashishga tayyor raqamli taklifnomalar.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f6f2",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}
