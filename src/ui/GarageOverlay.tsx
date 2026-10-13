/* ---------- GARAGE OVERLAY (Step 4 split) ----------
   Temporary car picker (the real Garage with upgrades arrives in Step 7).
   Step 2.9 layout: two columns, the preview stage fills the left column height,
   name/stats/car list on the right, Back in the top bar. Presentational only:
   the SVG silhouette is driven by the active vehicle's colour data. */
import { ArrowLeft, Car, Compass, Cpu, Shield, Zap } from 'lucide-react';
import { VEHICLES } from '../game/vehicles';
import type { Vehicle, VehicleId } from '../game/vehicles';

export type GarageOverlayProps = {
  activeVehicle: Vehicle;
  selectedVehicleId: VehicleId;
  onClose: () => void;
  onSelectVehicle: (id: VehicleId) => void;
};

function hex(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

function rgb(color: number): string {
  return `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255}, 0.3)`;
}

function CarSilhouette({ vehicle }: { vehicle: Vehicle }) {
  const accent = hex(vehicle.underglow);

  const body =
    vehicle.id === 'titan'
      ? 'M 20 62 L 35 34 L 115 28 L 175 28 L 225 45 L 245 62 L 20 62 Z'
      : vehicle.id === 'blade'
        ? 'M 15 62 L 50 48 L 100 24 L 160 24 L 230 52 L 248 62 L 15 62 Z'
        : vehicle.id === 'glide'
          ? 'M 20 62 L 45 42 L 105 32 L 165 32 L 225 54 L 245 62 L 20 62 Z'
          : 'M 18 62 L 40 46 L 95 36 L 165 36 L 225 50 L 246 62 L 18 62 Z';

  const canopy =
    vehicle.id === 'titan'
      ? 'M 95 38 L 125 30 L 170 30 L 185 40 Z'
      : vehicle.id === 'blade'
        ? 'M 85 36 L 115 26 L 155 26 L 175 40 Z'
        : vehicle.id === 'glide'
          ? 'M 90 42 L 120 34 L 160 34 L 178 44 Z'
          : 'M 88 44 L 118 36 L 168 36 L 182 46 Z';

  return (
    <svg viewBox="0 0 260 90" className="w-48 h-auto overflow-visible">
      {/* Underglow Ground Reflection */}
      <ellipse cx="130" cy="74" rx="90" ry="8" fill={accent} opacity="0.35" />

      {/* Wheel Wells / Wheels */}
      <g className="fill-asphalt" stroke={accent} strokeWidth="2">
        {/* Front Wheel */}
        <circle cx="200" cy="65" r="14" />
        <circle cx="200" cy="65" r="6" fill={accent} />
        {/* Rear Wheel */}
        <circle cx="65" cy="65" r="14" />
        <circle cx="65" cy="65" r="6" fill={accent} />
      </g>

      {/* Main Car Chassis / Aerodynamic Body Contour */}
      <path d={body} fill={rgb(vehicle.color)} stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />

      {/* Glass Cockpit Canopy */}
      <path
        d={canopy}
        className="fill-secondary stroke-secondary"
        fillOpacity="0.25"
        strokeWidth="1.5"
      />

      {/* Rear Aero Spoiler / Wing */}
      {vehicle.id !== 'titan' && (
        <g stroke={accent} strokeWidth="2">
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
  );
}

export function GarageOverlay({ activeVehicle, selectedVehicleId, onClose, onSelectVehicle }: GarageOverlayProps) {
  return (
    <div className="absolute inset-0 z-40 h-dvh bg-asphalt flex flex-col safe-pad-t safe-pad-b safe-pad-l safe-pad-r" id="garage-overlay">
      <div className="flex items-center justify-between py-2 px-3 sm:px-4 border-b border-edge shrink-0">
        <h2 className="text-lg font-bold font-display text-text">Garage</h2>
        <button
          onClick={onClose}
          className="arcade-button min-h-12 px-4 py-2 bg-steel border-edge text-text font-semibold text-sm cursor-pointer flex items-center gap-2"
          id="garage-back-btn"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
      {/* Step 2.9: the wrapper must be a flex column with min-h-0, otherwise the
          content-sized block row pushes the overlay past the viewport height and
          the whole garage starts scrolling on short phone screens. */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 flex flex-col">
        <div className="flex-1 min-h-0 flex flex-col sm:flex-row gap-3 sm:gap-4">

          {/* Left column: large preview stage that fills the available height */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-between mb-2 border-b border-edge pb-2 shrink-0">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-primary">Active vehicle</h3>
              </div>
            </div>

            {/* Vehicle Silhouette Preview - centred inside the stage */}
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <div className="h-full max-h-full aspect-video max-w-full bg-steel-light border border-edge rounded-ui flex flex-col items-center justify-center p-3 relative overflow-hidden">
                <div className="relative z-10 w-full flex items-center justify-center py-2">
                  <CarSilhouette vehicle={activeVehicle} />
                </div>

                <div className="absolute bottom-2 left-2 text-[0.625rem] text-muted flex items-center gap-2">
                  <span>ID: {activeVehicle.id}</span>
                  <span className="text-edge">•</span>
                  <span>Class: {activeVehicle.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: car name, stats and the car list */}
          <div className="w-full sm:w-[26rem] shrink-0 flex flex-col gap-3 min-h-0 overflow-y-auto overscroll-contain">

            {/* Vehicle Meta Headers */}
            <div className="flex justify-between items-end shrink-0">
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

            <p className="text-xs text-muted leading-relaxed font-body border-b border-edge pb-3">
              {activeVehicle.description}
            </p>

            {/* Spec Sliders */}
            <div className="space-y-3">
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

            {/* Vehicle Selection List */}
            <div className="border-t border-edge pt-3 shrink-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-muted font-semibold flex items-center gap-1">
                  <Car className="w-3 h-3" /> Select car
                </span>
                <span className="text-[0.625rem] text-muted">Tap to equip</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLES.map((vehicle) => {
                  const isActive = selectedVehicleId === vehicle.id;
                  return (
                    <button
                      key={vehicle.id}
                      onClick={() => onSelectVehicle(vehicle.id)}
                      className={`min-h-12 p-2.5 rounded-ui border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'bg-secondary/20 border-secondary text-text'
                          : 'bg-steel border-edge text-muted hover:text-text'
                      }`}
                      id={`garage-btn-${vehicle.id}`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold font-display text-text">{vehicle.name}</span>
                        {isActive && (
                          <span className="text-[0.625rem] bg-primary text-asphalt px-1.5 py-0.5 rounded-ui font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[0.625rem] text-muted mt-0.5">{vehicle.role}</span>
                      <div className="flex justify-between text-[0.625rem] text-muted mt-1 pt-1 border-t border-edge">
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
      </div>
    </div>
  );
}

export default GarageOverlay;