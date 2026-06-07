import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'English Speaking Practice Blog | Norinly',
  description: 'Articles and resources on how to improve your English speaking skills, overcome speaking anxiety, and find free tutor alternatives.',
};

const BLOG_POSTS = [
  {
    slug: 'anonymous-english-practice-vs-tutoring',
    title: 'Why Anonymous English Practice Works Better Than Tutoring',
    description: 'Traditional tutoring can feel formal and high-pressure. Learn how practicing English anonymously with peers reduces anxiety and helps build natural conversational confidence faster.',
    date: 'June 05, 2026',
    readTime: '4 min read'
  },
  {
    slug: 'best-free-cambly-alternative',
    title: 'The Best Free Cambly Alternative in 2026',
    description: 'Looking to practice speaking English without spending hundreds of dollars a month? We compare Cambly and Norinly, highlighting how you can speak for free instantly.',
    date: 'May 28, 2026',
    readTime: '5 min read'
  },
  {
    slug: 'overcome-fear-of-speaking-english',
    title: 'How to Overcome the Fear of Speaking English',
    description: 'Speaking anxiety holds millions of English students back. Read our actionable tips on how to push past the fear of making mistakes and start speaking fluently.',
    date: 'May 12, 2026',
    readTime: '6 min read'
  }
];

export default function BlogIndexPage() {
  return (
    <div className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-neutral-950 py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-400" /> Language Learning Resources
          </h1>
          <p className="text-neutral-400 text-lg">
            Practical advice, learning guides, and insights to help you master spoken English.
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {BLOG_POSTS.map((post) => (
            <div 
              key={post.slug}
              className="flex flex-col justify-between bg-neutral-900 border border-neutral-800 hover:border-neutral-700 p-6 rounded-2xl transition-all duration-200 group"
            >
              <div className="space-y-4">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
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
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-4">
                    {post.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-850">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-white hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 group/link"
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
