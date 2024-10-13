import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],   // You can specify subsets like 'latin', 'cyrillic', etc.
  weight: ['400', '700'], // Optionally specify font weights (default is all)
});

export const metadata: Metadata = {
  title: "CiviClick",
  description: "Rebuild Your Democracy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
