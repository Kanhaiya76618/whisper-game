'use client';

import React from 'react';
import { FlowMetricsData } from '../types';

interface FlowMetricsViewProps {
  metrics: FlowMetricsData;
  onSimulatePrompt?: () => void;
}

export const FlowMetricsView: React.FC<FlowMetricsViewProps> = ({ metrics, onSimulatePrompt }) => {
  // Speed assumptions: Voice = 150 WPM, Typing = 40 WPM
  const typingTimeHours = ((metrics.wordsDictated / 40) / 60).toFixed(2);
  const speechTimeHours = ((metrics.wordsDictated / 150) / 60).toFixed(2);
  const wordsSavedMultiplier = (150 / 40).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-6xl font-serif text-ink tracking-tight mb-3">
          FlowMetrics Hub
        </h2>
        <p className="text-sm font-sans text-ink-muted max-w-lg mx-auto font-light leading-relaxed">
          Quantitative telemetry of building by voice. Real-time words transcribed, keystrokes eliminated, and cognitive flow preserved.
        </p>
      </div>

      {/* Quote Banner */}
      <div className="mb-10 p-8 bg-cream-surface border border-black/20 rounded-card text-center">
        <blockquote className="text-2xl sm:text-3xl font-serif text-ink italic leading-snug mb-3">
          &ldquo;I built this entire app by speaking {metrics.wordsDictated.toLocaleString()} words.&rdquo;
        </blockquote>
        <p className="text-xs font-mono uppercase tracking-widest text-ink-muted">
          — Wispr Flow Hackathon Telemetry
        </p>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="p-6 bg-cream-surface border border-black/20 rounded-card flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Words Dictated
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-5xl font-serif text-ink">
              {metrics.wordsDictated.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink-faint">
            via Wispr Voice & Web Speech
          </span>
        </div>

        <div className="p-6 bg-cream-surface border border-black/20 rounded-card flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Time Saved
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-5xl font-serif text-ink">
              ~{metrics.timeSavedMinutes}m
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink-faint">
            vs 40 WPM manual keyboarding
          </span>
        </div>

        <div className="p-6 bg-cream-surface border border-black/20 rounded-card flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Voice Prompts
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-5xl font-serif text-ink">
              {metrics.promptsCount}
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink-faint">
            Recorded in PROMPTS.md log
          </span>
        </div>

        <div className="p-6 bg-cream-surface border border-black/20 rounded-card flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Speed Multiplier
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-5xl font-serif text-ink">
              {wordsSavedMultiplier}x
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink-faint">
            150 WPM voice vs 40 WPM typing
          </span>
        </div>
      </div>

      {/* Comparison Breakdown Table */}
      <div className="p-6 bg-cream-surface border border-black/20 rounded-card mb-8">
        <h3 className="text-xl font-serif text-ink mb-4">
          Modality Efficiency Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-black/15 text-ink-muted uppercase">
                <th className="py-2.5">Modality</th>
                <th className="py-2.5">Speed (WPM)</th>
                <th className="py-2.5">Time to Compose Code/Notes</th>
                <th className="py-2.5 text-right">Physical Strain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              <tr>
                <td className="py-3 font-semibold text-ink">Wispr Flow / Voice</td>
                <td className="py-3">150 WPM</td>
                <td className="py-3 font-semibold">{speechTimeHours} hours</td>
                <td className="py-3 text-right text-emerald-800">Zero RSI / Fluid</td>
              </tr>
              <tr>
                <td className="py-3 text-ink-muted">Standard Keyboard</td>
                <td className="py-3 text-ink-muted">40 WPM</td>
                <td className="py-3 text-ink-muted">{typingTimeHours} hours</td>
                <td className="py-3 text-right text-ink-faint">High Wrist Repetition</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
