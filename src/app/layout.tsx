import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Woof & Wag | Premium Dog Blog & Community",
  description: "A modern, interactive platform for dog lovers. Discover premium articles, training tips, breed guides, and meet other dog enthusiasts.",
  verification: {
    google: "wvzcMGr8k30lWWATmm7NNWET5KBV60yTWCzVyl0-Hxw",
  },
  other: {
    "impact-site-verification": "2dd94fec-5809-43ab-8295-2f76caee5c54",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* impact.com site verification — uses non-standard 'value' attr, injected via script */}
        <Script
          id="impact-verification"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `document.head.insertAdjacentHTML('beforeend','<meta name="impact-site-verification" value="2dd94fec-5809-43ab-8295-2f76caee5c54">');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fcfbf9] text-[#0f172a]">
        {children}
      </body>
    </html>
  );
}
