import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://norinly.live', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://norinly.live/connect', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://norinly.live/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://norinly.live/blog/anonymous-english-practice-vs-tutoring', lastModified: new Date('2026-06-05'), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://norinly.live/blog/best-free-cambly-alternative', lastModified: new Date('2026-05-28'), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://norinly.live/blog/overcome-fear-of-speaking-english', lastModified: new Date('2026-05-12'), changeFrequency: 'monthly', priority: 0.8 },
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
