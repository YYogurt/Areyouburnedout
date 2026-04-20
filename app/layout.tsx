import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Star Vent — Let it go with the stars",
  description:
    "A safe space to express your feelings. Release your exhaustion into the stars. Every feeling you have matters.",
  keywords: ["vent", "burnout", "stars", "healing", "mental health", "express"],
  openGraph: {
    title: "Star Vent — Let it go with the stars",
    description: "A safe space to express your feelings. Release your exhaustion into the stars.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
