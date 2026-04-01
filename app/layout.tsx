import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "YKS",
    template: "%s | YKS",
  },
  icons: {
    icon: [{ url: "/yks.svg?v=3", type: "image/svg+xml" }],
    shortcut: ["/yks.svg?v=3"],
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
        url: "/projects/joined-1.jpg",
        width: 1600,
        height: 900,
        alt: "YKS portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YKS",
    description:
      "Portfolio work across design, creative direction, campaign, film, and digital.",
    images: ["/projects/joined-1.jpg"],
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
