# Hacker House Live Board & "Horn OK Please" Voice Arcade 🛵 🌴

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](./LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=flat-square&logo=docker&logoColor=white)](./Dockerfile)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg?style=flat-square&logo=next.js)](https://nextjs.org)
[![Wispr Flow](https://img.shields.io/badge/Wispr_Flow-100%25_Voice_Built-7B61FF.svg?style=flat-square)](./PROMPTS.md)

> **Live Demo:** Deployable on Vercel, Docker & GitHub Pages  
> **Aesthetic:** Warm Editorial Minimalism (Wispr Flow & Anthropic design philosophy)  
> **100% Voice-Built:** Built entirely via voice prompting. See [`PROMPTS.md`](./PROMPTS.md) for the timestamped voice transcript log.

---

## Overview

A unified real-time collective dashboard for hacker houses combined with a voice-controlled arcade mini-game, built specifically for the **Wispr Flow** hackathon.

1. **Hacker House Live Board:** Real-time project showcase where housemates display what they are building, with optimistic upvoting, builder tags, and demo links.
2. **Voice Notes Wall:** Spoken sticky-note board powered by the native browser **Web Speech API**. Speak into the mic; notes are transcribed in real-time, auto-categorized into `Idea` 💡, `Blocker` 🛑, `Shoutout` 🙌, or `Food & Chai` 🥟, and pinned to the shared wall.
3. **FlowMetrics Hub:** A real-time telemetry HUD tracking dictated word counts, voice prompts, and estimated typing time saved (*"I built this entire app by speaking 1,420 words"*).
4. **"Horn OK Please" Goa Voice Arcade:** A voice-controlled Goa beach road scooter runner. Cows (`🐄`), goats (`🐐`), and potholes (`🕳️`) appear in your lane. Make a sharp loud sound or yell *"HORN!"* into the microphone to honk and leap over obstacles. Ambient Goa highway traffic (`🛺`, `🚛`, `🚐`) cruises in the adjacent lane. Spacebar and screen tap also work so anyone can play anywhere.

---

## Design System: Warm Editorial Minimalism

Inspired by editorial layouts, print publications, and the clean design language of **Wispr Flow** and **Anthropic**:

- **Palette:**
  - Background: Warm ivory cream (`#FAF8EC`)
  - Typography & Borders: Near-black ink (`#1C1B17`)
  - Cards & Surfaces: Muted flat beige (`#EAE7D5`) with hairline `1px` borders at 22% opacity
  - Zero heavy gradients, zero neon colors, zero drop shadows
- **Typography:**
  - Editorial Headlines: *Instrument Serif* / *Fraunces* (Google Fonts) with tight tracking
  - Body & UI: *Inter* / *Geist* geometric sans
  - Telemetry: Monospace accents (*Geist Mono*)
- **Feel:** High negative space, centered composition, calm, responsive, and tactile.

---

## "Horn OK Please" — How to Play

- **Objective:** Travel as far as you can down the sunset beach road without hitting stray cows, goats, or potholes.
- **Controls:**
  - **Voice Horn:** Shout, whistle, or make a loud noise into your mic. The live decibel volume meter monitors audio levels; once it passes your sensitivity threshold, your scooter honks and jumps!
  - **Keyboard:** Press `[Spacebar]` to jump.
  - **Touch / Mouse:** Tap or click anywhere on the canvas to jump.
- **Sensitivity Calibrator:** Use the slider in the arcade toolbar to tune the microphone threshold to your room's ambient noise floor.
- **Audio Synthesis:** All sounds (the dual-tone horn, engine hum, cow moo, goat bleat, crash) are synthesized procedurally in real-time via the browser's **Web Audio API** — no audio assets or external files required.

---

## 🐳 Docker Deployment & Quickstart

This application is fully containerized with a lightweight multi-stage Docker build and Docker Compose configuration.

### Option 1: Docker Compose (One-Command Setup)

```bash
# Clone the repository
git clone https://github.com/Kanhaiya76618/whisper-game.git
cd whisper-game

# Build and start the container
docker compose up --build
```

Access [http://localhost:3000](http://localhost:3000).

### Option 2: Docker Build & Run Directly

```bash
# Build the production image
docker build -t whisper-game .

# Run the container mapping to port 3000
docker run -p 3000:3000 whisper-game
```

---

## 💻 Local Development (Non-Docker)

```bash
# Clone the repository
git clone https://github.com/Kanhaiya76618/whisper-game.git
cd whisper-game

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 100% Built by Voice

This entire repository, architecture, and feature set was dictated and guided by voice instructions. 
The chronological, verbatim voice log is maintained in [`PROMPTS.md`](./PROMPTS.md).

### Telemetry Summary (Wispr FlowMetrics)
- **Words Dictated:** ~1,420+ words
- **Speech Rate:** ~150 WPM
- **Typing Equivalent:** ~40 WPM
- **Estimated Time Saved:** ~26 minutes saved vs manual keyboard typing

---

## Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router with Standalone Output) + React 19
- **Containerization:** Multi-stage Docker + Docker Compose
- **CI/CD:** GitHub Actions workflow (`.github/workflows/ci.yml`)
- **Styling:** Tailwind CSS with custom editorial configuration
- **Audio Engine:** Browser Web Audio API (`AudioContext`, `AnalyserNode`, procedural oscillators)
- **Voice Transcription:** Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **State & Storage:** LocalStorage real-time sync with optimism-first updates (extensible to Supabase Realtime)
- **Deployment:** Vercel, Docker, GitHub Pages

---

## Open Source & Contributing

Contributions are welcome! Please check our [Contributing Guide](./CONTRIBUTING.md) for development workflows, voice-coding guidelines, and design system rules.

Licensed under the [MIT License](./LICENSE).
