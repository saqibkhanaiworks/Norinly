import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

interface BlogPost {
  title: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
}

const POSTS: Record<string, BlogPost> = {
  'anonymous-english-practice-vs-tutoring': {
    title: 'Why Anonymous English Practice Works Better Than Tutoring',
    date: 'June 05, 2026',
    readTime: '4 min read',
    content: (
      <>
        <p>
          Learning a language is less about memorizing vocabulary lists and more about building the muscle memory to speak without second-guessing yourself. Unfortunately, traditional tutoring classrooms often make learners feel highly self-conscious, leading to speaking anxiety.
        </p>
        <h2>The Pressure of Tutoring</h2>
        <p>
          In a formal tutoring session, the spotlight is entirely on you. A certified teacher listens to every sound you make, waiting to correct your grammar or pronunciation. While well-intentioned, this structured feedback can trigger the "affective filter" — a mental block that prevents you from speaking freely because you fear making mistakes.
        </p>
        <h2>The Freedom of Anonymity</h2>
        <p>
          Practicing anonymously with peers changes the dynamic entirely. On Norinly, there are no accounts, no profile pictures, and no cameras. Since both of you are English learners, there is no unequal power dynamic. You are both in the same boat, trying to practice and express yourself.
        </p>
        <p>
          When you know your mistakes won't be graded or permanently linked to your profile, you stop overanalyzing your speech. You focus on communication rather than perfection, which is exactly how true speaking fluency is developed.
        </p>
      </>
    )
  },
  'best-free-cambly-alternative': {
    title: 'The Best Free Cambly Alternative in 2026',
    date: 'May 28, 2026',
    readTime: '5 min read',
    content: (
      <>
        <p>
          For years, Cambly has been the go-to platform for matching English learners with native speakers. However, Cambly is expensive, often charging hundreds of dollars a month for just a few hours of practice.
        </p>
        <h2>Why Look for a Cambly Alternative?</h2>
        <p>
          For many learners, the high cost of native-speaker platforms isn't justifiable or affordable. Furthermore, many students do not actually need structured native tutor sessions; they simply need a place to converse and practice what they already know.
        </p>
        <h2>Enter Norinly: Instant, Peer-to-Peer, and Free</h2>
        <p>
          Norinly offers a completely free alternative focused on peer-to-peer conversations. Here is how it compares:
        </p>
        <ul>
          <li><strong>Cost:</strong> Cambly is highly expensive; Norinly is 100% free with no credit card required.</li>
          <li><strong>Signup:</strong> Cambly requires email, profiles, and configuration; Norinly connects you anonymously in one tap.</li>
          <li><strong>Interaction:</strong> Cambly utilizes camera video; Norinly is audio-only, eliminating visual pressure.</li>
        </ul>
        <p>
          If you are looking to build conversational fluidness and confidence without breaking the bank, Norinly is the best free alternative available.
        </p>
      </>
    )
  },
  'overcome-fear-of-speaking-english': {
    title: 'How to Overcome the Fear of Speaking English',
    date: 'May 12, 2026',
    readTime: '6 min read',
    content: (
      <>
        <p>
          Do you freeze when someone asks you a question in English? Do you struggle to find the right words, even though you understand what they say? You are not alone. Speaking anxiety is the single biggest barrier to English fluency.
        </p>
        <h2>Where Does Speaking Anxiety Come From?</h2>
        <p>
          Anxiety stems from the fear of judgment. We worry about mispronouncing words, using incorrect grammar, or sounding unintelligent. This fear triggers a fight-or-flight response, making our minds go blank during conversations.
        </p>
        <h2>3 Tips to Overcome Speaking Anxiety</h2>
        <ol>
          <li>
            <strong>Focus on communication, not perfection:</strong> Native speakers make grammar mistakes all the time. Your goal is simply to make your thoughts understood, not to be a textbook.
          </li>
          <li>
            <strong>Practice in low-stakes environments:</strong> Avoid practicing in high-pressure situations first. Use anonymous, audio-only platforms like Norinly where you can talk to strangers who have no expectations and are also learning.
          </li>
          <li>
            <strong>Embrace the pauses:</strong> Speaking slowly and taking deep breaths is completely natural. Don't rush your sentences. Give your brain the time to organize thoughts in English.
          </li>
        </ol>
        <p>
          By taking the pressure off yourself and practicing consistently in relaxed settings, you will find your conversational anxiety fading away.
        </p>
      </>
    )
  }
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-neutral-950 py-16 px-4 sm:px-6">
      <article className="max-w-2xl mx-auto space-y-8">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
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
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none text-neutral-300 text-base leading-relaxed space-y-6 pt-4 border-t border-neutral-900
          prose-headings:text-white prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
          prose-h2:text-xl prose-h3:text-lg
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-2">
          {post.content}
        </div>

        {/* Call to action */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center space-y-4 mt-12">
          <h3 className="text-lg font-bold text-white">Ready to put this into practice?</h3>
          <p className="text-neutral-400 text-sm max-w-sm mx-auto">
            Connect with a friendly English learner right now. No signup required.
          </p>
          <Link
            href="/connect"
            className="inline-flex h-11 px-6 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl transition-all duration-200 text-sm items-center justify-center"
          >
            Start Speaking Now
          </Link>
        </div>
      </article>
    </div>
  );
}
