'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProjectsBoard } from '../components/ProjectsBoard';
import { VoiceNotesWall } from '../components/VoiceNotesWall';
import { HornOKGame } from '../components/HornOKGame';
import { FlowMetricsView } from '../components/FlowMetricsView';
import {
  getStoredProjects,
  getStoredNotes,
  getStoredMetrics,
  updateStoredMetrics,
  INITIAL_ANNOUNCEMENTS,
} from '../lib/storage';
import { Project, VoiceNote, FlowMetricsData, Announcement } from '../types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'projects' | 'voice-notes' | 'game' | 'flow-metrics'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [metrics, setMetrics] = useState<FlowMetricsData>({
    wordsDictated: 1420,
    promptsCount: 14,
    secondsSpoken: 540,
    timeSavedMinutes: 26,
  });

  // Hydrate from localStorage once client mounts
  useEffect(() => {
    setProjects(getStoredProjects());
    setNotes(getStoredNotes());
    setMetrics(getStoredMetrics());
  }, []);

  const handleVoiceDictated = (words: number) => {
    const updated = updateStoredMetrics(words, Math.max(3, Math.round(words / 2.5)));
    setMetrics(updated);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream text-ink">
      <div>
        <Header
          metrics={metrics}
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab as any)}
        />

        <main className="pb-16">
          {activeTab === 'projects' && (
            <ProjectsBoard
              projects={projects}
              setProjects={setProjects}
              announcements={announcements}
              onVoiceDictated={handleVoiceDictated}
              onOpenGame={() => setActiveTab('game')}
            />
          )}

          {activeTab === 'voice-notes' && (
            <VoiceNotesWall
              notes={notes}
              setNotes={setNotes}
              onVoiceDictated={handleVoiceDictated}
            />
          )}

          {activeTab === 'game' && (
            <HornOKGame
              onScoreSaved={(score) => {
                // optionally post announcement if high score
                if (score > 400) {
                  setAnnouncements((prev) => [
                    {
                      id: 'anc-' + Date.now(),
                      message: `New arcade record: ${score}m reached in Horn OK Please!`,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      priority: true,
                    },
                    ...prev,
                  ]);
                }
              }}
            />
          )}

          {activeTab === 'flow-metrics' && (
            <FlowMetricsView
              metrics={metrics}
              onSimulatePrompt={() => handleVoiceDictated(45)}
            />
          )}
        </main>
      </div>

      {/* Editorial Footer */}
      <footer className="border-t border-black/15 py-8 px-4 text-center font-mono text-xs text-ink-muted">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ink"></span>
            <span>Built 100% by voice using Wispr Flow & Next.js</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#prompts"
              onClick={(e) => {
                e.preventDefault();
                alert('See PROMPTS.md in repository root for verbatim voice instruction logs.');
              }}
              className="hover:text-ink underline"
            >
              PROMPTS.md Log
            </a>
            <span>•</span>
            <span className="text-ink-faint">Goa Beach Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
