'use client';

import React, { useState } from 'react';
import { VoiceNote, NoteCategory } from '../types';
import { saveNotes } from '../lib/storage';

interface VoiceNotesWallProps {
  notes: VoiceNote[];
  setNotes: React.Dispatch<React.SetStateAction<VoiceNote[]>>;
  onVoiceDictated?: (words: number) => void;
}

export const VoiceNotesWall: React.FC<VoiceNotesWallProps> = ({
  notes,
  setNotes,
  onVoiceDictated,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [filter, setFilter] = useState<NoteCategory | 'all'>('all');
  const [authorName, setAuthorName] = useState('');

  const autoCategorize = (text: string): NoteCategory => {
    const lower = text.toLowerCase();
    if (lower.includes('food') || lower.includes('chai') || lower.includes('coffee') || lower.includes('snack') || lower.includes('pizza') || lower.includes('lunch') || lower.includes('dinner')) {
      return 'food';
    }
    if (lower.includes('block') || lower.includes('bug') || lower.includes('error') || lower.includes('issue') || lower.includes('stuck') || lower.includes('help') || lower.includes('broken')) {
      return 'blocker';
    }
    if (lower.includes('thanks') || lower.includes('shoutout') || lower.includes('kudos') || lower.includes('great job') || lower.includes('awesome') || lower.includes('props')) {
      return 'shoutout';
    }
    return 'idea';
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    setIsRecording(true);
    setLiveTranscript('');

    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setLiveTranscript(current);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handlePinNote = () => {
    if (!liveTranscript.trim()) return;

    const words = liveTranscript.trim().split(/\s+/).length;
    const category = autoCategorize(liveTranscript);

    const newNote: VoiceNote = {
      id: 'note-' + Date.now(),
      content: liveTranscript.trim(),
      category,
      author: authorName.trim() || 'Spoken Note',
      createdAt: new Date().toISOString(),
      wordCount: words,
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotes(updated);

    if (onVoiceDictated) {
      onVoiceDictated(words);
    }

    setLiveTranscript('');
  };

  const filteredNotes = filter === 'all' ? notes : notes.filter((n) => n.category === filter);

  const categoryBadges: Record<NoteCategory, { label: string; symbol: string }> = {
    idea: { label: 'Idea', symbol: '💡' },
    blocker: { label: 'Blocker', symbol: '🛑' },
    shoutout: { label: 'Shoutout', symbol: '🙌' },
    food: { label: 'Food & Chai', symbol: '🥟' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title & Dictation Box */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight mb-3">
          Voice Notes Wall
        </h2>
        <p className="text-sm text-ink-muted max-w-xl mx-auto font-sans leading-relaxed mb-6 font-light">
          Speak your thought. The Web Speech API transcribes, auto-detects blockers, shoutouts, or chai calls, and pins it to the board.
        </p>

        {/* Live Audio Dictation Card */}
        <div className="max-w-xl mx-auto p-6 bg-cream-surface border border-black/20 rounded-card text-left">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">
              {isRecording ? '🎙️ Listening to Voice...' : 'Click Record & Speak'}
            </span>
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="text-xs px-2.5 py-1 bg-cream border border-black/15 rounded text-ink focus:outline-none"
            />
          </div>

          <div className="min-h-[80px] p-3 bg-cream border border-black/15 rounded text-sm text-ink mb-4 font-sans">
            {liveTranscript ? (
              <span className="text-ink">{liveTranscript}</span>
            ) : (
              <span className="text-ink-faint italic font-serif">
                &quot;Need a second pair of eyes on audio worklet latency...&quot; or &quot;Who wants chai?&quot;
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={startVoiceRecording}
              className={`px-5 py-2.5 rounded-full text-xs font-mono transition-all duration-150 flex items-center gap-2 ${
                isRecording
                  ? 'bg-red-700 text-white animate-pulse'
                  : 'bg-ink text-cream hover:opacity-90'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              {isRecording ? 'Listening Now...' : '🎙️ Record Voice Note'}
            </button>

            {liveTranscript && (
              <button
                onClick={handlePinNote}
                className="px-5 py-2.5 bg-black/10 border border-black/20 text-ink rounded-full text-xs font-mono font-medium hover:bg-black/15"
              >
                Pin to Wall →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {(['all', 'idea', 'blocker', 'shoutout', 'food'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-150 ${
              filter === cat
                ? 'bg-ink text-cream font-semibold'
                : 'border border-black/15 text-ink-muted hover:text-ink hover:bg-black/5'
            }`}
          >
            {cat === 'all' ? 'All Notes' : categoryBadges[cat].label}
          </button>
        ))}
      </div>

      {/* Sticky Notes Masonry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredNotes.map((note) => {
          const badge = categoryBadges[note.category];
          return (
            <div
              key={note.id}
              className="p-5 bg-cream-surface border border-black/20 rounded-card flex flex-col justify-between hover:bg-cream-surfaceHover transition-colors duration-150"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-[11px] font-mono">
                  <span className="px-2 py-0.5 bg-black/10 rounded text-ink flex items-center gap-1 font-semibold uppercase">
                    <span>{badge.symbol}</span>
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-ink-faint">{note.wordCount} words</span>
                </div>
                <p className="text-sm font-sans text-ink leading-relaxed mb-4">
                  &ldquo;{note.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-mono text-ink-muted">
                <span>— {note.author}</span>
                <span className="text-[10px] text-ink-faint">
                  {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
