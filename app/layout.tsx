import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klaxon — Healthcare Supply Chain Platform",
  description: "Technology-enabled pharmaceutical distribution and inventory infrastructure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}