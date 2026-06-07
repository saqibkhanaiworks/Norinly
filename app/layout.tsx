import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import LiveCounter from '@/components/LiveCounter';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Norinly | Practice English Speaking Free',
  description: 'Talk to real people worldwide. Anonymous, instant, free. No signup needed.',
  metadataBase: new URL('https://norinly.live'),
  alternates: {
    canonical: 'https://norinly.live',
  },
  openGraph: {
    title: 'Norinly | Practice English Speaking Free',
    description: 'Talk to real people worldwide. Anonymous, instant, free. No signup needed.',
    url: 'https://norinly.live',
    siteName: 'Norinly',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Norinly anonymous voice chat platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Norinly | Practice English Speaking Free',
    description: 'Talk to real people worldwide. Anonymous, instant, free. No signup needed.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        {/* WebSite JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Norinly",
              "url": "https://norinly.live",
              "description": "Anonymous English voice practice with real learners worldwide. Instant, free, no signup.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://norinly.live/blog?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NVDXCRVDRZ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NVDXCRVDRZ');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#04060d] text-white min-h-screen flex flex-col antialiased selection:bg-blue-500/30 selection:text-white`}>
        {/* Realtime Live Counter Banner */}
        <div className="w-full bg-[#04060d] border-b border-neutral-900 py-2.5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <LiveCounter />
          </div>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 w-full bg-[#04060d]/80 backdrop-blur-md border-b border-neutral-900 px-4 py-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                Norinly
              </span>
              <span className="bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                Live
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-400 font-medium">
              <Link href="/#rooms" className="hover:text-white transition-colors">
                Topic Rooms
              </Link>
              <Link href="/safety" className="hover:text-white transition-colors">
                Safety Center
              </Link>
              <Link href="/guidelines" className="hover:text-white transition-colors">
                Guidelines
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/connect"
                className="h-9 px-4 bg-white hover:bg-neutral-200 text-black font-semibold rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center"
              >
                Start Speaking
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
