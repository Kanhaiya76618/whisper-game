'use client';

import React, { useState } from 'react';
import { Project, Announcement } from '../types';
import { saveProjects } from '../lib/storage';

interface ProjectsBoardProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  announcements: Announcement[];
  onVoiceDictated?: (words: number) => void;
  onOpenGame?: () => void;
}

export const ProjectsBoard: React.FC<ProjectsBoardProps> = ({
  projects,
  setProjects,
  announcements,
  onVoiceDictated,
  onOpenGame,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [builder, setBuilder] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleUpvote = (id: string) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        const hasUpvoted = !p.hasUpvoted;
        return {
          ...p,
          upvotes: hasUpvoted ? p.upvotes + 1 : Math.max(0, p.upvotes - 1),
          hasUpvoted,
        };
      }
      return p;
    });
    // Sort by upvotes descending
    updated.sort((a, b) => b.upvotes - a.upvotes);
    setProjects(updated);
    saveProjects(updated);
  };

  const handleStartVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Try Chrome or Safari.');
      return;
    }
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTagline((prev) => (prev ? prev + ' ' + transcript : transcript));
      const words = transcript.trim().split(/\s+/).length;
      if (onVoiceDictated) onVoiceDictated(words);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const newProject: Project = {
      id: 'proj-' + Date.now(),
      title: title.trim(),
      tagline: tagline.trim(),
      builder: builder.trim() || 'Anonymous Housemate',
      upvotes: 1,
      hasUpvoted: true,
      tags: tagsInput
        ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Demo Day'],
      createdAt: new Date().toISOString(),
    };

    const updated = [newProject, ...projects];
    updated.sort((a, b) => b.upvotes - a.upvotes);
    setProjects(updated);
    saveProjects(updated);

    setTitle('');
    setTagline('');
    setBuilder('');
    setTagsInput('');
    setShowSubmitModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Announcements Marquee */}
      {announcements.length > 0 && (
        <div className="mb-10 p-4 bg-cream-surface border border-black/20 rounded-card flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            <span className="px-2 py-0.5 bg-ink text-cream rounded text-[10px] font-bold uppercase tracking-wider">
              Notice
            </span>
            <span className="truncate text-ink-muted">
              {announcements[0].message}
            </span>
          </div>
          <span className="text-ink-faint whitespace-nowrap">{announcements[0].time}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight">
            House Projects
          </h2>
          <p className="text-xs text-ink-muted uppercase tracking-wider font-mono mt-1">
            Realtime upvotes • {projects.length} works in progress
          </p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="self-start sm:self-auto px-5 py-2.5 bg-ink text-cream rounded-full text-xs font-medium tracking-wide transition-opacity hover:opacity-90 active:scale-[0.99]"
        >
          + Submit Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article
            key={project.id}
            className="p-6 bg-cream-surface border border-black/20 rounded-card flex flex-col justify-between hover:bg-cream-surfaceHover transition-colors duration-150"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-2xl font-serif text-ink leading-snug">
                  {project.title}
                </h3>
                <button
                  onClick={() => handleUpvote(project.id)}
                  aria-label="Upvote project"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-150 ${
                    project.hasUpvoted
                      ? 'bg-ink text-cream font-semibold'
                      : 'border border-black/20 text-ink hover:bg-black/5'
                  }`}
                >
                  <span>▲</span>
                  <span>{project.upvotes}</span>
                </button>
              </div>

              <p className="text-sm text-ink-muted leading-relaxed mb-6 font-sans">
                {project.tagline}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 bg-black/5 rounded text-ink-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/10 text-xs font-mono text-ink-muted">
                <span>By {project.builder}</span>
                {project.demoUrl === '#arcade' ? (
                  <button
                    onClick={onOpenGame}
                    className="underline hover:text-ink font-sans text-xs font-medium"
                  >
                    Play Horn OK Please →
                  </button>
                ) : project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-ink font-sans text-xs font-medium"
                  >
                    Demo Link →
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-cream-surface border border-black/25 rounded-card p-6 md:p-8 max-w-lg w-full">
            <div className="flex justify-between items-baseline mb-6">
              <h3 className="text-2xl font-serif text-ink">Submit Your Build</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-xs font-mono uppercase text-ink-muted hover:text-ink"
              >
                Close [esc]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Voice Surfer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-cream border border-black/20 rounded text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono text-ink-muted uppercase">
                    Tagline & Pitch
                  </label>
                  <button
                    type="button"
                    onClick={handleStartVoice}
                    className="text-xs font-mono flex items-center gap-1 text-ink underline"
                  >
                    {isListening ? '🎙️ Listening...' : '🎙️ Dictate Pitch'}
                  </button>
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your project, stack, or how voice works with it..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-cream border border-black/20 rounded text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                  Builder / Team
                </label>
                <input
                  type="text"
                  placeholder="Your Name / Handle"
                  value={builder}
                  onChange={(e) => setBuilder(e.target.value)}
                  className="w-full px-3 py-2 bg-cream border border-black/20 rounded text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js, Wispr, Hardware"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-cream border border-black/20 rounded text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 border border-black/20 rounded-full text-xs font-mono text-ink hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ink text-cream rounded-full text-xs font-medium hover:opacity-90"
                >
                  Post to Live Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
