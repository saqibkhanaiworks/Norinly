import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily English Learning Dashboard | Norinly',
  description: 'Practice English every day with a new word, quiz, idiom, tongue twister, fun fact and role-play scenario. No signup. Anonymous. Free.',
  metadataBase: new URL('https://norinly.live'),
  alternates: {
    canonical: 'https://norinly.live/learn',
  },
  openGraph: {
    title: 'Daily English Learning Dashboard | Norinly',
    description: 'Word of the day, daily quiz, idiom, tongue twister and more — your free daily English practice routine.',
    url: 'https://norinly.live/learn',
    siteName: 'Norinly',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily English Learning Dashboard | Norinly',
    description: 'Word of the day, daily quiz, idiom, tongue twister and more — free, anonymous, no signup.',
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
