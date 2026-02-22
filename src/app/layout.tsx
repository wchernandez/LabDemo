import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "LabDemo",
  title: "LabDemo - AI Teaching Assistant for CS Labs",
  description: "Get ethical hints for your CS assignments using Groq",
  openGraph: {
    title: "LabDemo - AI Teaching Assistant for CS Labs",
    description: "Get ethical hints for your CS assignments using Groq",
    siteName: "LabDemo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
