import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { blogArticles } from '@/lib/blog-articles';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

const ISO_DATES: Record<string, string> = {
  'anonymous-english-practice-vs-tutoring': '2026-06-05T00:00:00Z',
  'best-free-cambly-alternative': '2026-05-28T00:00:00Z',
  'overcome-fear-of-speaking-english': '2026-05-12T00:00:00Z',
  'how-to-practice-english-speaking-alone-at-home': '2026-06-07T00:00:00Z',
  'english-speaking-practice-with-strangers-online-free': '2026-06-06T00:00:00Z',
  'best-app-to-practice-english-speaking-2026': '2026-06-05T00:00:00Z',
  'how-to-stop-being-nervous-speaking-english': '2026-06-04T00:00:00Z',
  'free-english-conversation-partner-online': '2026-06-03T00:00:00Z',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  
  if (!article) {
    return {};
  }

  return {
    title: `${article.title} | Norinly`,
    description: article.description,
    alternates: {
      canonical: `https://norinly.live/blog/${slug}`,
    },
    openGraph: {
      title: `${article.title} | Norinly`,
      description: article.description,
      url: `https://norinly.live/blog/${slug}`,
      type: 'article',
      siteName: 'Norinly',
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const isoDate = ISO_DATES[slug] || new Date(article.date).toISOString();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'datePublished': isoDate,
    'dateModified': isoDate,
    'author': {
      '@type': 'Organization',
      'name': 'Norinly',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Norinly',
      'url': 'https://norinly.live',
    },
    'url': `https://norinly.live/blog/${slug}`,
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-neutral-950 py-16 px-6 sm:px-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-[680px] mx-auto space-y-8">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium border-b border-neutral-900 pb-4">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Content with custom local styles for exact typography */}
        <div className="blog-content text-[#cccccc] text-base leading-[1.8] space-y-6">
          <style>{`
            .blog-content h2 {
              color: #ffffff;
              font-size: 1.5rem;
              font-weight: 700;
              margin-top: 2.25rem;
              margin-bottom: 1rem;
              line-height: 1.3;
            }
            .blog-content h3 {
              color: #ffffff;
              font-size: 1.25rem;
              font-weight: 600;
              margin-top: 1.75rem;
              margin-bottom: 0.75rem;
              line-height: 1.3;
            }
            .blog-content p {
              margin-bottom: 1.25rem;
              line-height: 1.8;
            }
            .blog-content ul {
              list-style-type: disc;
              padding-left: 1.5rem;
              margin-bottom: 1.25rem;
            }
            .blog-content li {
              margin-bottom: 0.5rem;
              line-height: 1.8;
            }
            .blog-content strong {
              color: #ffffff;
            }
            .blog-content a {
              color: #22c55e;
              text-decoration: underline;
              transition: color 0.2s;
            }
            .blog-content a:hover {
              color: #16a34a;
            }
            .blog-content table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .blog-content th {
              background-color: #171717;
              color: #ffffff;
              padding: 0.75rem;
              border: 1px solid #262626;
              font-weight: 600;
              text-align: left;
            }
            .blog-content td {
              padding: 0.75rem;
              border: 1px solid #262626;
              color: #cccccc;
            }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* CTA Card */}
        <div className="mt-12 bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Ready to practice?</h3>
            <p className="text-neutral-400 text-sm max-w-sm mx-auto">
              Start speaking with real people now — free, instant, no signup.
            </p>
          </div>
          <Link
            href="/connect"
            className="inline-flex h-11 px-8 bg-white hover:bg-neutral-200 text-black font-semibold rounded-lg transition-colors text-sm items-center justify-center"
          >
            Start Speaking
          </Link>
        </div>
      </article>
    </div>
  );
}
