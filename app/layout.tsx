import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yks.works"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "YKS",
    template: "%s | YKS",
  },
  icons: {
    icon: [
      { url: "/favicon.png?v=1", type: "image/png" },
      { url: "/favicon.ico?v=1", type: "image/x-icon" },
    ],
    shortcut: ["/favicon.ico?v=1"],
  },
  description:
    "YKS is the portfolio site for Yad Kram Studio, showcasing design and creative work across brand, campaign, film, and digital.",
  openGraph: {
    title: "YKS",
    description:
      "Portfolio work across design, creative direction, campaign, film, and digital.",
    url: "https://yks.works",
    siteName: "YKS",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/share-card.png",
        width: 1200,
        height: 630,
        alt: "YKS social share card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YKS",
    description:
      "Portfolio work across design, creative direction, campaign, film, and digital.",
    images: ["/share-card.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
