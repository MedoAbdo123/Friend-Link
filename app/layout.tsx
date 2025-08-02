import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { CommentsProvider } from "./contexts/CommentsContext";
import { WebsocketProvider } from "./contexts/WebsocketContext";
import Head from "next/head";
import Layout from "./layout/Layout";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
            <Layout/>
            <WebsocketProvider>{children}</WebsocketProvider>
          </CommentsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
