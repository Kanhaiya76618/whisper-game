'use client';

import React, { useState, useEffect } from 'react';
import { FlowMetricsData } from '../types';

interface HeaderProps {
  metrics: FlowMetricsData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ metrics, activeTab, setActiveTab }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 13, minutes: 48, seconds: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="pt-10 pb-8 text-center max-w-4xl mx-auto px-4">
      {/* Top Tagline / Meta */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs tracking-widest uppercase font-mono text-ink-muted mb-4">
        <span>Goa Beach House // Sprint 04</span>
        <span className="text-ink-faint">•</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
          Live Sync Active
        </span>
        <span className="text-ink-faint">•</span>
        <span className="font-mono text-ink">
          Demo Day in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>

      {/* Main Editorial Headline */}
      <h1 className="text-5xl md:text-7xl font-serif text-ink tracking-tight mb-4 leading-none">
        Hacker House Live Board
      </h1>

      {/* Editorial Subtitle */}
      <p className="text-base md:text-lg text-ink-muted max-w-2xl mx-auto font-sans leading-relaxed mb-6 font-light">
        A voice-native collective dashboard. Showcase ongoing builds, transcribe audio wall notes, and blow the horn in Goa.
      </p>

      {/* FlowMetrics Bar Pill */}
      <div className="inline-flex items-center gap-4 px-4 py-2 bg-cream-surface rounded-full border border-black/15 text-xs font-mono text-ink mb-8">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ink"></span>
          <strong>{metrics.wordsDictated.toLocaleString()}</strong> words dictated
        </span>
        <span className="text-ink-faint">|</span>
        <span>
          <strong>{metrics.promptsCount}</strong> voice prompts
        </span>
        <span className="text-ink-faint">|</span>
        <span className="text-ink">
          <strong>~{metrics.timeSavedMinutes}m</strong> saved vs typing
        </span>
      </div>

      {/* Minimal Editorial Navigation Tabs */}
      <nav className="flex justify-center border-b border-black/15 gap-8 text-sm font-sans tracking-normal">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 transition-colors duration-150 relative ${
            activeTab === 'projects'
              ? 'text-ink font-medium border-b-2 border-ink -mb-[1px]'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          Project Showcase
        </button>
        <button
          onClick={() => setActiveTab('voice-notes')}
          className={`pb-3 transition-colors duration-150 relative ${
            activeTab === 'voice-notes'
              ? 'text-ink font-medium border-b-2 border-ink -mb-[1px]'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          Voice Notes Wall
        </button>
        <button
          onClick={() => setActiveTab('game')}
          className={`pb-3 transition-colors duration-150 relative ${
            activeTab === 'game'
              ? 'text-ink font-medium border-b-2 border-ink -mb-[1px]'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          Horn OK Please <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 ml-1 bg-black/10 rounded">Arcade</span>
        </button>
        <button
          onClick={() => setActiveTab('flow-metrics')}
          className={`pb-3 transition-colors duration-150 relative ${
            activeTab === 'flow-metrics'
              ? 'text-ink font-medium border-b-2 border-ink -mb-[1px]'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          FlowMetrics
        </button>
      </nav>
    </header>
  );
};
