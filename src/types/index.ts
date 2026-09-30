export interface Project {
  id: string;
  title: string;
  tagline: string;
  builder: string;
  avatarUrl?: string;
  upvotes: number;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  hasUpvoted?: boolean;
  createdAt: string;
}

export type NoteCategory = 'idea' | 'blocker' | 'shoutout' | 'food';

export interface VoiceNote {
  id: string;
  content: string;
  category: NoteCategory;
  author: string;
  createdAt: string;
  wordCount: number;
}

export interface Announcement {
  id: string;
  message: string;
  time: string;
  priority?: boolean;
}

export interface FlowMetricsData {
  wordsDictated: number;
  promptsCount: number;
  secondsSpoken: number;
  timeSavedMinutes: number; // calculated assuming 40 wpm typing vs 150 wpm dictating
}

export interface GameScore {
  id: string;
  playerName: string;
  score: number;
  date: string;
}
