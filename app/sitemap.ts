import { MetadataRoute } from 'next';
import { blogArticles } from '@/lib/blog-articles';

const BLOG_DATES: Record<string, Date> = {
  'anonymous-english-practice-vs-tutoring': new Date('2026-06-05'),
  'best-free-cambly-alternative': new Date('2026-05-28'),
  'overcome-fear-of-speaking-english': new Date('2026-05-12'),
  'how-to-practice-english-speaking-alone-at-home': new Date('2026-06-07'),
  'english-speaking-practice-with-strangers-online-free': new Date('2026-06-06'),
  'best-app-to-practice-english-speaking-2026': new Date('2026-06-05'),
  'how-to-stop-being-nervous-speaking-english': new Date('2026-06-04'),
  'free-english-conversation-partner-online': new Date('2026-06-03'),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `https://norinly.live/blog/${article.slug}`,
    lastModified: BLOG_DATES[article.slug] ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    { url: 'https://norinly.live', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://norinly.live/connect', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://norinly.live/learn', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://norinly.live/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...blogEntries,
    { url: 'https://norinly.live/compare/cambly-alternative', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://norinly.live/compare/hellotalk-alternative', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://norinly.live/compare/italki-alternative', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://norinly.live/room/daily-life', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://norinly.live/room/travel', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://norinly.live/room/debate', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://norinly.live/room/job-interview', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://norinly.live/room/free-chat', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://norinly.live/safety', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://norinly.live/guidelines', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://norinly.live/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://norinly.live/stats', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.4 },
  ];
}
