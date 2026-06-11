'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, HelpCircle, Trophy, RefreshCw, Flame, Award, ChevronRight } from 'lucide-react';
import { getDailyQuizQuestions, getTodayKey, QuizQuestion } from '@/lib/learning-data';

interface UserState {
  anonId: string;
  streak: number;
  lastVisitDate: string;
  quizCompleted: boolean;
  quizScore: number | null;
  quizScoreHistory: { date: string; score: number }[];
  wordViewed: boolean;
  lastWordViewDate: string;
  voiceXP?: number;
}

const DEFAULT_STATE = (anonId: string): UserState => ({
  anonId,
  streak: 0,
  lastVisitDate: '',
  quizCompleted: false,
  quizScore: null,
  quizScoreHistory: [],
  wordViewed: false,
  lastWordViewDate: '',
});

export default function QuizPage() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [tempScore, setTempScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load user state
  useEffect(() => {
    let anonId = localStorage.getItem('norinly_anon_id');
    if (!anonId) {
      anonId = 'anon_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('norinly_anon_id', anonId);
    }

    const stored = localStorage.getItem('norinly_learn_state');
    let state: UserState;
    if (stored) {
      try {
        state = JSON.parse(stored);
        if (!state.anonId) state.anonId = anonId;
      } catch (e) {
        state = DEFAULT_STATE(anonId);
      }
    } else {
      state = DEFAULT_STATE(anonId);
    }

    // Reset quiz if it's a new day
    const today = getTodayKey();
    if (state.lastVisitDate !== today) {
      state.quizCompleted = false;
      state.quizScore = null;
      state.lastVisitDate = today;
      localStorage.setItem('norinly_learn_state', JSON.stringify(state));
    }

    setUserState(state);
    setQuizQuestions(getDailyQuizQuestions());
    setLoading(false);
  }, []);

  const saveState = (updated: UserState) => {
    setUserState(updated);
    localStorage.setItem('norinly_learn_state', JSON.stringify(updated));
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const currentQuestion = quizQuestions[quizIndex];
    if (optionIndex === currentQuestion.correct) {
      setTempScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      // Quiz completed!
      const finalScore = selectedAnswer === quizQuestions[quizIndex].correct ? tempScore + 1 : tempScore;
      const today = getTodayKey();
      
      if (userState) {
        const updatedHistory = [...userState.quizScoreHistory];
        // Remove today's previous score if exists to prevent duplicates
        const filtered = updatedHistory.filter((h) => h.date !== today);
        filtered.push({ date: today, score: finalScore });

        // Update streak
        let newStreak = userState.streak;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split('T')[0];
        
        if (userState.lastVisitDate === yesterdayKey || userState.streak === 0) {
          newStreak += 1;
        } else if (userState.lastVisitDate !== today) {
          // If they missed a day, reset streak to 1
          newStreak = 1;
        }

        const updatedState: UserState = {
          ...userState,
          quizCompleted: true,
          quizScore: finalScore,
          quizScoreHistory: filtered,
          streak: newStreak,
          lastVisitDate: today,
        };
        saveState(updatedState);
      }
    }
  };

  if (loading || !userState) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        <p className="text-slate-500 text-xs mt-4">Loading today's quiz...</p>
      </div>
    );
  }

  const today = getTodayKey();
  const hasFinished = userState.quizCompleted;

  return (
    <div className="flex-1 bg-[#f8f9fc] py-10 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-full px-3 py-1 text-xs font-bold text-orange-600">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              {userState.streak} Day Streak
            </div>
          </div>
        </div>

        {/* Header Title Card */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-1.5 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
            🧠 DAILY PRACTICE CHALLENGE
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Daily English Quiz</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Expand your vocabulary, correct grammatical errors, and master conversational idioms in 10 questions.
          </p>
        </div>

        {/* Main Quiz Render */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
          {hasFinished ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-20 h-20 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-4xl mx-auto shadow-sm">
                {userState.quizScore! >= 8 ? '🏆' : userState.quizScore! >= 5 ? '👏' : '📚'}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-950">Quiz Completed!</h2>
                <p className="text-slate-900 font-extrabold text-lg">
                  Score: <span className="text-purple-600">{userState.quizScore}/10</span>
                </p>
                <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                  {userState.quizScore! >= 8 
                    ? 'Excellent job! Your understanding of grammar and idioms is exceptional.' 
                    : userState.quizScore! >= 5 
                      ? 'Well done! Keep practicing daily to build your confidence and fluency.' 
                      : 'Good try! Fluency is built step-by-step. Come back tomorrow to try again.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <Link
                  href="/learn"
                  className="w-full sm:w-auto px-6 h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center shadow-sm"
                >
                  View Learning Dashboard
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center"
                >
                  Return Home
                </Link>
              </div>
            </div>
          ) : !quizStarted ? (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                  10
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Today's Topic: General English</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">10 Multiple Choice Questions (Grammar, Idioms, Vocab)</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-slate-500 text-xs leading-relaxed">
                  Quizzes rotate daily. Completing today's quiz earns you virtual XP and secures your daily practice streak!
                </p>
                <button
                  onClick={() => setQuizStarted(true)}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-600/10 text-xs flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:scale-98"
                >
                  Start Today's Quiz <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Count & Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Question {quizIndex + 1} of 10</span>
                  <span className="text-purple-600 font-extrabold">{Math.floor((quizIndex / 10) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(quizIndex / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question text */}
              <div className="bg-slate-50/50 border border-slate-150 p-5 rounded-2xl">
                <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                  {quizQuestions[quizIndex].type}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed mt-2.5">
                  {quizQuestions[quizIndex].question}
                </h3>
              </div>

              {/* Answers Grid */}
              <div className="flex flex-col gap-2.5">
                {quizQuestions[quizIndex].options.map((option, idx) => {
                  const isCorrect = idx === quizQuestions[quizIndex].correct;
                  const isSelected = idx === selectedAnswer;
                  
                  let btnClass = "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700";
                  let badgeClass = "bg-slate-50 text-slate-500 border-slate-200";

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold";
                      badgeClass = "bg-emerald-500 text-white border-emerald-500";
                    } else if (isSelected) {
                      btnClass = "border-red-500 bg-red-50 text-red-800 font-semibold";
                      badgeClass = "bg-red-500 text-white border-red-500";
                    } else {
                      btnClass = "border-slate-100 bg-slate-50/40 text-slate-400 opacity-65";
                      badgeClass = "bg-slate-100 text-slate-300 border-slate-100";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left px-4.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 cursor-pointer ${btnClass}`}
                    >
                      <span className={`w-6 h-6 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${badgeClass}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Block */}
              {showExplanation && (
                <div className="bg-emerald-50/70 border border-emerald-100 p-4.5 rounded-2xl text-xs leading-relaxed space-y-1 animate-fade-in text-slate-750">
                  <p className="text-emerald-800 font-bold flex items-center gap-1">💡 Explanation</p>
                  <p className="font-semibold">{quizQuestions[quizIndex].explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {selectedAnswer !== null && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-600/10 text-xs flex items-center justify-center gap-1.5"
                >
                  {quizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz ✓'}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
