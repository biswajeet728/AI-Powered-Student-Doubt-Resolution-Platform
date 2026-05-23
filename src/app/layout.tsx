import { Suspense } from "react";
import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "./providers";
import NavigationProgress from "@/components/navigation-progress";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Doubt-Flow",
    template: "%s | Doubt-Flow",
  },
  description:
    "AI-powered student doubt resolution platform. Post doubts, get instant AI answers, and have teachers verify solutions.",
  keywords: [
    "education",
    "doubt resolution",
    "AI tutor",
    "student",
    "teacher",
    "learning",
  ],
  authors: [{ name: "Doubt-Flow" }],
  openGraph: {
    title: "Doubt-Flow",
    description:
      "AI-powered student doubt resolution platform. Post doubts, get instant AI answers.",
    siteName: "Doubt-Flow",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", jetbrainsMono.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              backgroundColor: "#2a2826",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
            classNames: {
              toast: "!shadow-lg !shadow-black/30",
              title: "!font-mono !text-sm",
              description: "!font-mono !text-xs !text-white/60",
              actionButton: "!font-mono",
              cancelButton: "!font-mono",
            },
          }}
        />
      </body>
    </html>
  );
}
