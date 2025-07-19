import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { CommentsProvider } from "./contexts/CommentsContext";
import { WebsocketProvider } from "./contexts/WebsocketContext";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Friend Link",
  description: "Friend Link Social Networking Site",
  openGraph: {
    title: "Friend Link",
    description: "Connect with your friends on Friend Link",
    images: [
      {
        url: "public/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Friend Link Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Friend Link",
    description: "Connect with your friends on Friend Link",
    images: ["/public/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <CommentsProvider>
            <WebsocketProvider>{children}</WebsocketProvider>
          </CommentsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
