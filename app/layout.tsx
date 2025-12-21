import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import TopLoader from '../components/TopLoader';
import { LightboxProvider } from '../contexts/LightboxContext';
import { CommentsProvider } from '../contexts/CommentsContext';
import GlobalLightbox from '../components/Lightbox';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: "400",
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Miqkniq Art Portfolio",
  description: "A modern art portfolio with masonry gallery and lightbox",
  icons: {
    icon: '/miqkniq.png',
    apple: '/miqkniq.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased m-2`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <CommentsProvider>
          <LightboxProvider>
            <TopLoader>
              <div className="flex flex-col min-h-screen">
                <Nav />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </TopLoader>
            <GlobalLightbox />
          </LightboxProvider>
          </CommentsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
