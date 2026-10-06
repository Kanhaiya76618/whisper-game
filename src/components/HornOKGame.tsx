'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getBestGameScore, saveBestGameScore } from '../lib/storage';

interface HornOKGameProps {
  onScoreSaved?: (score: number) => void;
}

export const HornOKGame: React.FC<HornOKGameProps> = ({ onScoreSaved }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // UI state
  const [gameState, setGameState] = useState<'idle' | 'running' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(340);
  const [micActive, setMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [threshold, setThreshold] = useState(38); // sensitivity slider 1-100
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [lastJumpReason, setLastJumpReason] = useState<string>('');

  // Audio Context & Analyser
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastJumpTimeRef = useRef<number>(0);

  // Game internal state
  const [gameOverReason, setGameOverReason] = useState<string>('Hit an obstacle!');
  const gameRef = useRef({
    scooterY: 0,
    scooterVy: 0,
    isJumping: false,
    groundY: 0,
    gravity: 0.78,
    jumpForce: -13.5,
    distance: 0,
    speed: 5.5,
    obstacles: [] as Array<{
      x: number;
      type: 'cow' | 'goat' | 'pothole';
      width: number;
      height: number;
      passed: boolean;
    }>,
    // Background vehicles that cruise by in the adjacent lane and do NOT collide
    bgVehicles: [] as Array<{
      x: number;
      y: number;
      type: 'rickshaw' | 'truck' | 'bike' | 'van';
      speed: number;
      width: number;
      emoji: string;
    }>,
    trees: [] as Array<{ x: number; scale: number; speedMul: number }>,
    roadOffset: 0,
  });

  // Sound synthesis via Web Audio API
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playHonk = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(420, ctx.currentTime);
      osc2.frequency.setValueAtTime(495, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio fallback
    }
  }, [getAudioContext]);

  const playMoo = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(115, ctx.currentTime + 0.42);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio fallback
    }
  }, [getAudioContext]);

  const playBaa = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 0.12);
      osc.frequency.linearRampToValueAtTime(240, ctx.currentTime + 0.32);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  }, [getAudioContext]);

  const playCrash = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  }, [getAudioContext]);

  // Jump trigger with cooldown
  const triggerJump = useCallback(
    (reason: string) => {
      const now = performance.now();
      // Cooldown of 400ms to prevent noise jitter
      if (now - lastJumpTimeRef.current < 400) return;

      const g = gameRef.current;
      if (!g.isJumping) {
        g.scooterVy = g.jumpForce;
        g.isJumping = true;
        lastJumpTimeRef.current = now;
        setLastJumpReason(reason);
        playHonk();
      }
    },
    [playHonk]
  );

  // Initialize Microphone for Voice Input
  const enableMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;
      const ctx = getAudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicActive(true);
      setHasMicPermission(true);
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
      setHasMicPermission(false);
    }
  };

  // Setup initial load
  useEffect(() => {
    setBestScore(getBestGameScore());
  }, []);

  // Monitor microphone volume
  useEffect(() => {
    if (!micActive || !analyserRef.current) return;

    let micCheckId: number;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const checkVolume = () => {
      if (analyserRef.current && gameState === 'running') {
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicLevel(normalized);

        if (normalized >= threshold) {
          triggerJump('Voice Horn (Mic)');
        }
      } else {
        setMicLevel(0);
      }
      micCheckId = requestAnimationFrame(checkVolume);
    };

    micCheckId = requestAnimationFrame(checkVolume);
    return () => cancelAnimationFrame(micCheckId);
  }, [micActive, threshold, gameState, triggerJump]);

  // Keyboard and Tap listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'running') {
          triggerJump('Spacebar');
        } else if (gameState === 'idle' || gameState === 'gameover') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const startGame = async () => {
    if (!micActive) {
      await enableMic();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const groundY = canvas.height - 75;
    gameRef.current = {
      scooterY: groundY,
      scooterVy: 0,
      isJumping: false,
      groundY,
      gravity: 0.78,
      jumpForce: -13.5,
      distance: 0,
      speed: 5.5,
      obstacles: [],
      bgVehicles: [
        {
          x: canvas.width * 0.4,
          y: canvas.height - 96,
          type: 'rickshaw',
          speed: 3.2,
          width: 36,
          emoji: '🛺',
        },
      ],
      trees: [
        { x: 100, scale: 0.8, speedMul: 0.4 },
        { x: 320, scale: 1.1, speedMul: 0.45 },
        { x: 550, scale: 0.9, speedMul: 0.4 },
        { x: 740, scale: 1.2, speedMul: 0.5 },
      ],
      roadOffset: 0,
    };

    setScore(0);
    setGameState('running');
  };

  // Main Render and Physics Game Loop
  useEffect(() => {
    if (gameState !== 'running') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let obstacleTimer = 0;

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 16.666;
      lastTime = currentTime;

      const g = gameRef.current;

      // Update distance & speed
      g.distance += Math.round(g.speed * 0.15);
      g.speed = 5.5 + Math.min(6, g.distance * 0.0035);
      setScore(g.distance);

      // Scooter physics
      if (g.isJumping) {
        g.scooterVy += g.gravity * dt;
        g.scooterY += g.scooterVy * dt;

        if (g.scooterY >= g.groundY) {
          g.scooterY = g.groundY;
          g.scooterVy = 0;
          g.isJumping = false;
        }
      }

      // Parallax Trees
      for (const tree of g.trees) {
        tree.x -= g.speed * tree.speedMul * dt;
        if (tree.x < -60) {
          tree.x = canvas.width + Math.random() * 80;
        }
      }

      // Background non-colliding vehicles (traffic in upper lane)
      for (let i = g.bgVehicles.length - 1; i >= 0; i--) {
        const v = g.bgVehicles[i];
        v.x -= (g.speed * 0.75 + v.speed) * dt;
        if (v.x < -100) {
          g.bgVehicles.splice(i, 1);
        }
      }

      // Randomly spawn background vehicles (do NOT collide with player)
      if (Math.random() < 0.008 && g.bgVehicles.length < 2) {
        const vehicleTypes: Array<{ type: 'rickshaw' | 'truck' | 'bike' | 'van'; emoji: string; speed: number; width: number }> = [
          { type: 'rickshaw', emoji: '🛺', speed: 1.2, width: 34 },
          { type: 'truck', emoji: '🚛', speed: 0.8, width: 50 },
          { type: 'bike', emoji: '🏍️', speed: 2.4, width: 30 },
          { type: 'van', emoji: '🚐', speed: 1.5, width: 40 },
        ];
        const pick = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        g.bgVehicles.push({
          x: canvas.width + 60,
          y: canvas.height - 96,
          type: pick.type,
          emoji: pick.emoji,
          speed: pick.speed,
          width: pick.width,
        });
      }

      // Road dashes
      g.roadOffset = (g.roadOffset + g.speed * dt) % 40;

      // Spawn Obstacles (randomized cows, goats, and potholes)
      obstacleTimer += dt;
      const minInterval = Math.max(68, 108 - g.distance * 0.035);
      const randomThreshold = minInterval + (Math.sin(g.distance * 0.05) * 15 + 15);
      if (obstacleTimer > randomThreshold) {
        obstacleTimer = 0;
        const rand = Math.random();
        let obsType: 'cow' | 'goat' | 'pothole';
        let width = 38;
        let height = 34;

        if (rand < 0.38) {
          obsType = 'cow';
          width = 44;
          height = 38;
        } else if (rand < 0.70) {
          obsType = 'goat';
          width = 36;
          height = 30;
        } else {
          obsType = 'pothole';
          width = 46;
          height = 14;
        }

        g.obstacles.push({
          x: canvas.width + 25,
          type: obsType,
          width,
          height,
          passed: false,
        });
      }

      // Move & check collisions for obstacles
      for (let i = g.obstacles.length - 1; i >= 0; i--) {
        const obs = g.obstacles[i];
        obs.x -= g.speed * dt;

        // Sound cues when safely passing
        if (!obs.passed && obs.x < 80) {
          obs.passed = true;
          if (obs.type === 'cow') {
            playMoo();
          } else if (obs.type === 'goat') {
            playBaa();
          }
        }

        // Precise collision detection
        const scooterX = 90;
        const scooterW = 38;

        if (obs.type === 'pothole') {
          // Pothole collision:
          // Scooter crashes if horizontally overlapping while its wheels are ON the road
          const horizontalOverlap = (scooterX + scooterW - 10) > obs.x && (scooterX + 8) < (obs.x + obs.width);
          const isGrounded = g.scooterY >= g.groundY - 14; // airborne scooters clear the hole!

          if (horizontalOverlap && isGrounded) {
            playCrash();
            setGameOverReason('Thud! Dropped straight into a road pothole!');
            setGameState('gameover');
            saveBestGameScore(g.distance);
            setBestScore((prev) => Math.max(prev, g.distance));
            if (onScoreSaved) onScoreSaved(g.distance);
            return;
          }
        } else {
          // Animal collision (cow or goat):
          // Must jump above the animal's back
          const horizontalOverlap = (scooterX + scooterW - 12) > obs.x && (scooterX + 8) < (obs.x + obs.width);
          const animalTop = g.groundY - obs.height;
          const verticalOverlap = g.scooterY > animalTop + 10;

          if (horizontalOverlap && verticalOverlap) {
            playCrash();
            setGameOverReason(
              obs.type === 'cow'
                ? 'Ouch! Ran into a holy cow resting in the lane!'
                : 'Whoops! Startled a Goa beach goat!'
            );
            setGameState('gameover');
            saveBestGameScore(g.distance);
            setBestScore((prev) => Math.max(prev, g.distance));
            if (onScoreSaved) onScoreSaved(g.distance);
            return;
          }
        }

        if (obs.x < -80) {
          g.obstacles.splice(i, 1);
        }
      }

      // DRAW CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Sunset Sky Gradient (Goa beach evening)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height - 90);
      skyGrad.addColorStop(0, '#E88B67'); // sunset apricot
      skyGrad.addColorStop(0.5, '#F7BA8B'); // warm dusk
      skyGrad.addColorStop(1, '#FCE8CF'); // horizon glow
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Setting Sun
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width * 0.72, canvas.height * 0.38, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE2A4';
      ctx.shadowColor = '#FF9D5C';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();

      // 3. Ocean Horizon Line
      ctx.fillStyle = '#C89373';
      ctx.fillRect(0, canvas.height - 110, canvas.width, 22);

      // 4. Parallax Palm Trees (Silhouettes)
      ctx.font = '36px serif';
      for (const tree of g.trees) {
        ctx.fillText('🌴', tree.x, canvas.height - 100);
      }

      // 5. Goa Beach Road
      ctx.fillStyle = '#3A3833'; // asphalt road
      ctx.fillRect(0, canvas.height - 88, canvas.width, 88);

      // Road curb edge
      ctx.fillStyle = '#EAE7D5';
      ctx.fillRect(0, canvas.height - 88, canvas.width, 4);

      // Background ambient vehicles (cruising harmlessly in upper road lane)
      for (const v of g.bgVehicles) {
        ctx.font = '32px sans-serif';
        ctx.fillText(v.emoji, v.x, v.y);
      }

      // Center white dashes
      ctx.fillStyle = '#F8F6E8';
      for (let x = -g.roadOffset; x < canvas.width; x += 40) {
        ctx.fillRect(x, canvas.height - 46, 20, 3);
      }

      // Beach Road Landmark Signs
      const landmark1 = 500 - (g.distance % 600) * 4;
      if (landmark1 > -120 && landmark1 < canvas.width + 120) {
        ctx.fillStyle = '#26241F';
        ctx.fillRect(landmark1, canvas.height - 130, 95, 24);
        ctx.fillStyle = '#FAF8EC';
        ctx.font = '10px monospace';
        ctx.fillText('📍 ANJUNA 2KM', landmark1 + 8, canvas.height - 114);
      }

      // 6. Obstacles (Cows, Goats, Potholes)
      for (const obs of g.obstacles) {
        if (obs.type === 'cow') {
          ctx.font = '38px sans-serif';
          ctx.fillText('🐄', obs.x, g.groundY);
        } else if (obs.type === 'goat') {
          ctx.font = '32px sans-serif';
          ctx.fillText('🐐', obs.x, g.groundY);
        } else {
          // Pothole with dark crater ellipse on asphalt
          ctx.save();
          ctx.fillStyle = '#181714';
          ctx.beginPath();
          ctx.ellipse(obs.x + 20, g.groundY + 8, 22, 7, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#4A463B';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.font = '22px sans-serif';
          ctx.fillText('🕳️', obs.x + 2, g.groundY + 7);
          ctx.restore();
        }
      }

      // 7. Player Scooter (Facing Forward towards Right, Aligned Straight with Road)
      ctx.save();
      const scooterDrawX = 95;
      const roadVibe = g.isJumping ? 0 : Math.sin(g.distance * 0.4) * 0.6;
      const scooterDrawY = g.scooterY + 4 + roadVibe;

      ctx.translate(scooterDrawX, scooterDrawY);

      // Natural tilt: wheel lifts up slightly during jump ascent, levels straight on descent & ground
      const jumpTilt = g.isJumping ? Math.max(-0.22, Math.min(0.12, g.scooterVy * 0.016)) : 0;
      ctx.rotate(jumpTilt);

      // Flip horizontally so the scooter faces FORWARD (Right) down the Goa road
      ctx.scale(-1, 1);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = '42px sans-serif';
      ctx.fillText('🛵', 0, 0);
      ctx.restore();

      // Jump sound ripple & smoke effect
      if (g.isJumping) {
        ctx.save();
        ctx.textAlign = 'left';
        ctx.font = '15px sans-serif';
        ctx.fillText('📢 HORN!', 90, g.scooterY - 32);
        ctx.font = '14px sans-serif';
        ctx.fillText('💨', 60, g.groundY + 2);
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [gameState, playCrash, playMoo, playBaa, onScoreSaved]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title & Lore */}
      <div className="text-center mb-6">
        <h2 className="text-4xl sm:text-6xl font-serif text-ink tracking-tight mb-2">
          Horn OK Please
        </h2>
        <p className="text-sm font-sans text-ink-muted max-w-lg mx-auto font-light leading-relaxed">
          Ride your scooter down a Goa beach road at sunset. Cows and potholes appear in your lane. Make a loud noise into your mic or press space to honk and leap!
        </p>
      </div>

      {/* Control Bar & Calibrator */}
      <div className="mb-4 p-4 bg-cream-surface border border-black/20 rounded-card flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        {/* Live Mic Level & Sensitivity */}
        <div className="flex items-center gap-3">
          <button
            onClick={enableMic}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors ${
              micActive
                ? 'bg-emerald-900 text-white'
                : 'bg-black/10 text-ink hover:bg-black/15'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${micActive ? 'bg-emerald-400 animate-pulse' : 'bg-ink-muted'}`} />
            {micActive ? 'Mic Active' : 'Enable Voice Horn'}
          </button>

          {/* Volume Meter with Visible Threshold Line */}
          <div className="flex items-center gap-2">
            <span className="text-ink-muted text-[11px]">Level:</span>
            <div className="relative w-28 h-3.5 bg-black/10 rounded-full overflow-hidden flex items-center p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  micLevel >= threshold ? 'bg-red-600' : 'bg-ink'
                }`}
                style={{ width: `${Math.min(100, micLevel)}%` }}
              />
              {/* Threshold indicator line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                style={{ left: `${threshold}%` }}
                title={`Trigger Threshold: ${threshold}%`}
              />
            </div>
            <span className="text-[10px] text-ink-faint w-7">{micLevel}%</span>
          </div>
        </div>

        {/* Sensitivity Slider */}
        <div className="flex items-center gap-2">
          <span className="text-ink-muted text-[11px]">Threshold:</span>
          <input
            type="range"
            min="15"
            max="80"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
            className="w-24 accent-ink cursor-pointer"
          />
          <span className="text-[10px] text-ink-faint">{threshold}%</span>
        </div>

        {/* Live Score Counter & Manual Test Honk */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => {
              if (gameState === 'running') triggerJump('Manual Honk');
            }}
            className="px-2.5 py-1 bg-black/10 hover:bg-black/15 rounded text-[11px] font-mono text-ink"
          >
            📢 Test Honk
          </button>
          <span className="text-ink-faint">|</span>
          <span>
            Distance: <strong className="font-mono text-sm">{score}m</strong>
          </span>
          <span className="text-ink-faint">|</span>
          <span>
            Best: <strong className="font-mono text-sm">{bestScore}m</strong>
          </span>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="relative border border-black/25 rounded-card overflow-hidden bg-[#FAF8EC] flex justify-center items-center select-none shadow-none touch-none">
        <canvas
          ref={canvasRef}
          width={800}
          height={340}
          onClick={() => {
            if (gameState === 'running') triggerJump('Screen Tap');
          }}
          className="w-full h-auto max-h-[360px] block cursor-pointer"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-cream-surface/90 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-5xl mb-3">🛵 🐄 🌴</span>
            <h3 className="text-3xl sm:text-4xl font-serif text-ink mb-2">
              Ready for the Goa Sunset Ride?
            </h3>
            <p className="text-sm font-sans text-ink-muted max-w-md mb-6 leading-relaxed">
              Honk loud into your microphone to leap over stray cows and potholes. Spacebar or tapping also jumps.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-ink text-cream rounded-full text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 active:scale-95 transition-transform"
              >
                Start Game & Enable Horn [Space]
              </button>
            </div>
            <p className="text-[11px] font-mono text-ink-faint mt-4">
              Tip: Say &ldquo;PEEP!&rdquo; or &ldquo;HORN!&rdquo; sharply into your mic.
            </p>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-cream-surface/95 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-5xl mb-2">
              {gameOverReason.includes('pothole') ? '💥 🕳️' : gameOverReason.includes('goat') ? '💥 🐐' : '💥 🐄'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-ink mb-1">
              {gameOverReason}
            </h3>
            <p className="text-xs font-mono uppercase text-ink-muted mb-4">
              Distance Travelled: <strong className="text-ink text-base">{score} meters</strong>
            </p>
            {score >= bestScore && score > 0 && (
              <span className="mb-4 px-3 py-1 bg-ink text-cream text-[11px] font-mono rounded-full">
                🏆 New House Record!
              </span>
            )}
            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 bg-ink text-cream rounded-full text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 active:scale-95 transition-transform"
              >
                Ride Again [Space]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Guide Footer */}
      <div className="mt-4 flex flex-wrap justify-between items-center text-xs font-mono text-ink-muted px-2">
        <div className="flex items-center gap-4">
          <span>Controls: <strong>Voice Horn</strong> (Speak loud)</span>
          <span>•</span>
          <span><strong>[Spacebar]</strong></span>
          <span>•</span>
          <span><strong>Tap/Click</strong></span>
        </div>
        {lastJumpReason && (
          <span className="text-ink-faint">
            Last jump: <span className="text-ink">{lastJumpReason}</span>
          </span>
        )}
      </div>
    </div>
  );
};
