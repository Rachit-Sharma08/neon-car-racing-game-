import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Trophy, 
  Target, 
  Zap, 
  Cpu, 
  Volume2, 
  VolumeX, 
  Compass, 
  User, 
  Shield, 
  ArrowLeft, 
  ArrowRight,
  Info,
  Award,
  Pause,
  Play,
  Flame,
  Gauge,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  X,
  Car
} from 'lucide-react';

/* ---------- AUDIO SYNTH ENGINE ---------- */
class SynthEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy loaded on first user interaction
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopEngine();
    } else {
      this.startEngine();
    }
  }

  playBoost() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      // Turbo high-tech whoosh and pitch spool
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }

  startEngine() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.osc) return;

    try {
      this.osc = this.ctx.createOscillator();
      this.filter = this.ctx.createBiquadFilter();
      this.gainNode = this.ctx.createGain();

      this.osc.type = 'sawtooth';
      this.osc.frequency.setValueAtTime(45, this.ctx.currentTime); // Deep rumble

      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime); // Cozy filtering

      this.gainNode.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.osc.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc.start();
    } catch (e) {
      console.error("Failed to start synth engine", e);
    }
  }

  updateEngine(speed: number) {
    if (this.isMuted || !this.ctx || !this.osc || !this.filter) return;
    // Map speed to oscillator frequency (rpm noise)
    const freq = 45 + speed * 1.6;
    this.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    
    // Map speed to filter frequency (brighter engine pitch)
    const filterFreq = 140 + speed * 4.5;
    this.filter.frequency.setTargetAtTime(filterFreq, this.ctx.currentTime, 0.1);
  }

  stopEngine() {
    if (this.osc) {
      try {
        this.osc.stop();
        this.osc.disconnect();
      } catch (e) {}
      this.osc = null;
    }
    if (this.filter) {
      this.filter.disconnect();
      this.filter = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }

  playShift() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch (e) {}
  }

  playTireScreech() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      // High-frequency friction chirp / rubber skid
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(680 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(420, this.ctx.currentTime + 0.14);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playCrash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      // White noise explosion burst
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(15, this.ctx.currentTime + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.55);

      // Low bass punch
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(100, this.ctx.currentTime);
      subOsc.frequency.linearRampToValueAtTime(10, this.ctx.currentTime + 0.35);

      subGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start();
      subOsc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }

  playCountdownBeep(isGo: boolean = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (!isGo) {
        // Electronic countdown pip (A4 ~ 440 Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
      } else {
        // High-energy launch chirp & turbo punch
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(780, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1250, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.42);
      }
    } catch (e) {}
  }
}

const synth = new SynthEngine();

/* ---------- VEHICLE DEFINITIONS ---------- */
interface Vehicle {
  id: 'titan' | 'blade' | 'glide' | 'bmw';
  name: string;
  mark: string;
  color: number;
  underglow: number;
  velocity: number;
  agility: number;
  resilience: number;
  speedMultiplier: number;
  shiftSpeed: number;
  description: string;
  role: string;
  topSpeedLabel: string;
  handlingLabel: string;
}

const VEHICLES: readonly Vehicle[] = [
  {
    id: 'titan',
    name: 'VX-TITAN',
    mark: 'BALANCED CRUISER',
    role: 'Balanced & Durable',
    topSpeedLabel: 'Fast (190 KM/H)',
    handlingLabel: 'Medium Handling',
    color: 0x0a1e36, // Heavy dark slate blue
    underglow: 0x00f0ff, // Neon Cyan
    velocity: 90,
    agility: 75,
    resilience: 95,
    speedMultiplier: 1.0,
    shiftSpeed: 9,
    description: 'Heavy reinforced chassis with solid stability. Best for beginners learning to weave through traffic.'
  },
  {
    id: 'blade',
    name: 'NEON-BLADE',
    mark: 'HYPER RACER',
    role: 'Extreme Speed',
    topSpeedLabel: 'Super Fast (240 KM/H)',
    handlingLabel: 'Sharp Drift',
    color: 0x3d0728, // Deep crimson magenta
    underglow: 0xff2ec4, // Hot Neon Pink
    velocity: 99,
    agility: 85,
    resilience: 50,
    speedMultiplier: 1.25,
    shiftSpeed: 11,
    description: 'Ultra-lightweight aerodynamic frame. Reaches insane speeds when paired with the Nitro Boost.'
  },
  {
    id: 'glide',
    name: 'CYBER-GLIDE',
    mark: 'AGILE HOVER',
    role: 'Fastest Lane Switching',
    topSpeedLabel: 'Medium (175 KM/H)',
    handlingLabel: 'Instant Steer',
    color: 0x2e2402, // Cyber amber gold
    underglow: 0xffb703, // Bright Neon Amber
    velocity: 82,
    agility: 99,
    resilience: 65,
    speedMultiplier: 0.88,
    shiftSpeed: 14,
    description: 'Hover thruster pads allow virtually instant lane swaps to easily slip through tight traffic gaps.'
  },
  {
    id: 'bmw',
    name: 'BMW E34',
    mark: 'STANCE LEGEND',
    role: 'Pro Street Style',
    topSpeedLabel: 'High (220 KM/H)',
    handlingLabel: 'Responsive Grip',
    color: 0x111115, // Stealth jet black
    underglow: 0x7b2ff7, // Neon Indigo Violet
    velocity: 95,
    agility: 90,
    resilience: 90,
    speedMultiplier: 1.15,
    shiftSpeed: 12,
    description: 'Custom stance classic with low suspension, chrome deep dish rims, and great overall control.'
  }
];

