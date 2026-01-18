import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Podbay - The best podcast player on the web.",
  description: "The fastest and easiest podcast player designed for the web.",
  themeColor: "hsl(236, 28%, 12%)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
