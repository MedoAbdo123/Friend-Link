import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { CommentsProvider } from "./contexts/CommentsContext";
import { WebsocketProvider } from "./contexts/WebsocketContext";
import Layout from "./layout/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Friend Link",
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Friend Link",
  url: "https://friend-link.netlify.app",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://friend-link.netlify.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
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
      suppressHydrationWarning
      className="dark"
      style={{ colorScheme: "dark" }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <CommentsProvider>
            <Layout />
            <WebsocketProvider>{children}</WebsocketProvider>
          </CommentsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
