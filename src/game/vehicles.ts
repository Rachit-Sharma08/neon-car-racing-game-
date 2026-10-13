/* ---------- VEHICLE DEFINITIONS (Step 4 split) ---------- */
export type VehicleId = 'titan' | 'blade' | 'glide' | 'bmw';

export interface Vehicle {
  id: VehicleId;
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

export const VEHICLES: readonly Vehicle[] = [
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
/* SpeedRadialGauge removed in Step 2.9 cleanup: unused, the HUD shows digits. */
