import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import { blogArticles } from '@/lib/blog-articles';

export const metadata = {
  title: 'English Speaking Practice Blog | Norinly',
  description: 'Articles and resources on how to improve your English speaking skills, overcome speaking anxiety, and find free tutor alternatives.',
  alternates: {
    canonical: 'https://norinly.live/blog',
  },
  openGraph: {
    title: 'English Speaking Practice Blog | Norinly',
    description: 'Articles and resources on how to improve your English speaking skills, overcome speaking anxiety, and find free tutor alternatives.',
    url: 'https://norinly.live/blog',
    type: 'website',
  },
};

// Sort newest-first by the ISO dates embedded in [slug]/page.tsx
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

const sortedArticles = [...blogArticles].sort((a, b) => {
  const aDate = ISO_DATES[a.slug] ?? '2026-01-01T00:00:00Z';
  const bDate = ISO_DATES[b.slug] ?? '2026-01-01T00:00:00Z';
  return new Date(bDate).getTime() - new Date(aDate).getTime();
});

export default function BlogIndexPage() {
  return (
    <div className="flex-1 bg-[#f8f9fc] py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" /> Language Learning Resources
          </h1>
          <p className="text-slate-600 text-lg">
            Practical advice, learning guides, and insights to help you master spoken English.
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {sortedArticles.map((post) => (
            <div
              key={post.slug}
              className="flex flex-col justify-between bg-white border border-slate-200 hover:border-slate-350 hover:border-slate-300 p-6 rounded-2xl transition-all duration-200 group shadow-sm"
            >
              <div className="space-y-4">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">
                    {post.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-755 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 group/link"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
