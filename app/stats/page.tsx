'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Flame, Smile, Activity, BarChart2 } from 'lucide-react';

interface ChartItem {
  label: string;
  minutes: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState({
    totalMinutes: 0,
    thisWeekCount: 0,
    lastWeekCount: 0,
    avgDurationText: '0m 0s',
    streak: 0,
    commonVibe: 'None',
    chartData: [] as ChartItem[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const rawSessions = localStorage.getItem('norinly_sessions');
      const sessions = rawSessions ? JSON.parse(rawSessions) : [];

      const rawFeedback = localStorage.getItem('norinly_feedback');
      const feedbacks = rawFeedback ? JSON.parse(rawFeedback) : [];

      // 1. Total minutes
      const totalSecs = sessions.reduce((acc: number, s: any) => acc + (s.durationSeconds || 0), 0);
      const totalMinutes = Math.round((totalSecs / 60) * 10) / 10;

      // 2. Average session duration
      const avgSecs = sessions.length > 0 ? totalSecs / sessions.length : 0;
      const avgMins = Math.floor(avgSecs / 60);
      const avgRemainingSecs = Math.round(avgSecs % 60);
      const avgDurationText = `${avgMins}m ${avgRemainingSecs}s`;

      // 3. This week vs last week sessions count
      const now = new Date();
      
      const getStartOfWeek = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday start
        date.setDate(diff);
        date.setHours(0, 0, 0, 0);
        return date;
      };

      const startOfThisWeek = getStartOfWeek(now);
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

      let thisWeekCount = 0;
      let lastWeekCount = 0;

      sessions.forEach((s: any) => {
        const sDate = new Date(s.date);
        if (sDate >= startOfThisWeek) {
          thisWeekCount++;
        } else if (sDate >= startOfLastWeek && sDate < startOfThisWeek) {
          lastWeekCount++;
        }
      });

      // 4. Streak
      let streak = 0;
      const formatDateKey = (d: Date) => d.toDateString();
      const sessionDates = new Set(sessions.map((s: any) => formatDateKey(new Date(s.date))));

      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);

      if (sessionDates.has(formatDateKey(checkDate))) {
        streak = 1;
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          if (sessionDates.has(formatDateKey(checkDate))) {
            streak++;
          } else {
            break;
          }
        }
      } else {
        // Check yesterday
        checkDate.setDate(checkDate.getDate() - 1);
        if (sessionDates.has(formatDateKey(checkDate))) {
          streak = 1;
          while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (sessionDates.has(formatDateKey(checkDate))) {
              streak++;
            } else {
              break;
            }
          }
        }
      }

      // 5. Common vibe
      const vibeCounts: Record<string, number> = {};
      feedbacks.forEach((f: any) => {
        if (f.vibe) {
          vibeCounts[f.vibe] = (vibeCounts[f.vibe] || 0) + 1;
        }
      });
      let commonVibe = 'None';
      let maxCount = 0;
      Object.entries(vibeCounts).forEach(([vibe, count]) => {
        if (count > maxCount) {
          maxCount = count;
          commonVibe = vibe;
        }
      });

      // 6. Chart data: last 7 days
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        
        const daySecs = sessions.filter((s: any) => {
          const sDate = new Date(s.date);
          sDate.setHours(0, 0, 0, 0);
          return sDate.getTime() === d.getTime();
        }).reduce((acc: number, s: any) => acc + (s.durationSeconds || 0), 0);

        chartData.push({
          label: daysOfWeek[d.getDay()],
          minutes: Math.round((daySecs / 60) * 10) / 10
        });
      }

      setStats({
        totalMinutes,
        thisWeekCount,
        lastWeekCount,
        avgDurationText,
        streak,
        commonVibe,
        chartData
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute SVG dimensions & coordinates
  const maxVal = Math.max(...stats.chartData.map(d => d.minutes), 5); // Minimum y-scale of 5 mins
  const svgHeight = 140;
  const svgWidth = 320;
  const barWidth = 26;
  const gap = 16;
  const paddingX = (svgWidth - (7 * barWidth + 6 * gap)) / 2;

  const getVibeEmoji = (vibe: string) => {
    switch (vibe) {
      case 'Fun': return '🎉';
      case 'Awkward': return '😰';
      case 'Educational': return '🎓';
      case 'Surprising': return '😮';
      case 'Great': return '😎';
      default: return '💬';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fc] py-10 px-4 sm:px-6 relative">
      {/* Return home link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="max-w-2xl w-full mx-auto mt-12 sm:mt-8 space-y-8 animate-fade-in">
        {/* Title Header */}
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Progress</h1>
          <p className="text-slate-500 text-sm">Track your English speaking sessions and feedback.</p>
        </div>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <span className="animate-pulse text-sm text-slate-400 font-semibold">Loading stats...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Row Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1: Total Minutes */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between min-h-[110px] shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Minutes Spoken</span>
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalMinutes}m</div>
                  <p className="text-[10px] text-slate-500 font-medium">Total time speaking</p>
                </div>
              </div>

              {/* Card 2: Streak */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between min-h-[110px] shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
                  <Flame className="w-4 h-4 text-orange-550 text-orange-500 fill-orange-500/20" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.streak} {stats.streak === 1 ? 'day' : 'days'}</div>
                  <p className="text-[10px] text-slate-500 font-medium">Consecutive practice days</p>
                </div>
              </div>

              {/* Card 3: Avg Session */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between min-h-[110px] shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Average Call</span>
                  <Activity className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-lg sm:text-2xl font-black text-slate-900">{stats.avgDurationText}</div>
                  <p className="text-[10px] text-slate-500 font-medium">Per voice session</p>
                </div>
              </div>

              {/* Card 4: Top Vibe */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between min-h-[110px] shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Common Vibe</span>
                  <Smile className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
                    {stats.commonVibe !== 'None' && (
                      <span>{getVibeEmoji(stats.commonVibe)}</span>
                    )}
                    <span>{stats.commonVibe}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Derived from call feedback</p>
                </div>
              </div>
            </div>

            {/* Weekly Comparison Strip */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900">Sessions comparison</h3>
                  <p className="text-xs text-slate-500">Comparing current week to last week.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="text-left sm:text-right">
                  <div className="text-lg font-black text-slate-900">
                    {stats.thisWeekCount} vs {stats.lastWeekCount}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    {stats.thisWeekCount >= stats.lastWeekCount ? (
                      <span className="text-blue-600">
                        +{stats.lastWeekCount > 0 ? Math.round(((stats.thisWeekCount - stats.lastWeekCount) / stats.lastWeekCount) * 100) : stats.thisWeekCount * 100}% up
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        -{Math.round(((stats.lastWeekCount - stats.thisWeekCount) / stats.lastWeekCount) * 100)}% down
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart Section */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Last 7 Days speaking</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minutes Spoken</span>
              </div>

              {/* SVG Chart Graphic */}
              <div className="flex justify-center py-2 bg-slate-50/50 border border-slate-100 rounded-xl">
                <svg width="100%" height={svgHeight + 25} viewBox={`0 0 ${svgWidth} ${svgHeight + 25}`} className="overflow-visible max-w-sm" role="img" aria-label="Speaking practice statistics chart">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                     const y = svgHeight * (1 - r);
                     return (
                       <line
                         key={i}
                         x1="0"
                         y1={y}
                         x2={svgWidth}
                         y2={y}
                         stroke="#e2e8f0"
                         strokeWidth="1"
                         strokeDasharray="4 4"
                       />
                     );
                  })}

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>

                  {/* Bars & Labels */}
                  {stats.chartData.map((d, idx) => {
                    const x = paddingX + idx * (barWidth + gap);
                    // Scale bar height
                    const barHeight = (d.minutes / maxVal) * (svgHeight - 10);
                    const y = svgHeight - barHeight;

                    return (
                      <g key={idx} className="group cursor-default">
                        {/* Interactive Tooltip-like value above bar */}
                        {d.minutes > 0 && (
                          <text
                            x={x + barWidth / 2}
                            y={y - 6}
                            fill="#4f46e5"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          >
                            {d.minutes}m
                          </text>
                        )}
                        
                        {/* The Bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={Math.max(barHeight, 2)} // min height of 2px for visual indicator
                          fill="url(#bar-grad)"
                          rx="4"
                          className="transition-all duration-300 hover:opacity-85"
                        />

                        {/* X-Axis label */}
                        <text
                          x={x + barWidth / 2}
                          y={svgHeight + 16}
                          fill="#94a3b8"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {d.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
