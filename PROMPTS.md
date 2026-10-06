# Voice Instruction Log (Prompt Audit Trail)

> **Project:** Hacker House Live Board & "Horn OK Please" Voice Arcade  
> **Methodology:** 100% voice-prompted agentic build  
> **Design Philosophy:** Warm editorial minimalism (Wispr Flow / Anthropic aesthetic)

---

## [2026-10-01T00:33:33+05:30] Prompt 1

Got it: a small, lovable project you can finish in about three hours. That changes my pick. QAOA Playground is the wrong size for a side task, and only a few judges would enjoy it.

My pick: "Horn OK Please", a game you play with your voice. You ride a scooter down a Goa beach road at sunset while cows and potholes keep showing up. Your voice is the horn: make a loud noise and the scooter honks and jumps. Tap or space also works, so judges can play anywhere.

Easy to get: It's built by voice and played by voice, so judges understand it in five seconds, and it fits the Wispr theme.
Low risk: It's one static page with no backend, keys or accounts, and it deploys free on GitHub Pages. Mic access works on HTTPS and localhost.
Cheap to build: Every short spoken prompt changes something visible, so you use few words.
Relatable: "Horn OK Please" is the phrase painted on Indian trucks, and cows on the road is a joke most people in India will get.

If you want even less work, there are two backups. One is a Hacker House Bingo card: funny hackathon clichés, tap to mark, confetti on bingo, about an hour. The other is a Goa beach-vibe quiz that recommends a beach, but check the beach details yourself.

Time plan

Sitting one (~90 min, recorded): Sign up through the referral link, set up Wispr, dictate the brief below, get the game playable, fix one bug by voice, and commit.
Sitting two (~60 min): Polish, deploy, dictate the README, and cut a 2–3 minute highlight.
Oct 4–5: Submit the repo link, public video link and form.

Say this to your agent (read it aloud, don't paste it)

Let's build a small browser game called Horn OK Please. You ride a scooter along a Goa beach road at sunset, and cows and potholes keep appearing in your lane. Your voice is the horn: when the microphone volume passes a threshold, the scooter honks and jumps. Tapping the screen or pressing space also jumps, so it works without a mic.

Keep it to one HTML file with a canvas and plain JavaScript. No frameworks, no backend, no API keys, deployable as a static site. Use emojis for the sprites so we need no image files. Score is distance travelled, with the best score saved in local storage. Include a start screen that asks for microphone permission, a sensitivity slider with a live volume meter, sound effects made with the Web Audio API, and a game over screen with a restart button. It should look good on a laptop and on a phone.

Here's how we work. Before writing any code, give me your plan in five bullet points and wait for me to say go. Build in small steps, starting with only the scrolling road and a scooter that jumps on tap. After each step, run the game and tell me what to test. Commit after every working step with a clear message. Keep a prompts file that records each instruction I give you, verbatim, with a timestamp. Keep the README updated with what the game is, how to play, and a short section on how it was built by voice. If something is ambiguous, ask me one question instead of guessing.

Then dictate these one at a time

"Add the microphone horn: when the volume passes a threshold, the scooter jumps. Show a live volume meter."
"Add cows and potholes as obstacles that get faster over time, with a distance score."
"Give it a sunset sky, palm trees scrolling in parallax, and a honk and a moo as sound effects."
"Background noise keeps triggering jumps. Add a sensitivity slider and a short cooldown." This bug will probably happen on its own, and it's your live bug-fix footage.
"Add a best score, a game over screen with restart, and make it work on a phone."
"Deploy it to GitHub Pages and put the live link at the top of the README."

Before you submit: Create the Wispr account through the referral link first and use the same email on the form. Make the repo public with the live link and the prompts file, and post the video publicly.
i want you to combine 1. Hacker House Live Board ⭐ (my top pick)
A realtime dashboard for the house: who's building what, project showcase with upvotes, demo-day countdown, announcements feed.

 Stack: Next.js + Tailwind + Supabase (realtime) + Vercel
 Why: the judges are likely HH organizers — something they could actually use stands out, and realtime upvotes demo beautifully on video.
2. Voice Notes Wall
Voice-first sticky note board — speak, it transcribes (Web Speech API is free and built into browsers), auto-tags and pins to a shared wall. Meta and on-brand: built by voice, for voice.

3. FlowMetrics
A dashboard/extension that counts words dictated + estimated time saved while building. End your video with: "I built this entire app by speaking 4,000 words." Very Wispr-marketing-friendly.

4. A game (2048 / Tetris / Wordle clone with a twist)
Easiest scope, most fun demo energy.

Workflow (2–3 sessions over the week)

Setup: Wispr Flow account via the referral link first, then Cursor (agent mode) or Claude Code, empty GitHub repo, screen recorder running.
Kickoff: dictate this starter prompt:
text

You are my full-stack coding agent. I will only give instructions by voice — 
never ask me to type code.

Project: Hacker House Live Board — a realtime dashboard where housemates post 
what they're building, upvote projects, and see a demo-day countdown + announcements.

Stack: Next.js + Tailwind + Supabase realtime, deployed on Vercel.

Step 1: Output a short plan — file structure, DB tables, 4 build milestones.
Step 2: Scaffold the app and get the dev server running.
Step 3: Wait for my next voice instruction. After each milestone, run the app 
and list what I should test.
Build in milestones, one dictated instruction each: "Milestone 2: build the project submission form and upvote button with optimistic updates."
Fix bugs by voice — this is your best footage. Describing a bug verbally and watching the agent fix it is exactly what they want to see.
Deploy + dictate the README (mention it's 100% voice-built, include your prompt log — the repo becomes evidence). these both 

---

## [2026-10-01T00:37:24+05:30] Prompt 2

for vercel deployable and also Design direction — "warm editorial minimalism" (reference: Wispr Flow and 
Anthropic marketing pages):

- Background: warm ivory cream (~#FAF8EC), generous whitespace, centered 
  composition everywhere
- Typography: high-contrast editorial serif for all headlines — use 
  "Instrument Serif" or "Fraunces" from Google Fonts, large sizes, slightly 
  tight letter-spacing. Body/UI text in "Inter" or "Geist" (geometric sans).
- Palette: near-black text (~#1C1B17), cream background, one muted beige 
  (~#EAE7D5) for card surfaces. Monochrome — no gradients, no bright colors, 
  no drop shadows.
- Cards: flat beige fill, 1px hairline border in near-black at ~25% opacity, 
  12px rounded corners, generous internal padding
- Interactions: subtle hover (surface darkens slightly, 150ms ease), black 
  focus rings, small scale or underline transitions
- Feel: calm, print-inspired, editorial, lots of negative space

Apply this design system consistently to every page and component.

"Go with Next.js plus Tailwind, local state for data first, and only add Supabase if the build goes smoothly and we have time. Use the design direction I gave you. Green light — go."

---

## [2026-10-06T22:08:43+05:30] Prompt 3

let's do other work we have 1 hr so make sure be perfect and done everything and tell me what to make a video

---

## [2026-10-06T22:09:09+05:30] Prompt 4

and i got wishper flow credits

---

## [2026-10-06T22:16:03+05:30] Prompt 5

in the game would add other thing like goat and pot holes are not working properly and add some other vehicles also that it not crash with them and put all these random

---

## [2026-10-06T22:21:36+05:30] Prompt 6

scooter is stand move forward but not align straing
