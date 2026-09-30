import { Project, VoiceNote, Announcement, FlowMetricsData, GameScore } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Horn OK Please',
    tagline: 'Voice-controlled Goa beach road scooter jumper. Honk to leap cows and potholes.',
    builder: 'Arjun & Maya',
    upvotes: 24,
    tags: ['Web Audio API', 'Canvas', 'Wispr Voice'],
    demoUrl: '#arcade',
    createdAt: '2026-10-01T00:15:00Z',
  },
  {
    id: 'proj-2',
    title: 'Hacker House Live Board',
    tagline: 'Warm editorial minimalism dashboard for housemates, demo day countdown & live voice notes.',
    builder: 'Kanhaiya',
    upvotes: 19,
    tags: ['Next.js', 'Tailwind', 'Speech API'],
    demoUrl: '#',
    createdAt: '2026-10-01T00:20:00Z',
  },
  {
    id: 'proj-3',
    title: 'Chai-GPT Vending Agent',
    tagline: 'Microphone-equipped espresso machine that brews chai based on your stress timbre.',
    builder: 'Dev & Priya',
    upvotes: 14,
    tags: ['IoT', 'Audio Spectrogram', 'Raspberry Pi'],
    createdAt: '2026-09-30T22:00:00Z',
  }
];

export const INITIAL_NOTES: VoiceNote[] = [
  {
    id: 'note-1',
    content: 'Who has a spare USB-C audio interface for microphone testing? My laptop mic catches the AC hum.',
    category: 'blocker',
    author: 'Rohan',
    createdAt: '2026-10-01T00:10:00Z',
    wordCount: 16,
  },
  {
    id: 'note-2',
    content: 'Samosas and hot masala chai arrived in the kitchen corner. Take a break before sprint review!',
    category: 'food',
    author: 'Community Lead',
    createdAt: '2026-10-01T00:05:00Z',
    wordCount: 16,
  },
  {
    id: 'note-3',
    content: 'Huge shoutout to Sara for debugging the Web Audio analyser node thresholds at 2 AM!',
    category: 'shoutout',
    author: 'Vikram',
    createdAt: '2026-09-30T23:55:00Z',
    wordCount: 15,
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-1',
    message: 'Demo Day rehearsal starts in 14 hours at the main courtyard lounge.',
    time: '00:30',
    priority: true,
  },
  {
    id: 'anc-2',
    message: 'High-speed 1Gbps WiFi SSID has been updated to HH-Speed-5G.',
    time: '23:45',
  },
  {
    id: 'anc-3',
    message: 'Horn OK Please high score competition is now live on the arcade board!',
    time: '23:30',
  }
];

export const INITIAL_FLOW_METRICS: FlowMetricsData = {
  wordsDictated: 1420,
  promptsCount: 14,
  secondsSpoken: 540,
  timeSavedMinutes: 24,
};

const STORAGE_KEYS = {
  PROJECTS: 'hh_live_projects_v1',
  NOTES: 'hh_live_notes_v1',
  METRICS: 'hh_live_flow_metrics_v1',
  GAME_SCORES: 'hh_horn_ok_scores_v1',
  BEST_SCORE: 'hh_horn_ok_best_v1',
};

export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PROJECTS;
  }
};

export const saveProjects = (projects: Project[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const getStoredNotes = (): VoiceNote[] => {
  if (typeof window === 'undefined') return INITIAL_NOTES;
  const data = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    return INITIAL_NOTES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTES;
  }
};

export const saveNotes = (notes: VoiceNote[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

export const getStoredMetrics = (): FlowMetricsData => {
  if (typeof window === 'undefined') return INITIAL_FLOW_METRICS;
  const data = localStorage.getItem(STORAGE_KEYS.METRICS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(INITIAL_FLOW_METRICS));
    return INITIAL_FLOW_METRICS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_FLOW_METRICS;
  }
};

export const updateStoredMetrics = (newWords: number, spokenSeconds: number = 5): FlowMetricsData => {
  const current = getStoredMetrics();
  const wordsDictated = current.wordsDictated + newWords;
  const promptsCount = current.promptsCount + 1;
  const secondsSpoken = current.secondsSpoken + spokenSeconds;
  // Estimated time saved: typing is ~40 wpm, speaking is ~150 wpm.
  // Typing time = words / 40 min. Speech time = words / 150 min.
  // Time saved = words * (1/40 - 1/150) = words * (110 / 6000) ~= words * 0.0183 min
  const timeSavedMinutes = Math.round(wordsDictated * 0.0183);

  const updated: FlowMetricsData = {
    wordsDictated,
    promptsCount,
    secondsSpoken,
    timeSavedMinutes,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(updated));
  }
  return updated;
};

export const getBestGameScore = (): number => {
  if (typeof window === 'undefined') return 340;
  const score = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
  return score ? parseInt(score, 10) : 340;
};

export const saveBestGameScore = (score: number) => {
  if (typeof window === 'undefined') return;
  const current = getBestGameScore();
  if (score > current) {
    localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
  }
};
