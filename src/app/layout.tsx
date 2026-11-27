import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./category.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.uz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Astron — Raqamli taklifnomalar",
    template: "%s | Astron",
  },
  description:
    "To‘y, tug‘ilgan kun va boshqa tadbirlar uchun zamonaviy raqamli taklifnomalar yarating.",
  applicationName: "Astron Digital Invitations",
  openGraph: {
    type: "website",
    siteName: "Astron",
    title: "Astron — Raqamli taklifnomalar",
    description:
      "Tadbirlaringiz uchun chiroyli, qulay va ulashishga tayyor raqamli taklifnomalar.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f6f2",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale = "uz" } = await params;
  const htmlLang = ["uz", "ru", "en"].includes(locale) ? locale : "uz";

  return (
    <html lang={htmlLang}>
      <body>{children}</body>
    </html>
  );
}
