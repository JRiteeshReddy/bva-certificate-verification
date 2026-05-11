import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BVA Certificate Verification | Bangalore Vibecoders Association",
  description: "Official certificate verification portal for BVA (Bangalore Vibecoders Association). Verify membership and event participation certificates.",
  keywords: ["BVA", "Bangalore Vibecoders Association", "Certificate Verification", "Developer Community"],
  authors: [{ name: "BVA" }],
  openGraph: {
    title: "BVA Certificate Verification",
    description: "Verify your BVA certificates instantly.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
