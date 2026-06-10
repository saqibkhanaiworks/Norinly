import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
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
    <html lang="en" className="h-full">
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
      <body className={`${inter.className} bg-[#f8f9fc] text-slate-900 min-h-screen flex flex-col antialiased selection:bg-purple-500/10 selection:text-purple-900`}>
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group select-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-purple-500/20 group-hover:opacity-90 transition-opacity">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-wider text-slate-900 leading-none">Norinly</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Practice English</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-550 font-bold">
              <Link href="/#rooms" className="hover:text-slate-900 transition-colors">
                Topic Rooms
              </Link>
              <Link href="/learn" className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors rounded-full text-xs">
                <span>🎯</span> Dashboard
              </Link>
              <Link href="/safety" className="hover:text-slate-900 transition-colors">
                Safety
              </Link>
              <Link href="/guidelines" className="hover:text-slate-900 transition-colors">
                Guidelines
              </Link>
              <Link href="/blog" className="hover:text-slate-900 transition-colors">
                Blog
              </Link>
            </nav>

            <div className="flex items-center">
              <Link
                href="/connect"
                className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-200 shadow-sm hover:shadow shadow-purple-500/10 flex items-center justify-center gap-1.5"
              >
                Connect Live 🎙️
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
