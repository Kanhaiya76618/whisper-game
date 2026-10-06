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

      {/* Video Presentation Script & Hackathon Submission Helper */}
      <div className="p-6 bg-cream-surface border border-black/20 rounded-card mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-serif text-ink">
              🎬 2-Minute Demo Video Script
            </h3>
            <p className="text-xs font-mono text-ink-muted">
              Ready-made talking points for your Loom/Screen recording
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-900/10 text-emerald-900 border border-emerald-800/30 rounded text-[11px] font-mono">
            ✓ Wispr Flow Credits Active
          </span>
        </div>

        <div className="space-y-4 text-xs font-sans text-ink leading-relaxed">
          <div className="p-3 bg-cream rounded border border-black/10">
            <strong className="font-mono text-ink-muted block mb-1">0:00 - 0:25 // The Hook:</strong>
            &ldquo;Hey judges! This is the Hacker House Live Board & Horn OK Please Voice Arcade. I built this entire app without writing code by hand — 100% voice prompted using Wispr Flow. Notice the warm editorial minimalism design inspired by Wispr and Anthropic.&rdquo;
          </div>

          <div className="p-3 bg-cream rounded border border-black/10">
            <strong className="font-mono text-ink-muted block mb-1">0:25 - 0:55 // Voice Notes & Live Board:</strong>
            &ldquo;In a hacker house, ideas and blockers happen fast. Watch me speak into our Voice Notes Wall — browser Speech API transcribes it in real time, auto-detects that it&apos;s a blocker or a chai break, and pins it to the shared house board with live upvotes.&rdquo;
          </div>

          <div className="p-3 bg-cream rounded border border-black/10">
            <strong className="font-mono text-ink-muted block mb-1">0:55 - 1:40 // The Hero: Horn OK Please:</strong>
            &ldquo;Now for our breakroom arcade: &apos;Horn OK Please&apos;! You ride a scooter down a sunset beach road in Goa. Cows and potholes appear in your lane. Watch: when I honk or shout into the mic, the live volume meter crosses the threshold, synthesizes an Indian truck horn using the Web Audio API, and leaps over the cow!&rdquo;
          </div>

          <div className="p-3 bg-cream rounded border border-black/10">
            <strong className="font-mono text-ink-muted block mb-1">1:40 - 2:00 // FlowMetrics Closer:</strong>
            &ldquo;Finally, FlowMetrics tracks our voice telemetry: {metrics.wordsDictated.toLocaleString()} words spoken, saving over {metrics.timeSavedMinutes} minutes. Every single prompt is recorded verbatim with timestamps in PROMPTS.md. Built for Wispr Flow.&rdquo;
          </div>
        </div>
      </div>
    </div>
  );
};