/* ---------- CIRCULAR RADIAL SPEEDOMETER GAUGE COMPONENT ---------- */
function SpeedRadialGauge({ speed, isBoosting }: { speed: number; isBoosting: boolean }) {
  const currentKmh = Math.round(speed * 6.5);
  const maxKmh = 300;
  const speedRatio = Math.min(1, Math.max(0, currentKmh / maxKmh));
  
  // 240 degree sweep from 150deg (down-left) to 390deg (down-right)
  const cx = 80;
  const cy = 80;
  const radius = 53;
  const circumference = 2 * Math.PI * radius; // ~333.01
  const sweepAngle = 240;
  const totalArc = circumference * (sweepAngle / 360); // ~222.01
  const filledArc = speedRatio * totalArc;
  
  // Needle / tip angle
  const needleAngle = 150 + speedRatio * sweepAngle;
  const needleRad = (needleAngle * Math.PI) / 180;
  
  // Major calibration ticks: 0, 60, 120, 180, 240, 300 KM/H
  const ticks = [
    { kmh: 0, label: '0' },
    { kmh: 60, label: '60' },
    { kmh: 120, label: '120' },
    { kmh: 180, label: '180' },
    { kmh: 240, label: '240' },
    { kmh: 300, label: '300' },
  ];
  
  // Minor ticks at intervals between major graduations
  const minorTicks = [30, 90, 150, 210, 270];

  return (
    <div className="relative flex flex-col items-center select-none" id="radial-speed-gauge-container">
      <svg 
        viewBox="0 0 160 160" 
        className="w-28 h-28 sm:w-34 sm:h-34 overflow-visible"
        aria-label={`Current speed: ${currentKmh} KM/H of ${maxKmh} KM/H`}
      >
        <defs>
          <linearGradient id="radialSpeedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'var(--color-secondary)' }} />
            <stop offset="45%" style={{ stopColor: 'var(--color-secondary)' }} />
            <stop offset="70%" style={{ stopColor: 'var(--color-primary)' }} />
            <stop offset="88%" style={{ stopColor: 'var(--color-danger)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-speed)' }} />
          </linearGradient>

          <linearGradient id="boostGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'var(--color-primary)' }} />
            <stop offset="50%" style={{ stopColor: 'var(--color-primary)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-speed)' }} />
          </linearGradient>
        </defs>

        {/* Outer subtle frame ring */}
        <circle 
          cx={cx} 
          cy={cy} 
          r="73" 
          fill="none" 
          className="stroke-edge" 
          strokeWidth="1" 
          strokeDasharray="4 6" 
        />

        {/* Redline Warning Sector Arc (220 to 300 KM/H) */}
        {(() => {
          const redlineStartAngle = 150 + (220 / maxKmh) * sweepAngle;
          const redlineRad = (redlineStartAngle * Math.PI) / 180;
          const redlineEndRad = ((150 + sweepAngle) * Math.PI) / 180;
          const rOuter = 65;
          const x1 = cx + rOuter * Math.cos(redlineRad);
          const y1 = cy + rOuter * Math.sin(redlineRad);
          const x2 = cx + rOuter * Math.cos(redlineEndRad);
          const y2 = cy + rOuter * Math.sin(redlineEndRad);
          return (
            <path
              d={`M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={isBoosting ? 'var(--color-primary)' : 'var(--color-danger)'}
              strokeWidth="2.5"
              strokeDasharray="3 3"
              className={currentKmh > 220 ? 'animate-pulse' : ''}
            />
          );
        })()}

        {/* Major Ticks and Calibration Labels */}
        {ticks.map(t => {
          const angle = 150 + (t.kmh / maxKmh) * sweepAngle;
          const rad = (angle * Math.PI) / 180;
          const isPassed = currentKmh >= t.kmh;
          const x1 = cx + 60 * Math.cos(rad);
          const y1 = cy + 60 * Math.sin(rad);
          const x2 = cx + 66 * Math.cos(rad);
          const y2 = cy + 66 * Math.sin(rad);
          
          // Numerical label position outside ticks
          const xt = cx + 74 * Math.cos(rad);
          const yt = cy + 74 * Math.sin(rad) + 2.5;

          const isRedline = t.kmh >= 240;
          const tickColor = isPassed
            ? (isBoosting ? 'var(--color-primary)' : isRedline ? 'var(--color-danger)' : t.kmh > 150 ? 'var(--color-primary)' : 'var(--color-secondary)')
            : 'var(--color-edge)';

          return (
            <g key={t.kmh}>
              <line 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke={tickColor} 
                strokeWidth={isPassed ? 2 : 1.2} 
                strokeLinecap="round" 
              />
              <text 
                x={xt} 
                y={yt} 
                textAnchor="middle" 
                fontSize="6" 
                fontFamily="var(--font-display), sans-serif" 
                fill={isPassed ? (isRedline ? 'var(--color-danger)' : 'var(--color-secondary)') : 'var(--color-muted)'} 
                fontWeight={isPassed ? 'bold' : 'normal'}
              >
                {t.label}
              </text>
            </g>
          );
        })}

        {/* Minor Intermediate Ticks */}
        {minorTicks.map(m => {
          const angle = 150 + (m / maxKmh) * sweepAngle;
          const rad = (angle * Math.PI) / 180;
          const isPassed = currentKmh >= m;
          const x1 = cx + 61 * Math.cos(rad);
          const y1 = cy + 61 * Math.sin(rad);
          const x2 = cx + 64 * Math.cos(rad);
          const y2 = cy + 64 * Math.sin(rad);
          return (
            <line 
              key={m} 
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke={isPassed ? 'var(--color-secondary)' : 'var(--color-edge)'} 
              strokeWidth="1" 
              strokeLinecap="round" 
            />
          );
        })}

        {/* Background Track Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--color-edge)"
          strokeWidth="7"
          strokeDasharray={`${totalArc} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(150 ${cx} ${cy})`}
        />

        {/* Active Speed Progress Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={isBoosting ? "url(#boostGlowGrad)" : "url(#radialSpeedGrad)"}
          strokeWidth="7"
          strokeDasharray={`${filledArc} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(150 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.08s ease-out' }}
        />

        {/* Head node at the current speed tip of the arc */}
        {filledArc > 1 && (
          <circle
            cx={cx + radius * Math.cos(needleRad)}
            cy={cy + radius * Math.sin(needleRad)}
            r={isBoosting ? "4" : "3.2"}
            className="fill-text"
            style={{ transition: 'cx 0.08s ease-out, cy 0.08s ease-out' }}
          />
        )}

        {/* Analog Needle Indicator */}
        <g 
          style={{ 
            transform: `rotate(${needleAngle}deg)`, 
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'transform 0.09s cubic-bezier(0.18, 0.85, 0.3, 1)' 
          }}
        >
          {/* Needle stem */}
          <line
            x1={cx + 14}
            y1={cy}
            x2={cx + radius - 2}
            y2={cy}
            stroke={isBoosting ? 'var(--color-primary)' : 'var(--color-secondary)'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Counterweight */}
          <line
            x1={cx - 10}
            y1={cy}
            x2={cx - 4}
            y2={cy}
            stroke="var(--color-edge)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Center Digital Cockpit Hub */}
        <circle 
          cx={cx} 
          cy={cy} 
          r="36" 
          className="fill-asphalt" 
          stroke={isBoosting ? 'var(--color-primary)' : 'var(--color-edge)'} 
          strokeWidth="1.5"
        />

        {/* Center Pivot Point */}
        <circle cx={cx} cy={cy} r="4" className="fill-steel" stroke="var(--color-edge)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="1.5" fill={isBoosting ? 'var(--color-primary)' : 'var(--color-secondary)'} />

        {/* Digital Speed Number */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="17"
          fontWeight="900"
          fontFamily="var(--font-display), sans-serif"
          fill={isBoosting || currentKmh > 180 ? 'var(--color-speed)' : 'var(--color-text)'}
        >
          {currentKmh}
        </text>

        {/* KM/H Unit Subtext */}
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fontFamily="var(--font-display), sans-serif"
          fill="var(--color-muted)"
        >
          KM/H
        </text>

        {/* Relative Acceleration / Relative Max Speed Indicator */}
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fontSize="6"
          fontWeight="600"
          fontFamily="var(--font-body), sans-serif"
          fill={isBoosting ? 'var(--color-primary)' : 'var(--color-muted)'}
        >
          {isBoosting ? 'NITRO' : `${Math.round(speedRatio * 100)}% MAX`}
        </text>
      </svg>

      {/* Visual bottom acceleration status */}
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-ui border ${
          isBoosting 
            ? 'bg-primary border-primary text-asphalt' 
            : currentKmh > 180 
              ? 'bg-danger/20 border-danger text-danger' 
              : currentKmh > 90 
                ? 'bg-secondary/20 border-secondary text-secondary' 
                : 'bg-steel border-edge text-muted'
        }`}>
          {isBoosting ? 'Overdrive' : currentKmh > 180 ? 'High speed' : currentKmh > 90 ? 'Cruising' : 'Accelerating'}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  /* ---------- REACT STATE ---------- */
  const [gameState, setGameState] = useState<'title' | 'countdown' | 'playing' | 'gameover'>('title');
  const [countdownVal, setCountdownVal] = useState<'3' | '2' | '1' | 'GO!' | ''>('3');
  const [countdownSubtext, setCountdownSubtext] = useState<string>('Get ready');
  const countdownTimersRef = useRef<NodeJS.Timeout[]>([]);
  const startRaceCountdownRef = useRef<() => void>(() => {});

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('neon_rush_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [speed, setSpeed] = useState<number>(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<'titan' | 'blade' | 'glide' | 'bmw'>('titan');
  const [paused, setPaused] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(() => {
    try {
      return localStorage.getItem('neon_rush_username') || 'PLAYER 1';
    } catch {
      return 'PLAYER 1';
    }
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(username);
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [ping, setPing] = useState<number>(12);

  // Nitro Boost state
  const [boostFuel, setBoostFuel] = useState<number>(100);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [garageOpen, setGarageOpen] = useState<boolean>(false);
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  /* ---------- REFS ---------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<any>(null);

  // Active vehicle state ref for the fast-paced Three.js animation loop
  const activeVehicleRef = useRef<Vehicle>(VEHICLES[0]);
  const pausedRef = useRef<boolean>(false);
  // True when the app auto-paused the game because the phone is in portrait.
  const autoPausedRef = useRef<boolean>(false);

  // Clean countdown timers on unmount
  const clearCountdownTimers = () => {
    countdownTimersRef.current.forEach(t => clearTimeout(t));
    countdownTimersRef.current = [];
  };

  useEffect(() => {
    return () => clearCountdownTimers();
  }, []);

  // Sync paused state to ref and adjust engine sound pitch
  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      synth.updateEngine(0);
    } else if (gameState === 'playing') {
      synth.updateEngine(speed);
    }
  }, [paused, gameState, speed]);

  // Update high score in local storage
  const saveHighScore = (newScore: number) => {
    setHighScore(newScore);
    try {
      localStorage.setItem('neon_rush_highscore', newScore.toString());
    } catch (e) {}
  };

  // Ping update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 8 ? 8 : next > 16 ? 16 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sync mute state to Audio Synth Engine
  useEffect(() => {
    synth.setMute(muted);
  }, [muted]);

  // Track portrait / landscape. The game is meant to be played in landscape.
  useEffect(() => {
    const query = window.matchMedia('(orientation: portrait)');
    const update = () => setIsPortrait(query.matches);
    update();
    query.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      query.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // While in portrait during a race, auto-pause and show the rotate hint.
  const needsRotate = isPortrait && (gameState === 'playing' || gameState === 'countdown');

  useEffect(() => {
    if (needsRotate) {
      if (!paused) {
        setPaused(true);
        autoPausedRef.current = true;
      }
    } else if (autoPausedRef.current) {
      autoPausedRef.current = false;
      setPaused(false);
    }
  }, [needsRotate, paused]);

  // Sync active vehicle ref when user clicks in React UI
  const handleSelectVehicle = (id: 'titan' | 'blade' | 'glide' | 'bmw') => {
    setSelectedVehicleId(id);
    const vehicle = VEHICLES.find(v => v.id === id);
    if (vehicle) {
      activeVehicleRef.current = vehicle;
      // Trigger update to existing car elements in Three.js scene
      if (gameLoopRef.current && typeof gameLoopRef.current.updateCarMaterials === 'function') {
        gameLoopRef.current.updateCarMaterials(vehicle);
      }
    }
  };

  // Submit username change
  const handleSaveUsername = () => {
    let clean = nameInput.trim().toUpperCase().substring(0, 14);
    if (!clean) clean = 'RACER_1';
    setUsername(clean);
    setIsEditingName(false);
    try {
      localStorage.setItem('neon_rush_username', clean);
    } catch {}
  };

  /* ---------- GAME ACTION TRIGGER HANDLERS ---------- */
  const startRaceCountdown = () => {
    clearCountdownTimers();
    synth.init();
    synth.startEngine();
    setPaused(false);
    setDodgeCount(0);
    setGameState('countdown');
    setCountdownVal('3');
    setCountdownSubtext('Get ready');

    // Notify Three.js scene to align car on grid
    if (gameLoopRef.current && typeof gameLoopRef.current.prepareCountdown === 'function') {
      gameLoopRef.current.prepareCountdown();
    }

    // Step 3 (0ms)
    synth.playCountdownBeep(false);
    synth.updateEngine(35);

    // Step 2 (750ms)
    const t1 = setTimeout(() => {
      setCountdownVal('2');
      setCountdownSubtext('Set');
      synth.playCountdownBeep(false);
      synth.updateEngine(60);
    }, 750);

    // Step 1 (1500ms)
    const t2 = setTimeout(() => {
      setCountdownVal('1');
      setCountdownSubtext('Rev up');
      synth.playCountdownBeep(false);
      synth.updateEngine(90);
    }, 1500);

    // Step GO! (2250ms)
    const t3 = setTimeout(() => {
      setCountdownVal('GO!');
      setCountdownSubtext('Launch!');
      synth.playCountdownBeep(true);
      synth.playBoost();
      if (gameLoopRef.current && typeof gameLoopRef.current.launchRace === 'function') {
        gameLoopRef.current.launchRace();
      }
    }, 2250);

    // Enter full playing state (2950ms)
    const t4 = setTimeout(() => {
      setGameState('playing');
    }, 2950);

    countdownTimersRef.current = [t1, t2, t3, t4];
  };

  startRaceCountdownRef.current = startRaceCountdown;

  const startGame = () => {
    // Try to go fullscreen and lock landscape. Many browsers refuse one or both,
    // so every failure is ignored silently.
    try {
      const root = document.documentElement;
      if (typeof root.requestFullscreen === 'function') {
        root.requestFullscreen().catch(() => {});
      }
      const orientation = screen.orientation as (ScreenOrientation & { lock?: (o: string) => Promise<void> }) | undefined;
      if (orientation && typeof orientation.lock === 'function') {
        orientation.lock('landscape').catch(() => {});
      }
    } catch (e) {
      // Ignore: fullscreen/orientation lock is optional.
    }
    startRaceCountdown();
  };

  const restartGame = () => {
    setPaused(false);
    startRaceCountdown();
  };

  // Setup Three.js Grid Engine
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    /* ---------- CONFIG ---------- */
    const ROAD_WIDTH = 9;
    const LANE_WIDTH = ROAD_WIDTH / 3;
    const LANE_X = [-LANE_WIDTH, 0, LANE_WIDTH];
    const SEG_LEN = 30;
    const NUM_SEGMENTS = 7;
    const CAR_Z = 0.4;
    const SPAWN_FAR_Z = CAR_Z - (NUM_SEGMENTS - 1) * SEG_LEN - 10;
    const BASE_SPEED = 18;
    const MAX_SPEED = 50;
    const SPEED_RAMP = 0.45;
    const IDLE_SPEED = 7;

    const COLORS = {
      bg: 0x8dc7e8,
      road: 0x454a4d,
      ground: 0x789255,
      laneWhite: 0xf4f2e8,
      laneYellow: 0xf3c64e,
      roadDetail: 0x6d7377
    };

    /* ---------- INITIAL THREE ENVIRONMENT ---------- */
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(COLORS.bg, 16, 95);

    const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 500);
    camera.position.set(0, 1.85, CAR_Z + 4.8);

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: false 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(COLORS.bg, 1);

    // Dynamic resize handler using ResizeObserver (Constraint Checklist Item)
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(containerRef.current);

    /* ---------- LIGHTS ---------- */
    const ambientLight = new THREE.AmbientLight(0xf1e5c9, 1.15);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x8dc7e8, 0x6d7650, 0.9);
    scene.add(hemisphereLight);

    /* ---------- RETRO STARFIELD ---------- */
    const starsCount = 500;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 110 + Math.random() * 210;
      starPositions[i * 3] = Math.cos(angle) * radius;
      starPositions[i * 3 + 1] = 8 + Math.random() * 95;
      starPositions[i * 3 + 2] = -Math.random() * 380 + 30;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xf4f2e8,
      size: 0.85, 
      transparent: true, 
      opacity: 0.75 
    });
    starMaterial.fog = false;
    const starfield = new THREE.Points(starsGeometry, starMaterial);
    scene.add(starfield);

    /* ---------- HORIZON SUN ---------- */
    const createSunTexture = () => {
      const canvasEl = document.createElement('canvas'); 
      canvasEl.width = 256; 
      canvasEl.height = 256;
      const ctx = canvasEl.getContext('2d')!;
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255,246,194,0.95)');
      grad.addColorStop(0.3, 'rgba(255,210,116,0.55)');
      grad.addColorStop(0.6, 'rgba(141,199,232,0.22)');
      grad.addColorStop(1, 'rgba(141,199,232,0)');
      ctx.fillStyle = grad; 
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(canvasEl);
    };

    const sunGeo = new THREE.CircleGeometry(46, 32);
    const sunMat = new THREE.MeshBasicMaterial({ 
      map: createSunTexture(), 
      transparent: true, 
      depthWrite: false, 
      blending: THREE.AdditiveBlending 
    });
    const horizonSun = new THREE.Mesh(sunGeo, sunMat);
    horizonSun.position.set(0, 19, -250);
    scene.add(horizonSun);

    /* ---------- ZONE SYSTEM CONFIGURATION ---------- */
    const ZONE_LENGTH = 900; // Switch zones every 900 meters
    
    const ZONE_LIGHTING = [
      {
        // Zone 0: Coastal daylight
        fogColor: new THREE.Color(0xb9dced),
        ambientColor: new THREE.Color(0xfff1cf),
        ambientIntensity: 1.1,
        hemisphereSky: new THREE.Color(0x8dc7e8),
        hemisphereGround: new THREE.Color(0x7c7857),
        hemisphereIntensity: 0.8,
        sunColor: new THREE.Color(0xffd36d),
        sunOpacity: 0.95,
        starOpacity: 0.0,
        roadColor: new THREE.Color(0x4b5053),
        groundColor: new THREE.Color(0xd8be89)
      },
      {
        // Zone 1: Countryside overcast
        fogColor: new THREE.Color(0xc4d5c3),
        ambientColor: new THREE.Color(0xe4ead7),
        ambientIntensity: 0.85,
        hemisphereSky: new THREE.Color(0xa9c6df),
        hemisphereGround: new THREE.Color(0x657449),
        hemisphereIntensity: 0.5,
        sunColor: new THREE.Color(0xf7df9d),
        sunOpacity: 0.48,
        starOpacity: 0.0,
        roadColor: new THREE.Color(0x505456),
        groundColor: new THREE.Color(0x6f8b47)
      },
      {
        // Zone 2: City daytime
        fogColor: new THREE.Color(0xc8d8e1),
        ambientColor: new THREE.Color(0xe6e1d4),
        ambientIntensity: 1.1,
        hemisphereSky: new THREE.Color(0x9ec7df),
        hemisphereGround: new THREE.Color(0x707476),
        hemisphereIntensity: 0.7,
        sunColor: new THREE.Color(0xf4d58a),
        sunOpacity: 0.35,
        starOpacity: 0.0,
        roadColor: new THREE.Color(0x4a4e51),
        groundColor: new THREE.Color(0x7c827d)
      }
    ];

    const getZoneAtDistance = (dist: number) => {
      const totalZones = 3;
      const safeDist = Math.max(0, dist);
      const cycle = Math.floor(safeDist / ZONE_LENGTH);
      const currentZoneIndex = ((cycle % totalZones) + totalZones) % totalZones;
      const nextZoneIndex = (currentZoneIndex + 1) % totalZones;
      
      const progressInZone = safeDist % ZONE_LENGTH;
      const transitionStart = ZONE_LENGTH - 150; // Blend last 150 meters
      let transitionFactor = 0;
      if (progressInZone >= transitionStart) {
        transitionFactor = (progressInZone - transitionStart) / 150;
      }
      
      return {
        current: currentZoneIndex,
        next: nextZoneIndex,
        factor: transitionFactor
      };
    };

    const lerpColor = (c1: THREE.Color, c2: THREE.Color, t: number) => {
      return c1.clone().lerp(c2, t);
    };

    const lerpNum = (a: number, b: number, t: number) => {
      return a + (b - a) * t;
    };

    const populateSceneryForSegment = (segmentGroup: THREE.Group, segmentDistance: number) => {
      // Find the scenery child group
      let sceneryGroup = segmentGroup.getObjectByName("scenery") as THREE.Group;
      if (!sceneryGroup) {
        sceneryGroup = new THREE.Group();
        sceneryGroup.name = "scenery";
        segmentGroup.add(sceneryGroup);
      } else {
        // Clear old children safely to avoid memory leaks
        while (sceneryGroup.children.length > 0) {
          const obj = sceneryGroup.children[0];
          sceneryGroup.remove(obj);
          // Recursively dispose geometry and material if they exist
          obj.traverse((child: any) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
        }
      }

      // Determine active zone for this segment
      const zoneInfo = getZoneAtDistance(segmentDistance);
      const zoneIndex = zoneInfo.current;

      // Update segment ground and road colors based on the zone
      const targetLit = ZONE_LIGHTING[zoneIndex];
      const { roadMesh, groundMesh } = segmentGroup.userData;
      if (roadMesh) {
        (roadMesh.material as THREE.MeshStandardMaterial).color.copy(targetLit.roadColor);
      }
      if (groundMesh) {
        (groundMesh.material as THREE.MeshStandardMaterial).color.copy(targetLit.groundColor);
      }

      // Build procedural scenery based on zoneIndex
      if (zoneIndex === 0) {
        // --- 1. COASTAL HIGHWAY ---

        // Ocean plane on left side
        const oceanGeo = new THREE.PlaneGeometry(80, SEG_LEN);
        const oceanMat = new THREE.MeshStandardMaterial({
          color: 0x0077be,
          roughness: 0.15,
          metalness: 0.8,
          transparent: true,
          opacity: 0.85
        });
        const ocean = new THREE.Mesh(oceanGeo, oceanMat);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.set(-52, -0.01, 0); // Far left
        sceneryGroup.add(ocean);

        // Small island rocks in the ocean
        const numIslands = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numIslands; i++) {
          const rGeo = new THREE.DodecahedronGeometry(2 + Math.random() * 3, 1);
          const rMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c, roughness: 0.9 });
          const island = new THREE.Mesh(rGeo, rMat);
          island.position.set(-18 - Math.random() * 10, -0.5, -SEG_LEN / 2 + Math.random() * SEG_LEN);
          sceneryGroup.add(island);
        }

        // Cliffs on right side
        const numCliffs = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numCliffs; i++) {
          const cGeo = new THREE.BoxGeometry(4 + Math.random() * 6, 8 + Math.random() * 12, 6 + Math.random() * 10);
          const cMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.95 });
          const cliff = new THREE.Mesh(cGeo, cMat);
          cliff.position.set(16 + Math.random() * 6, 3 + Math.random() * 2, -SEG_LEN / 2 + Math.random() * SEG_LEN);
          cliff.rotation.set(Math.random() * 0.2, Math.random() * 3.14, Math.random() * 0.2);
          sceneryGroup.add(cliff);
        }

        // Palm trees on right side
        const numTrees = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numTrees; i++) {
          const treeGroup = new THREE.Group();
          const height = 5 + Math.random() * 3;
          const trunkGeo = new THREE.CylinderGeometry(0.12, 0.22, height, 6);
          const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
          const trunk = new THREE.Mesh(trunkGeo, trunkMat);
          trunk.position.y = height / 2;
          trunk.rotation.z = -0.1 - Math.random() * 0.15;
          treeGroup.add(trunk);

          const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.7 });
          const numLeaves = 5;
          for (let l = 0; l < numLeaves; l++) {
            const leafGeo = new THREE.BoxGeometry(1.8, 0.06, 0.35);
            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.position.set(Math.sin(-trunk.rotation.z) * height, height - 0.2, 0);
            leaf.rotation.y = (l * Math.PI * 2) / numLeaves;
            leaf.rotation.z = -0.2 - Math.random() * 0.15;
            treeGroup.add(leaf);
          }

          treeGroup.position.set(11 + Math.random() * 3, 0, -SEG_LEN / 2 + Math.random() * SEG_LEN);
          sceneryGroup.add(treeGroup);
        }
      } else if (zoneIndex === 1) {
        // --- 2. COUNTRYSIDE ---

        // Parallel rail track on left side
        const railMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
        const leftRailGeo = new THREE.BoxGeometry(0.08, 0.06, SEG_LEN);
        const r1 = new THREE.Mesh(leftRailGeo, railMat);
        r1.position.set(-15.8, 0.05, 0);
        const r2 = new THREE.Mesh(leftRailGeo, railMat);
        r2.position.set(-14.2, 0.05, 0);
        sceneryGroup.add(r1);
        sceneryGroup.add(r2);

        const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.95 });
        const numSleepers = 15;
        for (let s = 0; s < numSleepers; s++) {
          const sleeperGeo = new THREE.BoxGeometry(2.0, 0.04, 0.25);
          const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
          sleeper.position.set(-15, 0.02, -SEG_LEN / 2 + (SEG_LEN / numSleepers) * s);
          sceneryGroup.add(sleeper);
        }

        // Grassy fields
        const fieldMat = new THREE.MeshStandardMaterial({ color: 0x3b5323, roughness: 0.99 });
        const leftField = new THREE.Mesh(new THREE.PlaneGeometry(30, SEG_LEN), fieldMat);
        leftField.rotation.x = -Math.PI / 2;
        leftField.position.set(-32, -0.01, 0);
        sceneryGroup.add(leftField);

        const rightField = new THREE.Mesh(new THREE.PlaneGeometry(50, SEG_LEN), fieldMat);
        rightField.rotation.x = -Math.PI / 2;
        rightField.position.set(35, -0.01, 0);
        sceneryGroup.add(rightField);

        // Wooden fences on both sides of the road
        const fenceMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.98 });
        [-5.4, 5.4].forEach(fx => {
          const numPosts = 3;
          for (let p = 0; p < numPosts; p++) {
            const postZ = -SEG_LEN / 2 + (SEG_LEN / (numPosts - 1)) * p;
            const postGeo = new THREE.BoxGeometry(0.12, 1.1, 0.12);
            const post = new THREE.Mesh(postGeo, fenceMat);
            post.position.set(fx, 0.5, postZ);
            sceneryGroup.add(post);

            if (p < numPosts - 1) {
              const railLength = SEG_LEN / (numPosts - 1);
              const rail1Geo = new THREE.BoxGeometry(0.06, 0.1, railLength);
              const fenceR1 = new THREE.Mesh(rail1Geo, fenceMat);
              fenceR1.position.set(fx, 0.8, postZ + railLength / 2);
              const fenceR2 = new THREE.Mesh(rail1Geo, fenceMat);
              fenceR2.position.set(fx, 0.4, postZ + railLength / 2);
              sceneryGroup.add(fenceR1);
              sceneryGroup.add(fenceR2);
            }
          }
        });

        // Occasional trees (pines) on both sides of the road in the fields
        const numPines = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numPines; i++) {
          const treeGroup = new THREE.Group();
          const trunkGeo = new THREE.CylinderGeometry(0.1, 0.18, 1.5, 6);
          const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.95 });
          const trunk = new THREE.Mesh(trunkGeo, trunkMat);
          trunk.position.y = 0.75;
          treeGroup.add(trunk);

          const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1b4d3e, roughness: 0.9 });
          const levels = 3;
          for (let l = 0; l < levels; l++) {
            const levelGeo = new THREE.ConeGeometry(1.2 - l * 0.3, 1.8, 8);
            const level = new THREE.Mesh(levelGeo, foliageMat);
            level.position.y = 1.6 + l * 1.0;
            treeGroup.add(level);
          }
          // Random side
          const isLeft = Math.random() > 0.5;
          const treeX = isLeft ? -18 - Math.random() * 6 : 8 + Math.random() * 10;
          treeGroup.position.set(treeX, 0, -SEG_LEN / 2 + Math.random() * SEG_LEN);
          sceneryGroup.add(treeGroup);
        }
      } else if (zoneIndex === 2) {
        // --- 3. CITY STREET ---

        // Buildings on both sides
        const numBuildings = 2 + Math.floor(Math.random() * 2);
        const buildingMat = new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.6, metalness: 0.5 });
        const windowMat = new THREE.MeshBasicMaterial({ color: 0xffdf6d });

        // Left buildings
        for (let i = 0; i < numBuildings; i++) {
          const bHeight = 15 + Math.random() * 20;
          const bWidth = 6 + Math.random() * 4;
          const bDepth = 6 + Math.random() * 6;
          const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
          const building = new THREE.Mesh(bGeo, buildingMat);
          
          const bX = -12 - Math.random() * 5;
          const bZ = -SEG_LEN / 2 + (SEG_LEN / numBuildings) * i;
          building.position.set(bX, bHeight / 2, bZ);
          sceneryGroup.add(building);

          const numWindowRows = Math.floor(bHeight / 4);
          const numWindowCols = Math.floor(bDepth / 2);
          for (let r = 0; r < numWindowRows; r++) {
            for (let c = 0; c < numWindowCols; c++) {
              if (Math.random() > 0.4) {
                const wPlaneGeo = new THREE.PlaneGeometry(0.35, 0.6);
                const win = new THREE.Mesh(wPlaneGeo, windowMat);
                win.position.set(bX + bWidth / 2 + 0.02, 2 + r * 3.5, bZ - bDepth/2 + 1 + c * 2);
                win.rotation.y = Math.PI / 2;
                sceneryGroup.add(win);
              }
            }
          }
        }

        // Right buildings
        for (let i = 0; i < numBuildings; i++) {
          const bHeight = 15 + Math.random() * 20;
          const bWidth = 6 + Math.random() * 4;
          const bDepth = 6 + Math.random() * 6;
          const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
          const building = new THREE.Mesh(bGeo, buildingMat);
          
          const bX = 12 + Math.random() * 5;
          const bZ = -SEG_LEN / 2 + (SEG_LEN / numBuildings) * i + SEG_LEN / (2 * numBuildings);
          building.position.set(bX, bHeight / 2, bZ);
          sceneryGroup.add(building);

          const numWindowRows = Math.floor(bHeight / 4);
          const numWindowCols = Math.floor(bDepth / 2);
          for (let r = 0; r < numWindowRows; r++) {
            for (let c = 0; c < numWindowCols; c++) {
              if (Math.random() > 0.4) {
                const wPlaneGeo = new THREE.PlaneGeometry(0.35, 0.6);
                const win = new THREE.Mesh(wPlaneGeo, windowMat);
                win.position.set(bX - bWidth / 2 - 0.02, 2 + r * 3.5, bZ - bDepth/2 + 1 + c * 2);
                win.rotation.y = -Math.PI / 2;
                sceneryGroup.add(win);
              }
            }
          }
        }

        // Crosswalk
        if (Math.random() > 0.5) {
          const numStripes = 6;
          const stripeWidth = 0.4;
          const stripeLength = 4.5;
          const stripeMat = new THREE.MeshBasicMaterial({ color: 0xdddddd });
          const crosswalkZ = -SEG_LEN / 2 + Math.random() * 6 + 12;

          for (let s = 0; s < numStripes; s++) {
            const stripeGeo = new THREE.BoxGeometry(stripeLength, 0.015, stripeWidth);
            const stripe = new THREE.Mesh(stripeGeo, stripeMat);
            stripe.position.set(0, 0.015, crosswalkZ);
            stripe.position.x = -ROAD_WIDTH / 2 + (ROAD_WIDTH / (numStripes - 1)) * s;
            sceneryGroup.add(stripe);
          }
        }

        // Traffic cones
        const coneCount = 1 + Math.floor(Math.random() * 2);
        const coneColorMat = new THREE.MeshStandardMaterial({ color: 0xff4500, roughness: 0.5 });
        const coneWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let c = 0; c < coneCount; c++) {
          const coneGroup = new THREE.Group();
          const baseGeo = new THREE.BoxGeometry(0.25, 0.03, 0.25);
          const base = new THREE.Mesh(baseGeo, coneColorMat);
          coneGroup.add(base);

          const tipGeo = new THREE.CylinderGeometry(0.01, 0.08, 0.42, 8);
          const tip = new THREE.Mesh(tipGeo, coneColorMat);
          tip.position.y = 0.21;
          coneGroup.add(tip);

          const stripeGeo = new THREE.CylinderGeometry(0.035, 0.055, 0.12, 8);
          const stripe = new THREE.Mesh(stripeGeo, coneWhiteMat);
          stripe.position.y = 0.22;
          coneGroup.add(stripe);

          const laneOption = Math.floor(Math.random() * 4);
          let coneX = 0;
          if (laneOption === 0) coneX = -ROAD_WIDTH / 2 + 0.3;
          else if (laneOption === 1) coneX = -LANE_WIDTH / 2;
          else if (laneOption === 2) coneX = LANE_WIDTH / 2;
          else coneX = ROAD_WIDTH / 2 - 0.3;

          coneGroup.position.set(coneX, 0.02, -SEG_LEN / 2 + Math.random() * SEG_LEN);
          sceneryGroup.add(coneGroup);
        }

        // Streetlights
        [-5.2, 5.2].forEach((sx) => {
          const lightGroup = new THREE.Group();
          const poleMat = new THREE.MeshStandardMaterial({ color: 0x33333b, roughness: 0.6 });
          const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 4.2, 8);
          const pole = new THREE.Mesh(poleGeo, poleMat);
          pole.position.y = 2.1;
          lightGroup.add(pole);

          const armGeo = new THREE.BoxGeometry(0.9, 0.06, 0.06);
          const arm = new THREE.Mesh(armGeo, poleMat);
          const armDir = sx > 0 ? -1 : 1;
          arm.position.set(armDir * 0.4, 4.2, 0);
          lightGroup.add(arm);

          const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8);
          const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffdf6d });
          const bulb = new THREE.Mesh(bulbGeo, bulbMat);
          bulb.position.set(armDir * 0.8, 4.12, 0);
          lightGroup.add(bulb);

          const lightConeGeo = new THREE.ConeGeometry(1.8, 4.0, 16, 1, true);
          const lightConeMat = new THREE.MeshBasicMaterial({
            color: 0xffdf6d,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
          });
          const lightCone = new THREE.Mesh(lightConeGeo, lightConeMat);
          lightCone.position.set(armDir * 0.8, 2.0, 0);
          lightGroup.add(lightCone);

          lightGroup.position.set(sx, 0, -SEG_LEN / 2 + Math.random() * 5 + 12);
          sceneryGroup.add(lightGroup);
        });
      }
    };

    /* ---------- ROAD SEGMENT GENERATOR ---------- */
    const buildSegment = () => {
      const segmentGroup = new THREE.Group();

      // Asphalt Road
      const roadGeo = new THREE.PlaneGeometry(ROAD_WIDTH, SEG_LEN);
      const roadMat = new THREE.MeshStandardMaterial({ 
        color: COLORS.road, 
        roughness: 0.96, 
        metalness: 0.04 
      });
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.rotation.x = -Math.PI / 2;
      segmentGroup.add(roadMesh);

      // Surrounding Ground Bed
      const groundGeo = new THREE.PlaneGeometry(75, SEG_LEN);
      const groundMat = new THREE.MeshStandardMaterial({ 
        color: COLORS.ground, 
        roughness: 1.0 
      });
      const groundMesh = new THREE.Mesh(groundGeo, groundMat);
      groundMesh.rotation.x = -Math.PI / 2;
      groundMesh.position.y = -0.03;
      segmentGroup.add(groundMesh);

      // Save references in userData
      segmentGroup.userData = {
        roadMesh: roadMesh,
        groundMesh: groundMesh
      };

      // Yellow road-edge lines
      [-ROAD_WIDTH / 2, ROAD_WIDTH / 2].forEach(x => {
        const stripGeo = new THREE.BoxGeometry(0.12, 0.08, SEG_LEN);
        const stripMat = new THREE.MeshBasicMaterial({ color: COLORS.laneYellow });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.position.set(x, 0.04, 0);
        segmentGroup.add(strip);
      });

      // Lane division dashes
      [-LANE_WIDTH / 2, LANE_WIDTH / 2].forEach(x => {
        const count = 5;
        const dashLen = 2.4;
        const gap = SEG_LEN / count;
        for (let i = 0; i < count; i++) {
          const dashGeo = new THREE.BoxGeometry(0.08, 0.04, dashLen);
          const dashMat = new THREE.MeshBasicMaterial({ color: COLORS.laneWhite });
          const dash = new THREE.Mesh(dashGeo, dashMat);
          dash.position.set(x, 0.02, -SEG_LEN / 2 + gap * i + gap / 2);
          segmentGroup.add(dash);
        }
      });

      // Low-contrast road expansion joints
      for (let i = 0; i < 3; i++) {
        const barGeo = new THREE.BoxGeometry(ROAD_WIDTH, 0.012, 0.15);
        const barMat = new THREE.MeshBasicMaterial({ 
          color: COLORS.roadDetail, 
          transparent: true, 
          opacity: 0.20 
        });
        const crossbar = new THREE.Mesh(barGeo, barMat);
        crossbar.position.set(0, 0.01, -SEG_LEN / 2 + (SEG_LEN / 3) * i + 3);
        segmentGroup.add(crossbar);
      }

      return segmentGroup;
    };

    // Instantiate circular road buffer segments
    const segmentStartZ = CAR_Z + 12;
    const roadSegments: THREE.Group[] = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const seg = buildSegment();
      seg.position.z = segmentStartZ - i * SEG_LEN;
      
      const segmentDistance = CAR_Z - seg.position.z;
      populateSceneryForSegment(seg, segmentDistance);

      scene.add(seg);
      roadSegments.push(seg);
    }

    /* ---------- DYNAMIC TRAIN SETUP ---------- */
    let trainActive = false;
    let trainZ = 0;
    let trainSpeed = 0;
    let trainCooldown = 2.0;

    const buildTrain = () => {
      const tGroup = new THREE.Group();
      const carLength = 12;
      const carGap = 0.8;
      const colors = [0xff0055, 0x00f0ff, 0xffb703, 0x7b2ff7];

      // Locomotive at the front (facing player)
      const locoGeo = new THREE.BoxGeometry(1.6, 1.4, carLength);
      const locoMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
      const loco = new THREE.Mesh(locoGeo, locoMat);
      loco.position.set(0, 0.75, 0);
      tGroup.add(loco);

      // Windshield
      const cabinGeo = new THREE.BoxGeometry(1.5, 0.5, 3);
      const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.1 });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 1.4, -2);
      tGroup.add(cabin);

      // Headlight bulb
      const headlightGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfffca3 });
      const headlight = new THREE.Mesh(headlightGeo, headlightMat);
      headlight.position.set(0, 0.75, carLength / 2 + 0.01);
      tGroup.add(headlight);

      // Headlight light cone
      const coneGeo = new THREE.ConeGeometry(2.5, 12, 16);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xfffca3,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.set(0, 0.75, carLength / 2 + 6);
      tGroup.add(cone);

      // 3 Cars behind the locomotive
      for (let c = 0; c < 3; c++) {
        const color = colors[c % colors.length];
        const carMat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.5, roughness: 0.3 });
        const carGeo = new THREE.BoxGeometry(1.5, 1.2, carLength);
        const car = new THREE.Mesh(carGeo, carMat);
        
        const offsetZ = -(c + 1) * (carLength + carGap);
        car.position.set(0, 0.65, offsetZ);
        tGroup.add(car);

        // Windows for cars
        const winGeo = new THREE.BoxGeometry(1.54, 0.2, 0.8);
        const winMat = new THREE.MeshBasicMaterial({ color: 0xfffeed });
        for (let w = 0; w < 4; w++) {
          const winL = new THREE.Mesh(winGeo, winMat);
          winL.position.set(0, 0.75, offsetZ - carLength/2 + 1.2 * w + 0.6);
          tGroup.add(winL);
        }
      }

      tGroup.position.set(-15, 0.1, -1000); // starts far away
      tGroup.visible = false;
      scene.add(tGroup);
      return tGroup;
    };

    const trainGroup = buildTrain();

    /* ---------- CAR MESH BUILDER ---------- */
    let carGroup = new THREE.Group();
    let carBodyMesh: THREE.Mesh;
    let carCabinMesh: THREE.Mesh;
    let underglowMesh: THREE.Mesh;
    let underglowPointLight: THREE.PointLight;
    let nitroThrustLight: THREE.PointLight;
    let wheelMeshes: THREE.Mesh[] = [];
    let lateralTrimMeshes: THREE.Mesh[] = [];
    let nitroFlameMeshes: THREE.Mesh[] = [];

    const buildActiveCar = () => {
      // Clear previous elements if existing
      while(carGroup.children.length > 0) {
        carGroup.remove(carGroup.children[0]);
      }
      wheelMeshes = [];
      lateralTrimMeshes = [];
      nitroFlameMeshes = [];

      const activeV = activeVehicleRef.current;

      if (activeV.id === 'bmw') {
        // Procedural BMW E34 Stance Style
        const color = activeV.color; // 0x111115
        const bodyMat = new THREE.MeshStandardMaterial({ 
          color: color, 
          metalness: 0.8, 
          roughness: 0.15 
        });

        // 1. Lower chassis / bumper
        const chassisGeo = new THREE.BoxGeometry(1.6, 0.25, 3.25);
        const chassis = new THREE.Mesh(chassisGeo, bodyMat);
        chassis.position.y = 0.2;
        carGroup.add(chassis);

        // 2. Main boxy cabin body
        const cabinBodyGeo = new THREE.BoxGeometry(1.54, 0.45, 3.1);
        const cabinBody = new THREE.Mesh(cabinBodyGeo, bodyMat);
        cabinBody.position.y = 0.55;
        carGroup.add(cabinBody);

        // 3. Greenhouse (windows/roof) - Classic boxy E34 greenhouse
        const roofGeo = new THREE.BoxGeometry(1.3, 0.42, 1.6);
        const roofMat = new THREE.MeshStandardMaterial({
          color: 0x0c0c0e,
          roughness: 0.1,
          metalness: 0.9,
          transparent: true,
          opacity: 0.65
        });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(0, 0.95, -0.2);
        carGroup.add(roof);

        // Dark window pillars
        const pillarsGeo = new THREE.BoxGeometry(1.32, 0.42, 0.08);
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x111115 });
        const frontPillar = new THREE.Mesh(pillarsGeo, pillarMat);
        frontPillar.position.set(0, 0.95, 0.6);
        const rearPillar = new THREE.Mesh(pillarsGeo, pillarMat);
        rearPillar.position.set(0, 0.95, -1.0);
        carGroup.add(frontPillar);
        carGroup.add(rearPillar);

        // 4. Quad round headlights (Classic E34 face!)
        const lightGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff0aa });
        const lightsOffsets = [
          [-0.55, 0.48, 1.63],
          [-0.35, 0.48, 1.63],
          [0.35, 0.48, 1.63],
          [0.55, 0.48, 1.63]
        ];
        lightsOffsets.forEach(([lx, ly, lz]) => {
          const l = new THREE.Mesh(lightGeo, lightMat);
          l.position.set(lx, ly, lz);
          carGroup.add(l);
        });

        // Kidneys grille
        const kidneyGeo = new THREE.BoxGeometry(0.2, 0.12, 0.04);
        const kidneyMat = new THREE.MeshStandardMaterial({ color: 0x33333b, roughness: 0.5 });
        const kidneyLeft = new THREE.Mesh(kidneyGeo, kidneyMat);
        kidneyLeft.position.set(-0.11, 0.48, 1.63);
        const kidneyRight = new THREE.Mesh(kidneyGeo, kidneyMat);
        kidneyRight.position.set(0.11, 0.48, 1.63);
        carGroup.add(kidneyLeft);
        carGroup.add(kidneyRight);

        // 5. Red tail lights
        const tailLightGeo = new THREE.BoxGeometry(0.35, 0.10, 0.04);
        const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
        const tailLeft = new THREE.Mesh(tailLightGeo, tailLightMat);
        tailLeft.position.set(-0.52, 0.58, -1.56);
        const tailRight = new THREE.Mesh(tailLightGeo, tailLightMat);
        tailRight.position.set(0.52, 0.58, -1.56);
        carGroup.add(tailLeft);
        carGroup.add(tailRight);

        // 6. Dual chrome exhaust tips on rear left
        const exhaustGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
        const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.1 });
        const exh1 = new THREE.Mesh(exhaustGeo, exhaustMat);
        exh1.rotation.x = Math.PI / 2;
        exh1.position.set(-0.45, 0.18, -1.65);
        const exh2 = new THREE.Mesh(exhaustGeo, exhaustMat);
        exh2.rotation.x = Math.PI / 2;
        exh2.position.set(-0.35, 0.18, -1.65);
        carGroup.add(exh1);
        carGroup.add(exh2);

        // Nitro exhaust flames for BMW
        const bmwFlameGeo = new THREE.ConeGeometry(0.12, 0.75, 8);
        const bmwFlameMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85 });
        [-0.45, -0.35].forEach(fx => {
          const flame = new THREE.Mesh(bmwFlameGeo, bmwFlameMat.clone());
          flame.rotation.x = -Math.PI / 2;
          flame.position.set(fx, 0.18, -2.1);
          flame.visible = false;
          carGroup.add(flame);
          nitroFlameMeshes.push(flame);
        });

        // 7. Stretched tires / Deep dish chrome wheels (Stance style!)
        const wheelOffsets = [
          [-0.86, 0.98], [0.86, 0.98], 
          [-0.86, -1.15], [0.86, -1.15]
        ];
        wheelOffsets.forEach(([wx, wz]) => {
          // Wheel outer tyre (cylinder)
          const tyreGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.33, 16);
          const tyreMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.9 });
          const tyre = new THREE.Mesh(tyreGeo, tyreMat);
          tyre.rotation.z = Math.PI / 2;
          tyre.position.set(wx, 0.16, wz);
          carGroup.add(tyre);
          wheelMeshes.push(tyre);

          // Deep chrome lip/dish inside the wheel!
          const dishGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.35, 12);
          const dishMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.05 });
          const dish = new THREE.Mesh(dishGeo, dishMat);
          dish.rotation.z = Math.PI / 2;
          dish.position.set(wx * 1.01, 0.16, wz);
          carGroup.add(dish);
        });

        // 8. Neon active underglow bar plane
        const glowPlaneGeo = new THREE.BoxGeometry(1.68, 0.04, 3.15);
        const glowPlaneMat = new THREE.MeshBasicMaterial({ color: activeV.underglow });
        underglowMesh = new THREE.Mesh(glowPlaneGeo, glowPlaneMat);
        underglowMesh.position.y = -0.01;
        carGroup.add(underglowMesh);

        // Active dynamic underglow point source
        underglowPointLight = new THREE.PointLight(activeV.underglow, 1.8, 6);
        underglowPointLight.position.set(0, 0.05, 0);
        carGroup.add(underglowPointLight);
      } else {
        // Lower main structural frame
        const bodyGeo = new THREE.BoxGeometry(1.58, 0.44, 3.1);
        const bodyMat = new THREE.MeshStandardMaterial({ 
          color: activeV.color, 
          metalness: 0.72, 
          roughness: 0.28, 
          emissive: activeV.color, 
          emissiveIntensity: 0.35 
        });
        carBodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        carBodyMesh.position.y = 0.26;
        carGroup.add(carBodyMesh);

        // Translucent glossy neon cabin
        const cabinGeo = new THREE.BoxGeometry(1.05, 0.40, 1.45);
        const cabinMat = new THREE.MeshStandardMaterial({ 
          color: activeV.underglow, 
          transparent: true, 
          opacity: 0.55, 
          metalness: 0.85, 
          roughness: 0.05, 
          emissive: activeV.underglow, 
          emissiveIntensity: 0.4 
        });
        carCabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
        carCabinMesh.position.set(0, 0.68, -0.1);
        carGroup.add(carCabinMesh);

        // 4 heavy cybernetic wheels or hover thursters
        const isHover = activeV.id === 'glide';
        const wheelOffsets = [
          [-0.83, 0.52], [0.83, 0.52], 
          [-0.83, -1.25], [0.83, -1.25]
        ];
        wheelOffsets.forEach(([x, z]) => {
          let wheel;
          if (isHover) {
            // Small horizontal glowing discs for hover pads!
            const padGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 12);
            const padMat = new THREE.MeshStandardMaterial({ 
              color: activeV.underglow, 
              emissive: activeV.underglow,
              emissiveIntensity: 0.8,
              roughness: 0.2 
            });
            wheel = new THREE.Mesh(padGeo, padMat);
            wheel.position.set(x * 0.85, 0.08, z);
          } else {
            const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.30, 16);
            const wheelMat = new THREE.MeshStandardMaterial({ 
              color: 0x09090c, 
              roughness: 0.85 
            });
            wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(x, 0.12, z);
          }
          carGroup.add(wheel);
          wheelMeshes.push(wheel);
        });

        // Symmetrical lateral thruster wings for hover glide
        if (activeV.id === 'glide') {
          const wingGeo = new THREE.BoxGeometry(0.3, 0.06, 1.6);
          const wingMat = new THREE.MeshStandardMaterial({ color: activeV.color, metalness: 0.8, roughness: 0.2 });
          const leftWing = new THREE.Mesh(wingGeo, wingMat);
          leftWing.position.set(-0.9, 0.26, -0.2);
          const rightWing = new THREE.Mesh(wingGeo, wingMat);
          rightWing.position.set(0.9, 0.26, -0.2);
          carGroup.add(leftWing);
          carGroup.add(rightWing);
        }

        // Bull-bar for VX-TITAN
        if (activeV.id === 'titan') {
          const bumperGeo = new THREE.BoxGeometry(1.45, 0.25, 0.12);
          const bumperMat = new THREE.MeshStandardMaterial({ color: 0x22222a, roughness: 0.8 });
          const bumper = new THREE.Mesh(bumperGeo, bumperMat);
          bumper.position.set(0, 0.26, 1.6);
          carGroup.add(bumper);

          const verticalBarGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
          [-0.4, 0.4].forEach(bx => {
            const bar = new THREE.Mesh(verticalBarGeo, bumperMat);
            bar.position.set(bx, 0.38, 1.6);
            carGroup.add(bar);
          });
        }

        // Spoiler for NEON-BLADE
        if (activeV.id === 'blade') {
          const spoilerGeo = new THREE.BoxGeometry(1.58, 0.05, 0.22);
          const spoilerMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
          const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
          spoiler.position.set(0, 0.65, -1.35);
          carGroup.add(spoiler);

          const strutGeo = new THREE.BoxGeometry(0.05, 0.22, 0.05);
          [-0.55, 0.55].forEach(sx => {
            const strut = new THREE.Mesh(strutGeo, spoilerMat);
            strut.position.set(sx, 0.52, -1.35);
            carGroup.add(strut);
          });
        }

        // Neon active underglow bar plane
        const glowPlaneGeo = new THREE.BoxGeometry(1.68, 0.04, 3.15);
        const glowPlaneMat = new THREE.MeshBasicMaterial({ color: activeV.underglow });
        underglowMesh = new THREE.Mesh(glowPlaneGeo, glowPlaneMat);
        underglowMesh.position.y = -0.01;
        carGroup.add(underglowMesh);

        // Active dynamic underglow point source
        underglowPointLight = new THREE.PointLight(activeV.underglow, 1.5, 6);
        underglowPointLight.position.set(0, 0.05, 0);
        carGroup.add(underglowPointLight);

        // Symmetrical headlights
        const headlightOffsets = [[-0.52, 0.52, 1.55], [0.52, 0.52, 1.55]];
        headlightOffsets.forEach(([x, y, z]) => {
          const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xfffcd8 })
          );
          bulb.position.set(x, y, z);
          carGroup.add(bulb);
        });

        // Symmetrical neon design wings/trim
        const trimOffsets = [[-0.80, 0.46, -0.1], [0.80, 0.46, -0.1]];
        trimOffsets.forEach(([x, y, z]) => {
          const wing = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.07, 2.3),
            new THREE.MeshBasicMaterial({ color: activeV.underglow })
          );
          wing.position.set(x, y, z);
          carGroup.add(wing);
          lateralTrimMeshes.push(wing);
        });

        // Dual rear nitro thrusters and flames for standard vehicles
        const nozzleGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.22, 10);
        const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x181822, metalness: 0.9, roughness: 0.2 });
        const flameGeo = new THREE.ConeGeometry(0.14, 0.75, 8);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85 });

        [-0.42, 0.42].forEach(tx => {
          const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
          nozzle.rotation.x = Math.PI / 2;
          nozzle.position.set(tx, 0.28, -1.6);
          carGroup.add(nozzle);

          const flame = new THREE.Mesh(flameGeo, flameMat.clone());
          flame.rotation.x = -Math.PI / 2;
          flame.position.set(tx, 0.28, -2.1);
          flame.visible = false;
          carGroup.add(flame);
          nitroFlameMeshes.push(flame);
        });
      }

      // Dynamic glowing thruster exhaust light on the road
      nitroThrustLight = new THREE.PointLight(0x00f0ff, 0, 8);
      nitroThrustLight.position.set(0, 0.28, -1.9);
      carGroup.add(nitroThrustLight);

      carGroup.position.set(0, 0.12, CAR_Z);
    };

    buildActiveCar();
    scene.add(carGroup);

    /* ---------- DYNAMIC NITRO PARTICLE SYSTEM TRAILS ---------- */
    const MAX_NITRO_PARTICLES = 360;
    interface NitroParticle {
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      life: number;
      maxLife: number;
      baseR: number;
      baseG: number;
      baseB: number;
      active: boolean;
    }

    const nitroParticles: NitroParticle[] = [];
    const nitroPositions = new Float32Array(MAX_NITRO_PARTICLES * 3);
    const nitroColors = new Float32Array(MAX_NITRO_PARTICLES * 3);

    for (let i = 0; i < MAX_NITRO_PARTICLES; i++) {
      nitroParticles.push({
        pos: new THREE.Vector3(0, -9999, 0),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        baseR: 0,
        baseG: 1,
        baseB: 1,
        active: false
      });
      nitroPositions[i * 3] = 0;
      nitroPositions[i * 3 + 1] = -9999;
      nitroPositions[i * 3 + 2] = 0;
      nitroColors[i * 3] = 0;
      nitroColors[i * 3 + 1] = 0;
      nitroColors[i * 3 + 2] = 0;
    }

    const nitroGeo = new THREE.BufferGeometry();
    const nitroPositionsAttr = new THREE.BufferAttribute(nitroPositions, 3);
    const nitroColorsAttr = new THREE.BufferAttribute(nitroColors, 3);
    nitroGeo.setAttribute('position', nitroPositionsAttr);
    nitroGeo.setAttribute('color', nitroColorsAttr);

    // Procedural soft-glow radial circle sprite
    const createParticleCanvasTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.18, 'rgba(180, 250, 255, 0.95)');
        grad.addColorStop(0.48, 'rgba(0, 240, 255, 0.65)');
        grad.addColorStop(0.75, 'rgba(255, 46, 196, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    const nitroPointsMat = new THREE.PointsMaterial({
      size: 0.95,
      map: createParticleCanvasTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const nitroParticleSystem = new THREE.Points(nitroGeo, nitroPointsMat);
    scene.add(nitroParticleSystem);

    let nitroParticleIndex = 0;

    const resetNitroParticles = () => {
      for (let i = 0; i < MAX_NITRO_PARTICLES; i++) {
        nitroParticles[i].active = false;
        nitroParticles[i].pos.set(0, -9999, 0);
        nitroPositions[i * 3] = 0;
        nitroPositions[i * 3 + 1] = -9999;
        nitroPositions[i * 3 + 2] = 0;
        nitroColors[i * 3] = 0;
        nitroColors[i * 3 + 1] = 0;
        nitroColors[i * 3 + 2] = 0;
      }
      nitroPositionsAttr.needsUpdate = true;
      nitroColorsAttr.needsUpdate = true;
    };

    /* ---------- DYNAMIC DRIFT SMOKE PARTICLE SYSTEM ---------- */
    const MAX_DRIFT_PARTICLES = 240;
    interface DriftParticle {
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      life: number;
      maxLife: number;
      baseR: number;
      baseG: number;
      baseB: number;
      active: boolean;
    }

    const driftParticles: DriftParticle[] = [];
    const driftPositions = new Float32Array(MAX_DRIFT_PARTICLES * 3);
    const driftColors = new Float32Array(MAX_DRIFT_PARTICLES * 3);

    for (let i = 0; i < MAX_DRIFT_PARTICLES; i++) {
      driftParticles.push({
        pos: new THREE.Vector3(0, -9999, 0),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        baseR: 0.9,
        baseG: 0.92,
        baseB: 0.96,
        active: false
      });
      driftPositions[i * 3] = 0;
      driftPositions[i * 3 + 1] = -9999;
      driftPositions[i * 3 + 2] = 0;
      driftColors[i * 3] = 0;
      driftColors[i * 3 + 1] = 0;
      driftColors[i * 3 + 2] = 0;
    }

    const driftGeo = new THREE.BufferGeometry();
    const driftPositionsAttr = new THREE.BufferAttribute(driftPositions, 3);
    const driftColorsAttr = new THREE.BufferAttribute(driftColors, 3);
    driftGeo.setAttribute('position', driftPositionsAttr);
    driftGeo.setAttribute('color', driftColorsAttr);

    // Procedural volumetric cloud/smoke puff texture
    const createSmokeCanvasTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.2, 'rgba(235, 245, 255, 0.75)');
        grad.addColorStop(0.5, 'rgba(180, 205, 240, 0.38)');
        grad.addColorStop(0.8, 'rgba(120, 145, 185, 0.12)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    const driftPointsMat = new THREE.PointsMaterial({
      size: 1.6,
      map: createSmokeCanvasTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const driftParticleSystem = new THREE.Points(driftGeo, driftPointsMat);
    scene.add(driftParticleSystem);

    let driftParticleIndex = 0;
    let lastDriftScreechTime = 0;

    const resetDriftParticles = () => {
      for (let i = 0; i < MAX_DRIFT_PARTICLES; i++) {
        driftParticles[i].active = false;
        driftParticles[i].pos.set(0, -9999, 0);
        driftPositions[i * 3] = 0;
        driftPositions[i * 3 + 1] = -9999;
        driftPositions[i * 3 + 2] = 0;
        driftColors[i * 3] = 0;
        driftColors[i * 3 + 1] = 0;
        driftColors[i * 3 + 2] = 0;
      }
      driftPositionsAttr.needsUpdate = true;
      driftColorsAttr.needsUpdate = true;
    };

    /* ---------- PROCEDURAL AI TRAFFIC GENERATOR ---------- */
    type TrafficVehicleType = 'sedan' | 'sports' | 'truck' | 'taxi' | 'van' | 'muscle' | 'supercar' | 'cybercab';

    const generateTrafficCarGroup = (type: TrafficVehicleType, carColor: number) => {
      const group = new THREE.Group();

      let bodyGeo: THREE.BoxGeometry;
      let cabinGeo: THREE.BoxGeometry;
      let cabinY = 0.55;
      let cabinZ = -0.1;
      let wheelRadius = 0.31;
      let wheelWidth = 0.24;

      if (type === 'sports') {
        bodyGeo = new THREE.BoxGeometry(1.5, 0.35, 3.1);
        cabinGeo = new THREE.BoxGeometry(1.1, 0.35, 1.3);
        cabinY = 0.48;
        cabinZ = -0.15;
        // Rear aerodynamic spoiler wing
        const spoilerGeo = new THREE.BoxGeometry(1.5, 0.06, 0.25);
        const spoilerMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
        const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
        spoiler.position.set(0, 0.6, -1.35);
        group.add(spoiler);

        // Spoiler struts
        const strutGeo = new THREE.BoxGeometry(0.06, 0.25, 0.06);
        [-0.5, 0.5].forEach(sx => {
          const strut = new THREE.Mesh(strutGeo, spoilerMat);
          strut.position.set(sx, 0.45, -1.35);
          group.add(strut);
        });
      } else if (type === 'supercar') {
        // Ultra-low, wide wedge exotic shape
        bodyGeo = new THREE.BoxGeometry(1.62, 0.28, 3.35);
        cabinGeo = new THREE.BoxGeometry(1.05, 0.28, 1.25);
        cabinY = 0.42;
        cabinZ = -0.1;
        wheelRadius = 0.33;
        wheelWidth = 0.28;

        // Twin aerodynamic rear fins
        const finGeo = new THREE.BoxGeometry(0.08, 0.3, 0.7);
        const finMat = new THREE.MeshStandardMaterial({ color: 0x18181f, roughness: 0.3 });
        [-0.65, 0.65].forEach(fx => {
          const fin = new THREE.Mesh(finGeo, finMat);
          fin.position.set(fx, 0.48, -1.1);
          group.add(fin);
        });

        // Rear carbon diffuser
        const diffuserGeo = new THREE.BoxGeometry(1.4, 0.12, 0.3);
        const diffuserMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
        const diffuser = new THREE.Mesh(diffuserGeo, diffuserMat);
        diffuser.position.set(0, 0.15, -1.65);
        group.add(diffuser);
      } else if (type === 'muscle') {
        // Aggressive boxy muscle car with hood scoop
        bodyGeo = new THREE.BoxGeometry(1.56, 0.48, 3.2);
        cabinGeo = new THREE.BoxGeometry(1.18, 0.38, 1.35);
        cabinY = 0.62;
        cabinZ = -0.22;
        wheelRadius = 0.34;
        wheelWidth = 0.30;

        // Big power hood scoop blower
        const scoopGeo = new THREE.BoxGeometry(0.5, 0.18, 0.6);
        const scoopMat = new THREE.MeshStandardMaterial({ color: 0x1c1c22, roughness: 0.4 });
        const scoop = new THREE.Mesh(scoopGeo, scoopMat);
        scoop.position.set(0, 0.68, 0.85);
        group.add(scoop);

        // Rear lip ducktail spoiler
        const lipGeo = new THREE.BoxGeometry(1.4, 0.12, 0.15);
        const lipMat = new THREE.MeshStandardMaterial({ color: 0x111116 });
        const lip = new THREE.Mesh(lipGeo, lipMat);
        lip.position.set(0, 0.65, -1.55);
        group.add(lip);
      } else if (type === 'truck') {
        // Heavy duty pickup truck with cab and open cargo bed
        bodyGeo = new THREE.BoxGeometry(1.68, 0.65, 3.45);
        cabinGeo = new THREE.BoxGeometry(1.42, 0.55, 1.75);
        cabinY = 0.92;
        cabinZ = 0.45; // Forward cabin
        wheelRadius = 0.38; // Heavy off-road tires
        wheelWidth = 0.32;

        // Bed/cargo box details for pickup truck
        const bedGeo = new THREE.BoxGeometry(1.5, 0.4, 1.45);
        const bedMat = new THREE.MeshStandardMaterial({ color: 0x22222a });
        const bed = new THREE.Mesh(bedGeo, bedMat);
        bed.position.set(0, 0.72, -0.85);
        group.add(bed);

        // Heavy front bull-bar bumper
        const bullBarGeo = new THREE.BoxGeometry(1.55, 0.3, 0.15);
        const bullBarMat = new THREE.MeshStandardMaterial({ color: 0x444450, metalness: 0.8 });
        const bullBar = new THREE.Mesh(bullBarGeo, bullBarMat);
        bullBar.position.set(0, 0.45, 1.75);
        group.add(bullBar);
      } else if (type === 'van') {
        // Tall futuristic delivery van / cyberpunk hauler
        bodyGeo = new THREE.BoxGeometry(1.62, 0.82, 3.5);
        cabinGeo = new THREE.BoxGeometry(1.5, 0.72, 2.3);
        cabinY = 0.95;
        cabinZ = -0.15;
        wheelRadius = 0.35;
        wheelWidth = 0.28;

        // Roof rack cargo bar
        const rackGeo = new THREE.BoxGeometry(1.3, 0.08, 1.8);
        const rackMat = new THREE.MeshStandardMaterial({ color: 0x33333f, metalness: 0.7 });
        const rack = new THREE.Mesh(rackGeo, rackMat);
        rack.position.set(0, 1.42, -0.2);
        group.add(rack);
      } else if (type === 'taxi') {
        // Metropolitan City Taxi
        bodyGeo = new THREE.BoxGeometry(1.48, 0.46, 2.95);
        cabinGeo = new THREE.BoxGeometry(1.08, 0.40, 1.45);
        cabinY = 0.58;
        
        // Taxi top roof sign
        const signGeo = new THREE.BoxGeometry(0.38, 0.16, 0.18);
        const signMat = new THREE.MeshBasicMaterial({ color: 0xffb703 }); // Glowing amber taxi sign
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 0.88, -0.15);
        group.add(sign);
      } else if (type === 'cybercab') {
        // Sleek autonomous cyberpunk shuttle / cab
        bodyGeo = new THREE.BoxGeometry(1.45, 0.52, 2.85);
        cabinGeo = new THREE.BoxGeometry(1.15, 0.48, 2.0);
        cabinY = 0.65;
        cabinZ = 0;
        wheelRadius = 0.30;
        wheelWidth = 0.24;

        // Autonomous sensor beacon on roof
        const sensorGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 8);
        const sensorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const sensor = new THREE.Mesh(sensorGeo, sensorMat);
        sensor.position.set(0, 0.96, 0);
        group.add(sensor);
      } else { // 'sedan'
        // Standard highway commuter sedan
        bodyGeo = new THREE.BoxGeometry(1.5, 0.45, 3.0);
        cabinGeo = new THREE.BoxGeometry(1.1, 0.4, 1.45);
        cabinY = 0.58;
      }

      // 1. Car main body mesh
      const bodyMat = new THREE.MeshStandardMaterial({ 
        color: carColor, 
        metalness: type === 'supercar' ? 0.85 : 0.65, 
        roughness: type === 'supercar' ? 0.2 : 0.35 
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.position.y = bodyGeo.parameters.height / 2 + 0.12;
      group.add(bodyMesh);

      // 2. Car glass cabin
      const cabinMat = new THREE.MeshStandardMaterial({
        color: 0x090a0f,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7
      });
      const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
      cabinMesh.position.set(0, cabinY, cabinZ);
      group.add(cabinMesh);

      // 3. Four wheels (cylinders)
      const isHeavy = type === 'truck' || type === 'van';
      const wZOffsets = isHeavy ? [1.0, -1.15] : [0.82, -1.02];
      const wXOffset = isHeavy ? 0.88 : (type === 'supercar' ? 0.86 : 0.82);
      const wheelOffsets = [
        [-wXOffset, wZOffsets[0]], [wXOffset, wZOffsets[0]], 
        [-wXOffset, wZOffsets[1]], [wXOffset, wZOffsets[1]]
      ];
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.85 });
      wheelOffsets.forEach(([wx, wz]) => {
        const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 12);
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, wheelRadius * 0.9, wz);
        group.add(wheel);
      });

      // 4. Symmetrical Headlights
      const hZ = bodyGeo.parameters.depth / 2 + 0.02;
      const hY = bodyMesh.position.y;
      const hX = bodyGeo.parameters.width * 0.35;
      [[-hX, hY, hZ], [hX, hY, hZ]].forEach(([hx, hy, hz]) => {
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xfffeed })
        );
        bulb.position.set(hx, hy, hz);
        group.add(bulb);
      });

      // 5. Red Tail lights
      const tZ = -bodyGeo.parameters.depth / 2 - 0.02;
      const tY = bodyMesh.position.y;
      const tX = bodyGeo.parameters.width * 0.35;
      [[-tX, tY, tZ], [tX, tY, tZ]].forEach(([tx, ty, tz]) => {
        const bulb = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.08, 0.04),
          new THREE.MeshBasicMaterial({ color: 0xff0033 })
        );
        bulb.position.set(tx, ty, tz);
        group.add(bulb);
      });

      // 6. Glowing underglow plane
      const glowGeo = new THREE.BoxGeometry(bodyGeo.parameters.width - 0.1, 0.03, bodyGeo.parameters.depth - 0.2);
      const glowColor = (type === 'sports' || type === 'supercar') 
        ? 0x00f0ff 
        : (type === 'taxi' ? 0xffb703 : (type === 'cybercab' ? 0x00ff88 : 0xff2ec4));
      const glowMat = new THREE.MeshBasicMaterial({ color: glowColor });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.y = 0.01;
      group.add(glow);

      return group;
    };

    /* ---------- TRAFFIC AI VEHICLES POOL ---------- */
    const TRAFFIC_COUNT = 10;
    const trafficPool: { 
      mesh: THREE.Group; 
      active: boolean; 
      lane: number; 
      speed: number; 
      type: TrafficVehicleType;
      color: number;
    }[] = [];

    const trafficColors = [
      0xff2ec4, // Hot Pink
      0x00f0ff, // Electric Cyan
      0xffb703, // Amber Gold
      0x7b2ff7, // Purple
      0x00ff66, // Green
      0xff3300, // Crimson Red
      0xe0e0e0, // Silver
      0x1a1a24, // Midnight Stealth
      0xff6b00  // Neon Orange
    ];

    const trafficTypes: TrafficVehicleType[] = [
      'sedan', 'sports', 'truck', 'taxi', 'van', 'muscle', 'supercar', 'cybercab'
    ];

    for (let i = 0; i < TRAFFIC_COUNT; i++) {
      const type = trafficTypes[i % trafficTypes.length];
      const color = trafficColors[Math.floor(Math.random() * trafficColors.length)];
      
      const mesh = generateTrafficCarGroup(type, color);
      mesh.visible = false;
      scene.add(mesh);

      trafficPool.push({
        mesh,
        active: false,
        lane: 1,
        speed: 15,
        type,
        color
      });
    }

    const triggerTrafficSpawn = () => {
      const free = trafficPool.find(t => !t.active);
      if (!free) return;

      const randomLane = Math.floor(Math.random() * 3);
      
      // Ensure we don't spawn two active cars at the exact same lane close to each other
      const laneOccupiedNearHorizon = trafficPool.some(t => t.active && t.lane === randomLane && Math.abs(t.mesh.position.z - SPAWN_FAR_Z) < 30);
      if (laneOccupiedNearHorizon) {
        const alternativeLanes = [0, 1, 2].filter(l => l !== randomLane);
        const altLane = alternativeLanes[Math.floor(Math.random() * alternativeLanes.length)];
        const altOccupied = trafficPool.some(t => t.active && t.lane === altLane && Math.abs(t.mesh.position.z - SPAWN_FAR_Z) < 30);
        if (altOccupied) return; // skip spawn this frame
        free.lane = altLane;
      } else {
        free.lane = randomLane;
      }

      free.mesh.position.x = LANE_X[free.lane];

      // Decide if this will be a slow car or a fast car
      const isSlower = Math.random() > 0.4 || activeSpeed < 22;

      if (isSlower) {
        // Slower car: drives forward at its own speed (slower than player)
        // Spawn far ahead at the horizon so the player has to catch up and steer around it
        free.speed = 10 + Math.random() * 8; // absolute speed e.g. 10-18 units/s
        free.mesh.position.z = SPAWN_FAR_Z - Math.random() * 20;
      } else {
        // Faster car: drives forward at its own speed (faster than player)
        // Spawn behind the player so it catches up and zooms past them
        free.speed = activeSpeed + 12 + Math.random() * 10; // absolute speed faster than player
        free.mesh.position.z = CAR_Z + 40 + Math.random() * 15; // spawn behind camera
        
        // Ensure it doesn't immediately spawn in the same lane as the player to avoid sudden rear collision
        if (free.lane === playerTargetLaneIndex) {
          const alternativeLanes = [0, 1, 2].filter(l => l !== playerTargetLaneIndex);
          free.lane = alternativeLanes[Math.floor(Math.random() * alternativeLanes.length)];
          free.mesh.position.x = LANE_X[free.lane];
        }
      }

      free.mesh.visible = true;
      free.active = true;
    };

    const clearAllTraffic = () => {
      trafficPool.forEach(t => {
        t.active = false;
        t.mesh.visible = false;
      });
    };

    // Immediately spawn traffic cars on highway right from the start!
    const spawnInitialTraffic = () => {
      clearAllTraffic();

      const initialCarPositions = [
        { lane: 0, z: CAR_Z - 38, speed: 12 },
        { lane: 2, z: CAR_Z - 70, speed: 14 },
        { lane: 1, z: CAR_Z - 105, speed: 11 },
        { lane: 0, z: CAR_Z - 145, speed: 13 },
        { lane: 2, z: CAR_Z - 190, speed: 15 },
        { lane: 1, z: CAR_Z - 235, speed: 12 },
      ];

      initialCarPositions.forEach((cfg, idx) => {
        if (idx < trafficPool.length) {
          const t = trafficPool[idx];
          t.lane = cfg.lane;
          t.speed = cfg.speed;
          t.mesh.position.x = LANE_X[t.lane];
          t.mesh.position.z = cfg.z;
          t.mesh.visible = true;
          t.active = true;
        }
      });
    };

    // Seed initial traffic ahead so highway looks active immediately
    spawnInitialTraffic();

    /* ---------- ENGINE RUNTIME STATE ---------- */
    let activeSpeed = IDLE_SPEED;
    let activeScore = 0;
    let activeTimeElapsed = 0;
    let playerTargetLaneIndex = 1;
    let spawnCountdown = 0.0;
    let currentSpawnInterval = 1.25;
    let internalGameState: 'title' | 'countdown' | 'playing' | 'gameover' = 'title';

    // Speed boost state
    let boostFuel = 100.0;
    let boostRequested = false;
    let boostActive = false;
    let wasBoosting = false;

    // Screen shake variables for collision visual response
    let cameraShakeIntensity = 0.0;

    /* ---------- CORE LOOP LOGIC ---------- */
    const internalClock = new THREE.Clock();
    let requestID: number;

    const renderLoop = () => {
      requestID = requestAnimationFrame(renderLoop);
      const dt = Math.min(internalClock.getDelta(), 0.05); // Caps delta to prevent skips on background tabs
      const clockTotalTime = internalClock.getElapsedTime();

      const isPaused = pausedRef.current;
      const effectiveDt = isPaused ? 0 : dt;

      // Adjust game values depending on external state hooks
      if (internalGameState === 'playing') {
        if (!isPaused) {
          activeTimeElapsed += dt;
          
          // Base vehicle stats adjust velocity ramp limits
          const vehicle = activeVehicleRef.current;
          const currentMaxLimit = MAX_SPEED * vehicle.speedMultiplier;
          const baseSpeedCalc = Math.min(currentMaxLimit, BASE_SPEED + activeTimeElapsed * SPEED_RAMP);

          // Speed Boost calculation
          if (boostRequested && boostFuel > 1.5) {
            boostActive = true;
            boostFuel = Math.max(0, boostFuel - dt * 26); // lasts ~3.8 seconds full burn
            activeSpeed = baseSpeedCalc + 18.0; // Significant thrilling boost surge!
            if (!wasBoosting) {
              synth.playBoost();
              wasBoosting = true;
            }
          } else {
            boostActive = false;
            wasBoosting = false;
            boostFuel = Math.min(100, boostFuel + dt * 14); // recharges over ~7s
            activeSpeed = baseSpeedCalc;
          }
          
          // Accumulate active score based on speed (boost multiplier rewards brave driving!)
          const scoreMultiplier = boostActive ? 1.8 : 1.2;
          activeScore += activeSpeed * dt * scoreMultiplier;
          setScore(Math.floor(activeScore));
          setSpeed(activeSpeed);
          setBoostFuel(Math.round(boostFuel));
          setIsBoosting(boostActive);

          // Update synthesized sound
          synth.updateEngine(activeSpeed);

          // Adjust spawn speed intervals
          currentSpawnInterval = Math.max(0.65, 1.35 - activeTimeElapsed * 0.015);
          spawnCountdown -= dt;
          if (spawnCountdown <= 0) {
            triggerTrafficSpawn();
            spawnCountdown = currentSpawnInterval;
          }
        }
      } else if (internalGameState === 'countdown') {
        // Countdown state: Vehicle is aligned on starting grid revving up
        activeSpeed = 0;
        setSpeed(0);
      } else if (internalGameState === 'gameover') {
        // Friction dampening decelerate
        activeSpeed *= 0.93;
        setSpeed(activeSpeed);
        synth.updateEngine(activeSpeed);
        if (activeSpeed < 0.1) activeSpeed = 0;
      } else {
        // Idle demo cruise speed
        activeSpeed = IDLE_SPEED;
        setSpeed(activeSpeed);
      }

      // 1. Move Infinite Road Segments and update lighting
      const zoneState = getZoneAtDistance(activeScore);
      const currentLit = ZONE_LIGHTING[zoneState.current];
      const nextLit = ZONE_LIGHTING[zoneState.next];
      const transitionFactor = zoneState.factor;

      const activeFogColor = lerpColor(currentLit.fogColor, nextLit.fogColor, transitionFactor);
      const activeAmbientColor = lerpColor(currentLit.ambientColor, nextLit.ambientColor, transitionFactor);
      const activeAmbientIntensity = lerpNum(currentLit.ambientIntensity, nextLit.ambientIntensity, transitionFactor);
      const activeHemiSky = lerpColor(currentLit.hemisphereSky, nextLit.hemisphereSky, transitionFactor);
      const activeHemiGround = lerpColor(currentLit.hemisphereGround, nextLit.hemisphereGround, transitionFactor);
      const activeHemiIntensity = lerpNum(currentLit.hemisphereIntensity, nextLit.hemisphereIntensity, transitionFactor);
      const activeSunColor = lerpColor(currentLit.sunColor, nextLit.sunColor, transitionFactor);
      const activeSunOpacity = lerpNum(currentLit.sunOpacity, nextLit.sunOpacity, transitionFactor);
      const activeStarOpacity = lerpNum(currentLit.starOpacity, nextLit.starOpacity, transitionFactor);

      if (scene.fog) {
        scene.fog.color.copy(activeFogColor);
      }
      renderer.setClearColor(activeFogColor);
      ambientLight.color.copy(activeAmbientColor);
      ambientLight.intensity = activeAmbientIntensity;

      hemisphereLight.color.copy(activeHemiSky);
      hemisphereLight.groundColor.copy(activeHemiGround);
      hemisphereLight.intensity = activeHemiIntensity;

      const sunMaterial = horizonSun.material as THREE.MeshBasicMaterial;
      sunMaterial.color.copy(activeSunColor);
      sunMaterial.opacity = activeSunOpacity;

      starMaterial.opacity = activeStarOpacity;

      roadSegments.forEach(seg => {
        seg.position.z += activeSpeed * effectiveDt;
        // Reset segment to back of queue when it exits behind the camera
        if (seg.position.z - SEG_LEN / 2 > camera.position.z + 4) {
          seg.position.z -= NUM_SEGMENTS * SEG_LEN;

          // Re-populate scenery for recycled segment
          const segmentDistance = activeScore + (CAR_Z - seg.position.z);
          populateSceneryForSegment(seg, segmentDistance);
        }
      });

      // Update Dynamic Train inside Countryside Zone
      if (internalGameState === 'playing' && !isPaused) {
        if (zoneState.current === 1) {
          if (!trainActive) {
            trainCooldown -= dt;
            if (trainCooldown <= 0) {
              trainActive = true;
              trainZ = CAR_Z + 120; // Spawn behind camera
              trainSpeed = activeSpeed + 25; // Speeding past
              if (trainGroup) {
                trainGroup.position.z = trainZ;
                trainGroup.visible = true;
              }
            }
          } else {
            // Move train forward relatives to camera (since it's faster than player)
            trainZ += (activeSpeed - trainSpeed) * dt;
            if (trainGroup) {
              trainGroup.position.z = trainZ;
              // Deactivate train when it goes far ahead of player
              if (trainZ < CAR_Z - 300) {
                trainActive = false;
                trainGroup.visible = false;
                trainCooldown = 15.0 + Math.random() * 10;
              }
            }
          }
        } else {
          // Hide train in other zones
          if (trainActive) {
            trainActive = false;
            if (trainGroup) trainGroup.visible = false;
          }
          trainCooldown = 2.0;
        }
      }

      // 2. Animate and Check Traffic Cars
      if (internalGameState === 'playing') {
        trafficPool.forEach(trafficCar => {
          if (!trafficCar.active) return;

          // Propel relative to players frame
          trafficCar.mesh.position.z += (activeSpeed - trafficCar.speed) * effectiveDt;

          // Simple evasion AI: if a fast car approaches the player from behind in the same lane,
          // it changes lanes to safely overtake the player.
          if (!isPaused && trafficCar.speed > activeSpeed && trafficCar.mesh.position.z > CAR_Z && trafficCar.mesh.position.z < CAR_Z + 18) {
            const isSameLane = Math.abs(trafficCar.mesh.position.x - carGroup.position.x) < 1.5;
            if (isSameLane) {
              const alternativeLanes = [0, 1, 2].filter(l => l !== playerTargetLaneIndex);
              const newLane = alternativeLanes[Math.floor(Math.random() * alternativeLanes.length)];
              trafficCar.lane = newLane;
              trafficCar.mesh.position.x = LANE_X[newLane];
            }
          }

          // Align wheels spinning according to traffic speed
          if (!isPaused) {
            trafficCar.mesh.children.forEach(child => {
              if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry && child.material instanceof THREE.MeshStandardMaterial) {
                child.rotation.x += trafficCar.speed * dt * 0.35;
              }
            });
          }

          // Collision detection thresholds
          const diffZ = Math.abs(trafficCar.mesh.position.z - CAR_Z);
          const diffX = Math.abs(trafficCar.mesh.position.x - carGroup.position.x);

          // Standard crash bounding hit boxes
          if (diffZ < 2.5 && diffX < 0.95) {
            // CRASH HIT!
            synth.playCrash();
            cameraShakeIntensity = 0.55; // Screen shake trigger
            
            internalGameState = 'gameover';
            setGameState('gameover');
            synth.stopEngine();

            // Check new high score and save
            const finalScoreVal = Math.floor(activeScore);
            const savedHigh = parseInt(localStorage.getItem('neon_rush_highscore') || '0', 10);
            if (finalScoreVal > savedHigh) {
              saveHighScore(finalScoreVal);
            }
          }

          // Deactivate passed traffic
          if (trafficCar.mesh.position.z > camera.position.z + 10) {
            trafficCar.active = false;
            trafficCar.mesh.visible = false;
            if (trafficCar.speed < activeSpeed) {
              setDodgeCount(prev => prev + 1);
            }
          }
          
          // Deactivate zoom-ahead traffic
          if (trafficCar.mesh.position.z < SPAWN_FAR_Z - 30) {
            trafficCar.active = false;
            trafficCar.mesh.visible = false;
          }
        });
      }

      // 3. Car lateral transition interpolation
      const currentVehicle = activeVehicleRef.current;
      const targetX = LANE_X[playerTargetLaneIndex];
      const previousX = carGroup.position.x;
      
      // Shift interpolation according to current vehicle's agility rating
      if (!isPaused) {
        carGroup.position.x += (targetX - carGroup.position.x) * Math.min(1, dt * currentVehicle.shiftSpeed);
        
        // Calculate lateral speed velocity for roll rotation tilt effects
        const latSpeed = (carGroup.position.x - previousX) / Math.max(dt, 0.0001);
        carGroup.rotation.z += (-(latSpeed * 0.028) - carGroup.rotation.z) * 0.18;

        // 3.1. Tactical Drift Smoke Particle Emission on Aggressive Steering / High Lateral Velocity
        const isAggressiveSteer = Math.abs(latSpeed) > 3.6 && activeSpeed > 6 && internalGameState === 'playing';
        if (isAggressiveSteer) {
          if (clockTotalTime - lastDriftScreechTime > 0.22) {
            synth.playTireScreech();
            lastDriftScreechTime = clockTotalTime;
          }

          const isBmw = currentVehicle.id === 'bmw';
          const tireOffsets = isBmw
            ? [new THREE.Vector3(-0.86, 0.04, -1.15), new THREE.Vector3(0.86, 0.04, -1.15)]
            : [new THREE.Vector3(-0.83, 0.04, -1.25), new THREE.Vector3(0.83, 0.04, -1.25)];

          const underglowHex = currentVehicle.underglow;
          const ugR = ((underglowHex >> 16) & 255) / 255;
          const ugG = ((underglowHex >> 8) & 255) / 255;
          const ugB = (underglowHex & 255) / 255;

          tireOffsets.forEach((offset, idx) => {
            const isOuterTire = (latSpeed > 0 && idx === 0) || (latSpeed < 0 && idx === 1);
            const count = isOuterTire ? 3 : 2;

            const worldTirePos = offset.clone();
            carGroup.localToWorld(worldTirePos);

            for (let k = 0; k < count; k++) {
              const p = driftParticles[driftParticleIndex];
              driftParticleIndex = (driftParticleIndex + 1) % MAX_DRIFT_PARTICLES;

              p.active = true;
              p.life = 0;
              p.maxLife = 0.45 + Math.random() * 0.30;

              p.pos.set(
                worldTirePos.x + (Math.random() - 0.5) * 0.18,
                0.04 + Math.random() * 0.06,
                worldTirePos.z + (Math.random() - 0.5) * 0.2
              );

              const driftBackSpeed = activeSpeed * 0.94 + Math.random() * 3.0;
              const driftSideSpeed = -latSpeed * 0.28 + (Math.random() - 0.5) * 1.6;
              const driftUpSpeed = 0.25 + Math.random() * 0.45;

              p.vel.set(driftSideSpeed, driftUpSpeed, driftBackSpeed);

              p.baseR = 0.76 + ugR * 0.24;
              p.baseG = 0.80 + ugG * 0.20;
              p.baseB = 0.88 + ugB * 0.12;
            }
          });
        }
        
        // Hovering micro-bobbing animation & idling rev vibration during countdown
        if (internalGameState === 'countdown') {
          carGroup.position.y = 0.12 + Math.sin(clockTotalTime * 30) * 0.016;
        } else {
          carGroup.position.y = 0.12 + Math.sin(clockTotalTime * 8) * 0.022;
        }

        // Spin tires slightly if playing/cruising
        wheelMeshes.forEach(wheel => {
          wheel.rotation.x += activeSpeed * dt * 0.35;
        });

        // Dynamic nitro flame visuals
        nitroFlameMeshes.forEach(flame => {
          if (boostActive && !isPaused) {
            flame.visible = true;
            const flicker = 0.75 + Math.random() * 0.55;
            flame.scale.set(1.3, 1.3 * flicker, 1.9 * flicker);
            (flame.material as THREE.MeshBasicMaterial).color.setHex(
              Math.random() > 0.4 ? 0x00f0ff : 0xff4500
            );
          } else {
            flame.visible = false;
          }
        });

        // Pulsing thruster point light on road
        if (nitroThrustLight) {
          if (boostActive && !isPaused) {
            nitroThrustLight.intensity = 2.6 + Math.random() * 1.6;
            nitroThrustLight.color.setHex(Math.random() > 0.35 ? 0x00f0ff : 0xff2ec4);
          } else {
            nitroThrustLight.intensity = 0;
          }
        }

        // Emit dynamic particle system trails from the thruster nozzles
        if (boostActive && !isPaused && internalGameState === 'playing') {
          const isBmw = currentVehicle.id === 'bmw';
          const nozzleLocalOffsets = isBmw
            ? [new THREE.Vector3(-0.45, 0.18, -1.68), new THREE.Vector3(-0.35, 0.18, -1.68)]
            : [new THREE.Vector3(-0.42, 0.28, -1.65), new THREE.Vector3(0.42, 0.28, -1.65)];

          // Spawn multiple trail particles per nozzle per frame for a dense, continuous hyper-stream
          const particlesPerNozzle = 4;
          nozzleLocalOffsets.forEach(nozzleOffset => {
            const worldNozzlePos = nozzleOffset.clone();
            carGroup.localToWorld(worldNozzlePos);

            for (let k = 0; k < particlesPerNozzle; k++) {
              const p = nitroParticles[nitroParticleIndex];
              nitroParticleIndex = (nitroParticleIndex + 1) % MAX_NITRO_PARTICLES;

              p.active = true;
              p.life = 0;
              p.maxLife = 0.38 + Math.random() * 0.25;

              // Position with slight turbulence near nozzle orifice
              p.pos.set(
                worldNozzlePos.x + (Math.random() - 0.5) * 0.1,
                worldNozzlePos.y + (Math.random() - 0.5) * 0.1,
                worldNozzlePos.z - Math.random() * 0.25
              );

              // Backwards ejection velocity + car relative speed + conical dispersion
              const ejectionSpeed = activeSpeed + 18.0 + Math.random() * 15.0;
              const spreadX = (Math.random() - 0.5) * 1.5;
              const spreadY = (Math.random() - 0.5) * 1.2;

              p.vel.set(spreadX, spreadY, ejectionSpeed);

              // Color distribution: high-energy white/cyan core with magenta overdrive outer trail
              const colRand = Math.random();
              if (colRand > 0.45) {
                // Electric Cyan
                p.baseR = 0.0;
                p.baseG = 0.94;
                p.baseB = 1.0;
              } else if (colRand > 0.15) {
                // Hyper Magenta
                p.baseR = 1.0;
                p.baseG = 0.18;
                p.baseB = 0.77;
              } else {
                // Intense White Core Spark
                p.baseR = 1.0;
                p.baseG = 0.98;
                p.baseB = 0.92;
              }
            }
          });
        }
      }

      // 4. Camera control transitions
      let shakeOffsetX = 0;
      let shakeOffsetY = 0;
      if (cameraShakeIntensity > 0.01) {
        shakeOffsetX = (Math.random() - 0.5) * cameraShakeIntensity;
        shakeOffsetY = (Math.random() - 0.5) * cameraShakeIntensity;
        cameraShakeIntensity *= 0.9; // damp
      }
      if (boostActive && !isPaused) {
        shakeOffsetX += (Math.random() - 0.5) * 0.05;
        shakeOffsetY += (Math.random() - 0.5) * 0.04;
      }

      // Third-person chase camera setup positioned behind and slightly above the player's car
      const targetCamX = carGroup.position.x * 0.92; 
      const targetCamY = internalGameState === 'countdown'
        ? 1.55 + Math.sin(clockTotalTime * 4) * 0.012
        : 1.85 + Math.sin(clockTotalTime * 3) * 0.01 + shakeOffsetY;
      const targetCamZ = internalGameState === 'countdown'
        ? CAR_Z + 4.2
        : CAR_Z + 4.8;

      camera.position.x += (targetCamX - camera.position.x) * 0.18;
      camera.position.x += shakeOffsetX;
      camera.position.y += (targetCamY - camera.position.y) * 0.18;
      camera.position.z += (targetCamZ - camera.position.z) * 0.18;
      
      // Speed visual FOV warping with boost expansion
      const boostFOVBonus = boostActive ? 12 : 0;
      const targetFOV = 72 + (activeSpeed / MAX_SPEED) * 15 + boostFOVBonus;
      camera.fov += (targetFOV - camera.fov) * 0.08;
      camera.updateProjectionMatrix();

      // Looking down the road ahead, slightly tracking player's lateral movement
      camera.lookAt(new THREE.Vector3(carGroup.position.x * 0.4, 0.55, CAR_Z - 35.0));

      // Update and animate all active nitro particles trailing behind the car
      for (let i = 0; i < MAX_NITRO_PARTICLES; i++) {
        const p = nitroParticles[i];
        if (p.active) {
          if (!isPaused) {
            p.life += dt;
            if (p.life >= p.maxLife) {
              p.active = false;
              p.pos.set(0, -9999, 0);
            } else {
              // Integrate position
              p.pos.x += p.vel.x * effectiveDt;
              p.pos.y += p.vel.y * effectiveDt;
              p.pos.z += p.vel.z * effectiveDt;

              // Air resistance / thermal rise
              p.vel.x *= 0.97;
              p.vel.y += 0.35 * effectiveDt;
            }
          }

          if (p.active) {
            const lifeRatio = p.life / p.maxLife;
            // Smooth bell-shaped or decaying brightness curve
            const fade = Math.pow(Math.max(0, 1.0 - lifeRatio), 1.3);

            // Dynamic color shift: bright core -> magenta/purple transition -> deep fading violet
            let r = p.baseR;
            let g = p.baseG;
            let b = p.baseB;

            if (lifeRatio > 0.35) {
              const shift = (lifeRatio - 0.35) / 0.65;
              // Shift towards violet / neon magenta at outer trail
              r = r * (1 - shift) + 0.95 * shift;
              g = g * (1 - shift) + 0.12 * shift;
              b = b * (1 - shift) + 0.95 * shift;
            }

            nitroPositions[i * 3] = p.pos.x;
            nitroPositions[i * 3 + 1] = p.pos.y;
            nitroPositions[i * 3 + 2] = p.pos.z;

            nitroColors[i * 3] = r * fade;
            nitroColors[i * 3 + 1] = g * fade;
            nitroColors[i * 3 + 2] = b * fade;
          } else {
            nitroPositions[i * 3] = 0;
            nitroPositions[i * 3 + 1] = -9999;
            nitroPositions[i * 3 + 2] = 0;
            nitroColors[i * 3] = 0;
            nitroColors[i * 3 + 1] = 0;
            nitroColors[i * 3 + 2] = 0;
          }
        } else {
          nitroPositions[i * 3] = 0;
          nitroPositions[i * 3 + 1] = -9999;
          nitroPositions[i * 3 + 2] = 0;
          nitroColors[i * 3] = 0;
          nitroColors[i * 3 + 1] = 0;
          nitroColors[i * 3 + 2] = 0;
        }
      }

      nitroPositionsAttr.needsUpdate = true;
      nitroColorsAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    // Begin Animation Loop
    renderLoop;
    renderLoop();

    /* ---------- PUBLIC API FOR HOOK INTERACTION ---------- */
    gameLoopRef.current = {
      updateCarMaterials: (vehicle: Vehicle) => {
        buildActiveCar();
      },
      prepareCountdown: () => {
        internalGameState = 'countdown';
        activeScore = 0;
        activeSpeed = 0;
        activeTimeElapsed = 0;
        playerTargetLaneIndex = 1;
        spawnCountdown = 0.0;
        currentSpawnInterval = 1.25;
        boostFuel = 100.0;
        boostRequested = false;
        boostActive = false;
        wasBoosting = false;
        setScore(0);
        setSpeed(0);
        setBoostFuel(100);
        setIsBoosting(false);
        carGroup.position.x = 0;
        carGroup.rotation.z = 0;
        resetNitroParticles();
        spawnInitialTraffic();

        // Reset dynamic train tracking
        trainActive = false;
        trainCooldown = 2.0;
        if (trainGroup) {
          trainGroup.visible = false;
          trainGroup.position.set(-15, 0.1, -1000);
        }

        // Re-populate all segment sceneries to starting position values
        roadSegments.forEach((seg, i) => {
          seg.position.z = segmentStartZ - i * SEG_LEN;
          const segmentDistance = CAR_Z - seg.position.z;
          populateSceneryForSegment(seg, segmentDistance);
        });
      },
      launchRace: () => {
        internalGameState = 'playing';
        activeSpeed = BASE_SPEED;
        cameraShakeIntensity = 0.24;
      },
      resetGame: () => {
        internalGameState = 'playing';
        activeScore = 0;
        activeSpeed = BASE_SPEED;
        activeTimeElapsed = 0;
        playerTargetLaneIndex = 1;
        spawnCountdown = 0.0;
        currentSpawnInterval = 1.25;
        boostFuel = 100.0;
        boostRequested = false;
        boostActive = false;
        wasBoosting = false;
        setScore(0);
        setSpeed(BASE_SPEED);
        setBoostFuel(100);
        setIsBoosting(false);
        carGroup.position.x = 0;
        carGroup.rotation.z = 0;
        resetNitroParticles();
        spawnInitialTraffic();

        // Reset dynamic train tracking
        trainActive = false;
        trainCooldown = 2.0;
        if (trainGroup) {
          trainGroup.visible = false;
          trainGroup.position.set(-15, 0.1, -1000);
        }

        // Re-populate all segment sceneries to starting position values
        roadSegments.forEach((seg, i) => {
          seg.position.z = segmentStartZ - i * SEG_LEN;
          const segmentDistance = CAR_Z - seg.position.z;
          populateSceneryForSegment(seg, segmentDistance);
        });
      },
      changeLaneLeft: () => {
        if (internalGameState !== 'playing' || pausedRef.current) return;
        playerTargetLaneIndex = Math.max(0, playerTargetLaneIndex - 1);
        synth.playShift();
      },
      changeLaneRight: () => {
        if (internalGameState !== 'playing' || pausedRef.current) return;
        playerTargetLaneIndex = Math.min(2, playerTargetLaneIndex + 1);
        synth.playShift();
      },
      setBoost: (active: boolean) => {
        boostRequested = active;
      },
      setExternalState: (state: 'title' | 'countdown' | 'playing' | 'gameover') => {
        internalGameState = state;
      }
    };

    /* ---------- INPUT EVENT LISTENERS ---------- */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        gameLoopRef.current?.changeLaneLeft();
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        gameLoopRef.current?.changeLaneRight();
      }
      if (['ArrowUp', 'KeyW', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
        gameLoopRef.current?.setBoost(true);
      }
      if (['KeyP', 'Pause'].includes(e.code)) {
        if (internalGameState === 'playing') {
          setPaused(p => !p);
        }
      }
      if (['Space', 'Enter'].includes(e.code)) {
        if (internalGameState === 'title' || internalGameState === 'gameover') {
          startRaceCountdownRef.current?.();
        } else if (internalGameState === 'playing') {
          if (e.code === 'Space') {
            gameLoopRef.current?.setBoost(true);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW', 'ShiftLeft', 'ShiftRight', 'Space'].includes(e.code)) {
        gameLoopRef.current?.setBoost(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // CLEANUP DISPOSAL
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      resizeObserver.disconnect();
      cancelAnimationFrame(requestID);
      nitroGeo.dispose();
      nitroPointsMat.dispose();
      renderer.dispose();
      synth.stopEngine();
    };
  }, []);

  // Sync core Game State to Three Loop Ref on component state change
  useEffect(() => {
    if (gameLoopRef.current && typeof gameLoopRef.current.setExternalState === 'function') {
      gameLoopRef.current.setExternalState(gameState);
    }
  }, [gameState]);

  const activeVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[0];
  const progressToObjective = Math.min(100, Math.floor((dodgeCount / 15) * 100));

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-asphalt text-text font-body select-none" id="root-container">

      {/* ---------- FULL-SCREEN 3D GAMEPLAY VIEW (canvas fills the whole screen) ---------- */}
      <section className="absolute inset-0" id="gameplay-viewport">
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden"
            id="game-frame-container"
          >
            {/* Real WebGL Canvas Render Element */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" id="gameCanvas" />

            {/* --- IN-GAME OVERLAY STATS / HUD --- */}
            <div className={`absolute inset-x-0 top-0 p-3 sm:p-5 pointer-events-none flex flex-col gap-3 font-body transition-all duration-300 ${gameState === 'playing' ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Top Row: Distance & Pause, Center Nitro Status, Right: Speed & Score */}
              <div className="flex justify-between items-start w-full">
                {/* Distance & Pause */}
                <div 
                  key={gameState === 'playing' ? 'hud-score-active' : 'hud-score-idle'}
                  className={`flex items-center gap-2 sm:gap-3 pointer-events-auto ${gameState === 'playing' ? 'animate-hud-slide-left' : ''}`} 
                  id="hud-score-display"
                >
                  <button 
                    onClick={() => setPaused(!paused)}
                    className="arcade-button w-10 h-10 sm:w-11 sm:h-11 bg-steel border-edge text-text transition-all flex items-center justify-center cursor-pointer active:scale-95"
                    title={paused ? "Resume Drive (P)" : "Pause Drive (P)"}
                    id="hud-pause-btn"
                  >
                    {paused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                  </button>
                  <div className={`arcade-panel px-3 py-1.5 flex flex-col justify-center ${score % 100 < 15 && score > 20 ? 'animate-hud-vibrate-subtle' : ''}`}>
                    <div className="text-[10px] text-muted font-semibold flex items-center gap-1">
                      <Compass className="w-3 h-3 text-secondary" /> Distance
                    </div>
                    <div className="hud-number text-xl sm:text-2xl font-bold text-text leading-none mt-0.5">
                      {score} <span className="text-xs font-bold text-muted">m</span>
                    </div>
                  </div>
                </div>

                {/* Center: Live Nitro Status / Overdrive indicator */}
                <div 
                  key={gameState === 'playing' ? 'hud-nitro-active' : 'hud-nitro-idle'}
                  className={`hidden sm:flex flex-col items-center ${gameState === 'playing' ? 'animate-hud-slide-top' : ''}`}
                >
                  <div className={`arcade-panel px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-2 ${
                    isBoosting 
                      ? 'bg-primary border-primary text-asphalt'
                      : boostFuel > 20
                        ? 'text-secondary'
                        : 'text-muted'
                  }`}>
                    <Flame className={`w-4 h-4 ${isBoosting ? 'text-asphalt' : 'text-primary'}`} />
                    <span>{isBoosting ? 'Nitro active (+80% score)' : `Nitro fuel: ${boostFuel}% (hold W / ↑)`}</span>
                  </div>
                </div>

                {/* Right: Speed & Score with subtle vibrating / pulsing animations */}
                <div 
                  key={gameState === 'playing' ? 'hud-speed-active' : 'hud-speed-idle'}
                  className={`${gameState === 'playing' ? 'animate-hud-slide-right' : ''}`}
                >
                  <div 
                    className={`arcade-panel flex flex-col items-end px-3 sm:px-4 py-2 pointer-events-auto ${Math.round(speed * 6.5) > 180 ? 'animate-hud-vibrate-subtle' : ''}`} 
                    id="hud-speed-display"
                  >
                    {/* Header Score Display */}
                    <div className="flex items-center justify-between w-full gap-3 pb-1 border-b border-edge mb-1">
                      <div className="text-[10px] text-muted font-semibold flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-primary" /> Score
                      </div>
                      <div className="hud-number text-sm sm:text-base font-bold text-text leading-none font-display">
                        {Math.round(score * 12.5).toLocaleString()}
                      </div>
                    </div>

                    <div className="hud-number text-2xl sm:text-3xl font-bold text-speed font-display leading-none">
                      {Math.round(speed * 6.5)} <span className="text-xs font-body text-muted">km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- OVERLAY: STARTING RACE COUNTDOWN ANIMATION --- */}
            {gameState === 'countdown' && (
              <div className="absolute inset-0 bg-asphalt/85 flex flex-col items-center justify-center pointer-events-none z-30 select-none animate-fade-in" id="starting-countdown-overlay">
                {/* 3-Gantry Starting Lights */}
                <div className="arcade-panel flex items-center gap-4 px-6 py-3 mb-6">
                  {/* Light 1: Red / Ready */}
                  <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 ${
                    countdownVal === '3' || countdownVal === '2' || countdownVal === '1' || countdownVal === 'GO!'
                      ? 'bg-danger border-danger animate-beacon-glow'
                      : 'bg-steel border-edge opacity-40'
                  }`}></div>

                  {/* Light 2: Amber / Set */}
                  <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 ${
                    countdownVal === '2' || countdownVal === '1' || countdownVal === 'GO!'
                      ? 'bg-primary border-primary animate-beacon-glow'
                      : 'bg-steel border-edge opacity-40'
                  }`}></div>

                  {/* Light 3: Green / Go */}
                  <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 ${
                    countdownVal === '1' || countdownVal === 'GO!'
                      ? 'bg-go border-go animate-beacon-glow'
                      : 'bg-steel border-edge opacity-40'
                  }`}></div>
                </div>

                {/* Big Animated Countdown Digits */}
                <div key={countdownVal} className="flex flex-col items-center animate-countdown-pop">
                  <div className={`hud-number text-8xl sm:text-9xl font-bold font-display ${
                    countdownVal === 'GO!'
                      ? 'text-go'
                      : countdownVal === '1'
                        ? 'text-primary'
                        : countdownVal === '2'
                          ? 'text-secondary'
                          : 'text-text'
                  }`}>
                    {countdownVal}
                  </div>
                  <div className="mt-2 text-lg sm:text-2xl font-bold font-display text-text">
                    {countdownSubtext}
                  </div>
                </div>

                {/* Quick Reminder */}
                <div className="mt-8 px-5 py-2.5 rounded-ui bg-asphalt border border-edge text-muted text-xs flex items-center gap-3">
                  <span>Steer: <strong className="text-text">A / D or ← / →</strong></span>
                  <span className="text-edge">•</span>
                  <span>Nitro: <strong className="text-text">hold W / ↑ / Space</strong></span>
                </div>
              </div>
            )}

            {/* --- OVERLAY: PAUSED SCREEN --- */}
            {paused && gameState === 'playing' && !needsRotate && (
              <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-auto" id="paused-screen-overlay">
                <div className="arcade-panel max-w-md w-full animate-fade-in p-6">
                  <h2 className="text-4xl sm:text-5xl font-bold text-text font-display">
                    Paused
                  </h2>
                  <p className="mt-1 text-muted text-sm font-semibold font-body">
                    Engine idling
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-ui bg-asphalt border border-edge">
                      <div className="text-xs text-muted font-semibold">Distance</div>
                      <div className="hud-number text-xl font-bold text-text font-display">{score} m</div>
                    </div>
                    <div className="p-3 rounded-ui bg-asphalt border border-edge">
                      <div className="text-xs text-muted font-semibold">Speed</div>
                      <div className="hud-number text-xl font-bold text-speed font-display">{Math.round(speed * 6.5)} km/h</div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex flex-col gap-2.5">
                    <button 
                      onClick={() => setPaused(false)}
                      className="arcade-button w-full py-3.5 bg-primary text-asphalt font-bold cursor-pointer text-sm font-display flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" /> Resume
                    </button>
                    <button 
                      onClick={restartGame}
                      className="arcade-button w-full py-3 bg-steel text-text font-semibold cursor-pointer text-sm font-body flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restart
                    </button>
                    <button 
                      onClick={() => setShowHelpModal(true)}
                      className="arcade-button w-full py-2.5 bg-steel text-muted font-semibold cursor-pointer text-sm font-body flex items-center justify-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Game guide
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- OVERLAY: MAIN MENU (PLAY always visible, no scrolling) --- */}
            {gameState === 'title' && (
              <div
                className="absolute inset-0 bg-asphalt/85 flex flex-col items-center justify-center text-center z-10 overflow-y-auto safe-pad-t safe-pad-b"
                id="title-screen-overlay"
              >
                <div className="w-full max-w-sm flex flex-col items-center gap-3 px-4">

                  {/* Audio toggle and driver name (moved out of the removed nav bar) */}
                  <div className="w-full flex items-center justify-between gap-2">
                    <button
                      className="arcade-button p-2 bg-steel border-edge text-muted cursor-pointer flex items-center justify-center"
                      onClick={() => setMuted(!muted)}
                      title={muted ? "Unmute audio" : "Mute audio"}
                      id="audio-toggle"
                    >
                      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    {isEditingName ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value.toUpperCase())}
                          className="bg-asphalt border border-edge text-xs px-2 py-1 rounded-ui text-text w-24 focus:outline-none"
                          maxLength={12}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveUsername();
                            if (e.key === 'Escape') setIsEditingName(false);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={handleSaveUsername}
                          className="text-xs font-semibold text-asphalt bg-primary px-2 py-1 rounded-ui cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div
                        className="text-xs font-semibold text-muted cursor-pointer flex items-center gap-1"
                        onClick={() => {
                          setNameInput(username);
                          setIsEditingName(true);
                        }}
                        title="Edit driver name"
                      >
                        <span>{username}</span>
                        <span className="text-[10px] opacity-60 font-normal">(edit)</span>
                      </div>
                    )}
                  </div>

                  <div className="inline-block px-3 py-1 rounded-ui bg-steel border border-edge text-muted text-xs font-semibold">
                    3D highway traffic racer
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-bold text-text font-display">
                    Neon Rush 3D
                  </h1>

                  {highScore > 0 && (
                    <div className="text-primary text-sm font-semibold flex items-center gap-1.5">
                      <Trophy className="w-4 h-4" /> Best distance: {highScore}m
                    </div>
                  )}

                  <div className="w-full flex flex-col gap-3 mt-2">
                    <button
                      onClick={startGame}
                      className="arcade-button w-full min-h-14 px-6 py-4 bg-primary text-asphalt font-bold text-lg font-display cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      id="btn-engage-engine"
                    >
                      <Play className="w-6 h-6 fill-current" /> Play
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setGarageOpen(true)}
                        className="arcade-button min-h-12 px-4 py-3 bg-steel border-edge text-text font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
                        id="btn-garage"
                      >
                        <Car className="w-4 h-4" /> Garage
                      </button>
                      <button
                        onClick={() => setShowHelpModal(true)}
                        className="arcade-button min-h-12 px-4 py-3 bg-steel border-edge text-text font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
                        id="btn-how-to-play"
                      >
                        <HelpCircle className="w-4 h-4" /> How to play
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center p-6 text-center z-10" id="gameover-screen-overlay">
                <div className="arcade-panel max-w-md w-full animate-fade-in p-6">
                  <h2 className="text-3xl sm:text-5xl font-bold text-danger font-display">
                    Race over
                  </h2>
                  <p className="mt-1 text-muted text-sm font-semibold font-body">
                    Vehicle collision
                  </p>

                  <div className="mt-5 p-5 rounded-ui bg-asphalt border border-edge relative">
                    <div className="text-sm text-muted font-semibold">Distance</div>
                    <div className="hud-number text-4xl font-bold text-text font-display mt-1">
                      {score} M
                    </div>
                    
                    {score >= highScore && score > 0 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-asphalt text-xs font-bold px-3 py-1 rounded-ui border border-asphalt">
                        New best
                      </span>
                    )}

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-edge text-sm font-body">
                      <div className="text-left text-muted">
                        Cars dodged: <strong className="hud-number text-secondary">{dodgeCount}</strong>
                      </div>
                      <div className="text-right text-muted">
                        Best distance: <strong className="hud-number text-primary">{highScore}m</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
                    <button 
                      onClick={restartGame}
                      className="arcade-button w-full sm:w-auto px-8 py-3.5 bg-primary text-asphalt font-bold cursor-pointer text-sm font-display flex items-center justify-center gap-2"
                      id="btn-re-engage"
                    >
                      <RotateCcw className="w-4 h-4" /> Play again
                    </button>
                    <button 
                      onClick={() => setGameState('title')}
                      className="arcade-button w-full sm:w-auto px-6 py-3.5 bg-steel text-text font-semibold cursor-pointer text-sm font-body"
                    >
                      Main menu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- ON-SCREEN CONTROLS: STEER & NITRO BOOST --- */}
            {gameState === 'playing' && (
              <div 
                key="on-screen-steering-controls"
                className="absolute inset-x-0 bottom-3 sm:bottom-6 px-3 sm:px-8 flex justify-between items-center pointer-events-none z-10 select-none animate-hud-slide-bottom" 
                id="on-screen-steering"
              >
                
                {/* Left Steer Button */}
                <button 
                  className="arcade-button pointer-events-auto h-13 sm:h-16 px-4 sm:px-6 rounded-ui bg-steel border-edge flex items-center gap-2 text-text cursor-pointer active:scale-95"
                  onClick={() => gameLoopRef.current?.changeLaneLeft()}
                  title="Steer left (A or ←)"
                  id="ctrl-steer-left"
                >
                  <ArrowLeft className="w-6 h-6 text-secondary" />
                  <div className="text-left hidden sm:flex flex-col">
                    <span className="text-xs font-bold font-display">Left</span>
                    <span className="text-[10px] text-muted">A / ←</span>
                  </div>
                </button>

                {/* Nitro Boost Button */}
                <button
                  className={`arcade-button pointer-events-auto relative overflow-hidden h-14 sm:h-16 px-5 sm:px-10 rounded-ui flex items-center gap-2 sm:gap-3 cursor-pointer select-none active:scale-95 ${
                    isBoosting
                      ? 'bg-primary border-primary text-asphalt'
                      : boostFuel > 15
                        ? 'bg-steel border-edge text-text'
                        : 'bg-steel border-edge text-muted'
                  }`}
                  onPointerDown={() => gameLoopRef.current?.setBoost(true)}
                  onPointerUp={() => gameLoopRef.current?.setBoost(false)}
                  onPointerLeave={() => gameLoopRef.current?.setBoost(false)}
                  onTouchStart={(e) => { e.preventDefault(); gameLoopRef.current?.setBoost(true); }}
                  onTouchEnd={(e) => { e.preventDefault(); gameLoopRef.current?.setBoost(false); }}
                  title="Hold for nitro speed boost (W / ↑ / Shift / Space)"
                  id="ctrl-nitro-boost"
                >
                  {/* Fuel gauge fill inside button */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-secondary/40 pointer-events-none transition-all duration-150"
                    style={{ width: `${boostFuel}%` }}
                  ></div>

                  <Flame className={`w-6 h-6 sm:w-7 sm:h-7 relative z-10 ${isBoosting ? 'text-asphalt' : 'text-primary'}`} />
                  <div className="text-left relative z-10 flex flex-col">
                    <span className="text-xs sm:text-sm font-bold font-display">
                      {isBoosting ? 'Boosting' : 'Nitro'}
                    </span>
                    <span className="text-[10px] text-muted">
                      Hold W / ↑ ({boostFuel}%)
                    </span>
                  </div>
                </button>

                {/* Right Steer Button */}
                <button 
                  className="arcade-button pointer-events-auto h-13 sm:h-16 px-4 sm:px-6 rounded-ui bg-steel border-edge flex items-center gap-2 text-text cursor-pointer active:scale-95"
                  onClick={() => gameLoopRef.current?.changeLaneRight()}
                  title="Steer right (D or →)"
                  id="ctrl-steer-right"
                >
                  <div className="text-right hidden sm:flex flex-col">
                    <span className="text-xs font-bold font-display">Right</span>
                    <span className="text-[10px] text-muted">D / →</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-secondary" />
                </button>
              </div>
            )}

          </div>
        </section>

      {/* --- GARAGE OVERLAY (temporary car picker; real Garage arrives in Step 7) --- */}
      {garageOpen && (
        <div className="absolute inset-0 z-40 bg-asphalt flex flex-col safe-pad-t safe-pad-b" id="garage-overlay">
          <div className="flex items-center justify-between p-4 border-b border-edge shrink-0">
            <h2 className="text-lg font-bold font-display text-text">Garage</h2>
            <button
              onClick={() => setGarageOpen(false)}
              className="arcade-button min-h-12 px-4 py-2 bg-steel border-edge text-text font-semibold text-sm cursor-pointer flex items-center gap-2"
              id="garage-back-btn"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 border-b border-edge pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold text-primary">Active vehicle</h3>
            </div>
          </div>

          {/* Vehicle Silhouette Preview */}
          <div className="mb-6">
            <div className="aspect-video bg-steel-light border border-edge rounded-ui flex flex-col items-center justify-center p-3 relative overflow-hidden">
              {/* Procedural SVG Silhouette tailored to the active vehicle */}
              <div className="relative z-10 w-full flex items-center justify-center py-2">
                <svg viewBox="0 0 260 90" className="w-48 h-auto overflow-visible">
                  {/* Underglow Ground Reflection */}
                  <ellipse cx="130" cy="74" rx="90" ry="8" fill={`#${activeVehicle.underglow.toString(16).padStart(6, '0')}`} opacity="0.35" />
                  
                  {/* Wheel Wells / Wheels */}
                  <g className="fill-asphalt" stroke={`#${activeVehicle.underglow.toString(16).padStart(6, '0')}`} strokeWidth="2">
                    {/* Front Wheel */}
                    <circle cx="200" cy="65" r="14" />
                    <circle cx="200" cy="65" r="6" fill={`#${activeVehicle.underglow.toString(16).padStart(6, '0')}`} />
                    {/* Rear Wheel */}
                    <circle cx="65" cy="65" r="14" />
                    <circle cx="65" cy="65" r="6" fill={`#${activeVehicle.underglow.toString(16).padStart(6, '0')}`} />
                  </g>

                  {/* Main Car Chassis / Aerodynamic Body Contour */}
                  <path 
                    d={
                      activeVehicle.id === 'titan' 
                        ? "M 20 62 L 35 34 L 115 28 L 175 28 L 225 45 L 245 62 L 20 62 Z" 
                        : activeVehicle.id === 'blade'
                        ? "M 15 62 L 50 48 L 100 24 L 160 24 L 230 52 L 248 62 L 15 62 Z"
                        : activeVehicle.id === 'glide'
                        ? "M 20 62 L 45 42 L 105 32 L 165 32 L 225 54 L 245 62 L 20 62 Z"
                        : "M 18 62 L 40 46 L 95 36 L 165 36 L 225 50 L 246 62 L 18 62 Z"
                    }
                    fill={`rgba(${(activeVehicle.color >> 16) & 255}, ${(activeVehicle.color >> 8) & 255}, ${activeVehicle.color & 255}, 0.3)`}
                    stroke={`#${activeVehicle.underglow.toString(16).padStart(6, '0')}`}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Glass Cockpit Canopy */}
                  <path 
                    d={
                      activeVehicle.id === 'titan' 
                        ? "M 95 38 L 125 30 L 170 30 L 185 40 Z" 
                        : activeVehicle.id === 'blade'
                        ? "M 85 36 L 115 26 L 155 26 L 175 40 Z"
                        : activeVehicle.id === 'glide'
                        ? "M 90 42 L 120 34 L 160 34 L 178 44 Z"
                        : "M 88 44 L 118 36 L 168 36 L 182 46 Z"
                    }
                    className="fill-secondary stroke-secondary"
                    fillOpacity="0.25"
                    strokeWidth="1.5"
                  />

                  {/* Rear Aero Spoiler / Wing */}
                  {activeVehicle.id !== 'titan' && (
                    <g stroke={`#${activeVehicle.underglow.toString(16).padStart(6, '0')}`} strokeWidth="2">
                      <line x1="28" y1="52" x2="35" y2="42" />
                      <line x1="20" y1="42" x2="48" y2="42" strokeWidth="3" />
                    </g>
                  )}

                  {/* Twin Exhaust Afterburners */}
                  <circle cx="16" cy="58" r="3" className="fill-primary" />
                  <line x1="2" y1="58" x2="16" y2="58" className="stroke-primary" strokeWidth="2" strokeDasharray="2,2" />

                  {/* Headlight Ray */}
                  <polygon points="246,58 265,54 265,66" className="fill-text" opacity="0.6" />
                </svg>
              </div>

              {/* Corner metadata badges */}

              <div className="absolute bottom-2 left-2 text-[10px] text-muted flex items-center gap-2">
                <span>ID: {activeVehicle.id}</span>
                <span className="text-edge">•</span>
                <span>Class: {activeVehicle.role}</span>
              </div>
            </div>

            {/* Vehicle Meta Headers */}
            <div className="flex justify-between items-end mt-4">
              <div>
                <h4 className="text-lg font-bold font-display text-text">{activeVehicle.name}</h4>
                <div className="text-xs text-muted mt-0.5 font-semibold">
                  Role: {activeVehicle.role}
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 font-bold bg-steel-light text-text border border-edge rounded-ui">
                {activeVehicle.mark}
              </span>
            </div>
            
            <p className="text-xs text-muted mt-2.5 leading-relaxed font-body border-b border-edge pb-4 min-h-[48px]">
              {activeVehicle.description}
            </p>

            {/* Spec Sliders */}
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-muted">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-secondary" /> Speed</span>
                  <span className="text-secondary font-bold">{activeVehicle.velocity}%</span>
                </div>
                <div className="h-1.5 w-full bg-asphalt rounded-ui overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-ui transition-all duration-500" 
                    style={{ width: `${activeVehicle.velocity}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-muted">
                  <span className="flex items-center gap-1"><Compass className="w-3 h-3 text-primary" /> Handling</span>
                  <span className="text-primary font-bold">{activeVehicle.agility}%</span>
                </div>
                <div className="h-1.5 w-full bg-asphalt rounded-ui overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-ui transition-all duration-500" 
                    style={{ width: `${activeVehicle.agility}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-muted">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-text" /> Armour</span>
                  <span className="text-text font-bold">{activeVehicle.resilience}%</span>
                </div>
                <div className="h-1.5 w-full bg-asphalt rounded-ui overflow-hidden">
                  <div 
                    className="h-full bg-text rounded-ui transition-all duration-500" 
                    style={{ width: `${activeVehicle.resilience}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Selection List */}
          <div className="mt-auto border-t border-edge pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted font-semibold flex items-center gap-1">
                <Car className="w-3 h-3" /> Select car
              </span>
              <span className="text-[10px] text-muted">Tap to equip</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {VEHICLES.map((vehicle) => {
                const isActive = selectedVehicleId === vehicle.id;
                return (
                  <button
                    key={vehicle.id}
                    onClick={() => handleSelectVehicle(vehicle.id)}
                    className={`p-2.5 rounded-ui border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive 
                        ? 'bg-secondary/20 border-secondary text-text' 
                        : 'bg-steel border-edge text-muted hover:text-text'
                    }`}
                    id={`garage-btn-${vehicle.id}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold font-display text-text">{vehicle.name}</span>
                      {isActive && (
                        <span className="text-[10px] bg-primary text-asphalt px-1.5 py-0.5 rounded-ui font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted mt-0.5">{vehicle.role}</span>
                    <div className="flex justify-between text-[10px] text-muted mt-1 pt-1 border-t border-edge">
                      <span>Top: {vehicle.topSpeedLabel}</span>
                      <span>Handling: {vehicle.handlingLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          </div>
        </div>
      )}

      {/* --- ROTATE TO LANDSCAPE OVERLAY --- */}
      {needsRotate && (
        <div className="absolute inset-0 z-50 bg-asphalt flex flex-col items-center justify-center text-center p-6 safe-pad-t safe-pad-b" id="rotate-overlay">
          <RotateCcw className="w-12 h-12 text-secondary mb-4" />
          <h2 className="text-2xl font-bold font-display text-text">Rotate your phone</h2>
          <p className="text-muted text-sm mt-2 font-body">Neon Rush plays in landscape.</p>
        </div>
      )}

      {/* ---------- HOW TO PLAY MODAL (USER FRIENDLY GUIDE) ---------- */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-asphalt/95 flex items-center justify-center p-4">
          <div className="arcade-panel max-w-lg w-full p-6 text-text relative max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Close button */}
            <button
              onClick={() => setShowHelpModal(false)}
              className="arcade-button absolute top-4 right-4 p-2 bg-steel border-edge text-muted cursor-pointer"
              title="Close guide"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2 text-text">
              <HelpCircle className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-bold font-display">How to play</h2>
            </div>
            <p className="text-xs text-muted font-body border-b border-edge pb-3">
              Neon Rush 3D is a highway traffic racer. Switch lanes and manage nitro to survive:
            </p>

            <div className="space-y-3.5 mt-4 text-xs font-body">
              {/* Concept */}
              <div className="p-3.5 rounded-ui bg-steel border border-edge">
                <div className="text-sm font-bold text-text font-display mb-1 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-secondary" /> 1. Game concept
                </div>
                <p className="text-muted leading-relaxed">
                  Drive your racer along a highway that cycles through coastal roads, countryside and city streets. <strong className="text-text">Traffic appears right from the start.</strong> Dodge cars moving at different speeds to cover the most distance without crashing.
                </p>
              </div>

              {/* Controls */}
              <div className="p-3.5 rounded-ui bg-steel border border-edge">
                <div className="text-sm font-bold text-text font-display mb-1 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-primary" /> 2. Controls
                </div>
                <ul className="space-y-2 text-muted mt-2">
                  <li className="flex items-center justify-between text-xs">
                    <span className="text-text">Steer left / right:</span>
                    <span className="text-secondary bg-asphalt px-2.5 py-1 rounded-ui border border-edge font-bold">A / D or ← / →</span>
                  </li>
                  <li className="flex items-center justify-between text-xs">
                    <span className="text-text">Nitro boost:</span>
                    <span className="text-primary bg-asphalt px-2.5 py-1 rounded-ui border border-edge font-bold">Hold W / ↑ / Space</span>
                  </li>
                  <li className="flex items-center justify-between text-xs">
                    <span className="text-text">Pause / resume:</span>
                    <span className="text-text bg-asphalt px-2.5 py-1 rounded-ui border border-edge">P key</span>
                  </li>
                  <li className="flex items-center justify-between text-xs">
                    <span className="text-text">Touch controls:</span>
                    <span className="text-text bg-asphalt px-2.5 py-1 rounded-ui border border-edge">On-screen buttons</span>
                  </li>
                </ul>
              </div>

              {/* Boost Mechanic */}
              <div className="p-3.5 rounded-ui bg-steel border border-edge">
                <div className="text-sm font-bold text-text font-display mb-1 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-primary" /> 3. Nitro boost
                </div>
                <p className="text-muted leading-relaxed">
                  Hold down <strong className="text-text">W / ↑ / Space or the boost button</strong> to use nitro overdrive. You earn a <strong className="text-text">+80% score multiplier</strong>. Release it and the tank refills over time.
                </p>
              </div>

              {/* Vehicles */}
              <div className="p-3.5 rounded-ui bg-steel border border-edge">
                <div className="text-sm font-bold text-text font-display mb-1 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-secondary" /> 4. Choose your car
                </div>
                <p className="text-muted leading-relaxed">
                  Pick from 4 cars in the <strong className="text-text">Garage</strong>:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                  <div className="p-2 bg-asphalt rounded-ui border border-edge">
                    <strong className="text-text">VX-Titan:</strong> <span className="text-muted">Heavy armour, high stability</span>
                  </div>
                  <div className="p-2 bg-asphalt rounded-ui border border-edge">
                    <strong className="text-text">Neon-Blade:</strong> <span className="text-muted">Extreme top speed</span>
                  </div>
                  <div className="p-2 bg-asphalt rounded-ui border border-edge">
                    <strong className="text-text">Cyber-Glide:</strong> <span className="text-muted">Quick lane changes</span>
                  </div>
                  <div className="p-2 bg-asphalt rounded-ui border border-edge">
                    <strong className="text-text">BMW E34:</strong> <span className="text-muted">Retro cruiser, good drift</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="arcade-button mt-5 w-full py-3.5 bg-primary text-asphalt font-bold rounded-ui font-display text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Ready
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
