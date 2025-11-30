import React from 'react';

interface SunFlareProps {
  sunPosition: number;
  distanceAU: number;
}

const SunFlare: React.FC<SunFlareProps> = ({ sunPosition, distanceAU }) => {
  // Logic: 
  // The user requested the flare be enabled during "day-time".
  // sunPosition 180 = Noon (Day) -> Max Visibility
  // sunPosition 0 = Midnight (Night) -> Invisible
  
  // Normalize sunPosition (0 to 180) to opacity (0 to 1)
  const normalizedPos = Math.max(0, Math.min(180, sunPosition));
  const dayIntensity = normalizedPos / 180;

  // Calculate distance falloff
  // Use 1/sqrt(distance) to simulate light intensity drop-off while keeping it visible for UI purposes.
  // Mercury (0.39) -> ~1.6 (Brighter)
  // Earth (1.0) -> 1.0 (Baseline)
  // Neptune (30.0) -> ~0.18 (Dimmer)
  const distanceFalloff = 1 / Math.sqrt(Math.max(0.1, distanceAU));

  // Combine factors
  // We allow opacity to go slightly above 1 for inner planets (clamped by CSS opacity usually, but good for logic)
  // and drop lower for outer planets.
  let combinedIntensity = dayIntensity * distanceFalloff;
  
  // Apply a power curve for smoother visual falloff
  const opacity = Math.min(1, Math.pow(combinedIntensity, 1.2));

  return (
    <div 
      className="fixed inset-y-0 left-0 w-1/2 z-0 pointer-events-none transition-opacity duration-1000 ease-in-out"
      style={{ opacity }}
    >
       {/* Main Orange/Yellow Heat Haze */}
       <div 
         className="absolute top-0 bottom-0 left-0 w-full"
         style={{
           background: 'radial-gradient(ellipse at left center, rgba(255, 140, 0, 0.15) 0%, rgba(255, 69, 0, 0.05) 40%, transparent 70%)'
         }}
       />

       {/* Intense Core Glow */}
       <div 
         className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[800px] bg-yellow-200 blur-[100px] opacity-40 mix-blend-screen"
       />

       {/* Heat Radiation Rays */}
       <div 
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/20 to-transparent blur-[60px] rounded-full mix-blend-overlay"
       />
    </div>
  );
};

export default SunFlare;