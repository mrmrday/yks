import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yks.works"),
  title: {
    default: "YKS",
    template: "%s | YKS",
  },
  icons: {
    icon: [{ url: "/yks-purple.png?v=1", type: "image/png" }],
    shortcut: ["/yks-purple.png?v=1"],
  },
  description:
    "YKS is the portfolio site for Yad Kram Studio, showcasing design and creative work across brand, campaign, film, and digital.",
  openGraph: {
    title: "YKS",
    description:
      "Portfolio work across design, creative direction, campaign, film, and digital.",
    siteName: "YKS",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/twitter-image"],
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
