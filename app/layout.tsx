import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easy at Work — Démonstration",
  description:
    "Démonstration interactive mobile du parcours Easy at Work et des coupons.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
