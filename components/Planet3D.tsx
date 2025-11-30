import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Planet, Moon } from '../types';

interface Planet3DProps {
  planet: Planet;
  sunPosition: number; // 0 to 360 degrees
  lastLaunch: { planetId: string; timestamp: number } | null; // Launch data with ID check
  isMarsTerraformed?: boolean;
  onMoonClick?: (moon: Moon) => void;
  viewingMoon?: boolean;
}

const Planet3D: React.FC<Planet3DProps> = ({ 
  planet, 
  sunPosition, 
  lastLaunch, 
  isMarsTerraformed,
  onMoonClick,
  viewingMoon
}) => {
  const [isRocketActive, setIsRocketActive] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for manual texture rotation control
  const autoRotateRef = useRef(0);
  const baseTextureRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const terraformTopRef = useRef<HTMLDivElement>(null);
  const terraformBottomRef = useRef<HTMLDivElement>(null);

  // Handle Zoom via Scroll Wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Sensitivity: 0.001 per pixel. Typical wheel tick is ~100px.
      // Negative deltaY is scrolling up (Zoom In).
      const delta = -e.deltaY * 0.001; 
      setZoom(prev => Math.min(2, Math.max(1, prev + delta)));
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // Calculate flight physics based on mass
  const { flightDuration, revolutions } = useMemo(() => {
    const massValue = parseFloat(planet.mass.replace(/[^0-9.]/g, '')) || 1;
    
    // Logic:
    // Massive planets (Jupiter > 300, Saturn > 90) -> Strong Gravity -> Crash fast, barely orbit.
    // Medium planets (Earth 1, Neptune 17) -> Standard Gravity -> 1.5 orbits.
    // Light planets (Mercury 0.05, Pluto 0.002) -> Weak Gravity -> Multiple orbits.
    
    let dur = 10;
    let revs = 1.5;

    if (massValue > 50) {
      dur = 5;
      revs = 0.7; // Less than one orbit
    } else if (massValue > 0.2) {
      dur = 10;
      revs = 1.5; // 1.5 orbits
    } else {
      dur = 15;
      revs = 3.5; // 3.5 orbits
    }

    return { flightDuration: dur, revolutions: revs };
  }, [planet.mass]);

  const MARS_TEXTURE_URL = "https://raw.githubusercontent.com/yuriyy/solar-system/master/public/img/mars.jpg";

  // 1. Calculate Dynamic Size based on Planet Diameter
  const planetSize = useMemo(() => {
    // Parse diameter string "12,742 km" -> 12742
    const diameter = parseFloat(planet.diameter.replace(/[^0-9.]/g, '')) || 12742;
    const earthDiameter = 12742;
    
    // Calculate ratio relative to Earth
    const ratio = diameter / earthDiameter;
    
    // Apply a power curve to compress the scale. 
    const visualScale = Math.pow(ratio, 0.3);
    
    // Base size for Earth in pixels (Desktop)
    const baseSize = 300; 
    
    // Clamp size to prevent extremes (Min 180px, Max 580px)
    return Math.max(180, Math.min(baseSize * visualScale, 580));
  }, [planet.diameter]);

  // Generate Unique Surface Texture (Mesh) based on planet type
  const { uniqueTerrainSvg, terrainOpacity } = useMemo(() => {
    let baseFreq = '0.02';
    let numOctaves = '3';
    let type = 'fractalNoise';
    let opacity = 0.3;
    let seed = 0;
    
    // Generate a consistent seed from name
    for(let i=0; i<planet.id.length; i++) seed += planet.id.charCodeAt(i);

    switch(planet.id) {
        // Rocky / Cratered Worlds
        case 'mercury':
        case 'moon':
        case 'pluto':
            baseFreq = '0.25'; // High frequency = distinct craters
            numOctaves = '4';
            opacity = 0.5; // Visible roughness
            break;
        
        // Terrestrial / Tectonic Worlds
        case 'mars':
        case 'venus':
             baseFreq = '0.04'; // Mid frequency = mountains/continents
             numOctaves = '3';
             opacity = 0.3; // Subtler to let texture show continents
             break;

        case 'earth':
             baseFreq = '0.04'; 
             numOctaves = '3';
             opacity = 0.15; // Much lower opacity for Earth to let continents/oceans shine through
             break;
        
        // Gas Giants (Banded)
        case 'jupiter':
        case 'saturn':
             baseFreq = '0.003 0.06'; // Stretched X axis = Bands
             type = 'turbulence';
             numOctaves = '5';
             opacity = 0.25; 
             break;
        
        // Ice Giants (Fluid)
        case 'uranus':
        case 'neptune':
             baseFreq = '0.008 0.02'; // Soft flow
             type = 'turbulence';
             opacity = 0.2; 
             break;
    }

    // Override for Terraformed Mars to look more Earth-like
    if (planet.id === 'mars' && isMarsTerraformed) {
        baseFreq = '0.04';
        type = 'fractalNoise';
        opacity = 0.3;
    }

    // Use a 2:1 aspect ratio viewBox (400x200) to match the equirectangular map projection
    // This prevents the noise from stretching horizontally when applied to the sphere.
    // Enhanced filter chain for more contrast in topography
    const svg = `data:image/svg+xml,%3Csvg viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='mesh${planet.id}'%3E%3CfeTurbulence type='${type}' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' seed='${seed}' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23mesh${planet.id})' opacity='1'/%3E%3C/svg%3E`;

    return { uniqueTerrainSvg: svg, terrainOpacity: opacity };
  }, [planet.id, isMarsTerraformed]);

  useEffect(() => {
    // Only activate rocket if the launch event matches the current planet ID
    // AND we are not viewing a moon (assuming launches are for main planets for now)
    if (lastLaunch && lastLaunch.planetId === planet.id && lastLaunch.timestamp > 0 && !viewingMoon) {
      setIsRocketActive(false);
      // Small delay to ensure re-trigger works if ID matches but timestamp is new
      setTimeout(() => setIsRocketActive(true), 10);
    }
  }, [lastLaunch, planet.id, viewingMoon]);

  // Combined Rotation Loop (Auto + Slider)
  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      // 1. Increment Auto Rotation
      autoRotateRef.current += 0.04; 

      // 2. Calculate Manual Offset from Sun Slider
      // Slider usually goes 180 (Day) -> 0 (Night). 
      // We map this range to a rotation offset so user can see different sides.
      // Scaling factor 0.5 means full slider range rotates planet by 90 "percent units" (approx 180 deg)
      const sliderOffset = (180 - sunPosition) * 0.5;

      const totalPos = autoRotateRef.current + sliderOffset;

      // 3. Apply to Refs
      if (baseTextureRef.current) {
        baseTextureRef.current.style.backgroundPositionX = `${totalPos}%`;
      }
      if (meshRef.current) {
        meshRef.current.style.backgroundPositionX = `${totalPos}%`;
      }
      if (cloudsRef.current) {
        // Parallax: Clouds move slightly faster
        cloudsRef.current.style.backgroundPositionX = `${totalPos * 1.15}%`;
      }
      if (terraformTopRef.current) {
        terraformTopRef.current.style.backgroundPositionX = `${totalPos}%`;
      }
      if (terraformBottomRef.current) {
        terraformBottomRef.current.style.backgroundPositionX = `${totalPos}%`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [sunPosition]);

  const handleAnimationEnd = () => {
    setIsRocketActive(false);
  };

  const getLightPosition = () => {
    const normalized = (sunPosition + 179) % 360;
    const percent = (normalized / 360) * 200 - 50; 
    return `${percent}%`;
  };

  const lightX = getLightPosition();
  const shadowOpacity = Math.abs(sunPosition - 180) / 180; 

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
      : '255, 255, 255';
  };
  const rgb = hexToRgb(planet.color);

  // Calculate lighting angles for dynamic shadows
  const sunIntensity = 1 - shadowOpacity;
  
  // Generate dynamic keyframes based on planet size
  const s = planetSize; 
  const R = s * 0.5; // Surface Radius
  const OrbitR = s * 0.75; // Orbit Radius (Altitude)

  // Calculate Launch Coordinates (0 degrees - Equator / Right Side)
  const actualLaunchAngle = 0; // Equator
  const actualLaunchRad = actualLaunchAngle * (Math.PI / 180);
  const actualLaunchX = Math.cos(actualLaunchRad) * R;
  const actualLaunchY = Math.sin(actualLaunchRad) * R;
  
  // Generate orbital path keyframes programmatically
  const generateOrbitKeyframes = () => {
    let frames = '';
    const totalOrbitSteps = Math.ceil(revolutions * 60); // 6 degree increments
    
    // LAUNCH PHASE (0% - 10%)
    const launchAngleDeg = actualLaunchAngle; 
    const launchRad = launchAngleDeg * (Math.PI / 180);
    const startX = Math.cos(launchRad) * R;
    const startY = Math.sin(launchRad) * R;
    const startRot = launchAngleDeg; // Pointing Radially Out (Right)

    // Initial State: At surface, scaled down
    frames += `0% { opacity: 0; transform: translate(${startX}px, ${startY}px) rotate(${startRot}deg) scale(0.4); }\n`; 
    frames += `1% { opacity: 1; transform: translate(${startX}px, ${startY}px) rotate(${startRot}deg) scale(0.6); }\n`;
    
    // 5% Mark: Reach 70% of Goal Altitude, but START ORBITING (curving) already.
    const alt70R = R + 0.7 * (OrbitR - R);
    
    // Curve UP (CCW) from 0deg (Equator). 
    // Go from 0 -> -15deg (Moving Upwards)
    const alt70Angle = launchAngleDeg - 15; 
    const alt70Rad = alt70Angle * (Math.PI / 180);
    const alt70X = Math.cos(alt70Rad) * alt70R;
    const alt70Y = Math.sin(alt70Rad) * alt70R;
    
    frames += `5% { transform: translate(${alt70X}px, ${alt70Y}px) rotate(${-45 + alt70Angle}deg) scale(0.6); }\n`;
    
    // 10% Mark: Reach Full Orbit Altitude (OrbitR)
    // Insertion Angle: e.g. -30deg (Top Right)
    const joinAngle = -30; 
    const joinRad = joinAngle * (Math.PI / 180);
    const joinX = Math.cos(joinRad) * OrbitR;
    const joinY = Math.sin(joinRad) * OrbitR;
    
    frames += `10% { transform: translate(${joinX}px, ${joinY}px) rotate(${-90 + joinAngle}deg) scale(0.6); }\n`;
    
    // ORBIT PHASE (10% - 85%)
    const startPct = 10;
    const endPct = 85;
    const pctRange = endPct - startPct;
    
    // Loop starts from joinAngle
    for (let i = 0; i <= totalOrbitSteps; i++) {
       const pct = startPct + (i / totalOrbitSteps) * pctRange;
       const angleDeg = joinAngle - (i * 6); // Continue counter-clockwise
       const angleRad = angleDeg * (Math.PI / 180);
       
       const x = Math.cos(angleRad) * OrbitR;
       const y = Math.sin(angleRad) * OrbitR;
       const rotation = angleDeg - 90; // Align tangent
       
       frames += `${pct}% { transform: translate(${x}px, ${y}px) rotate(${rotation}deg) scale(0.6); } \n`;
    }

    // LANDING PHASE (85% - 100%)
    // Calculate final position from orbit loop
    const finalStep = totalOrbitSteps;
    const finalAngleDeg = joinAngle - (finalStep * 6);
    const finalAngleRad = finalAngleDeg * (Math.PI / 180);
    
    const finalX = Math.cos(finalAngleRad) * OrbitR;
    const finalY = Math.sin(finalAngleRad) * OrbitR;
    const finalRot = finalAngleDeg - 90;

    // 85%: End of stable orbit
    frames += `85% { transform: translate(${finalX}px, ${finalY}px) rotate(${finalRot}deg) scale(0.6); opacity: 1; }\n`;
    
    // 92%: Bank Inward (Smooth Nose Dive Start)
    const turnAngleDeg = finalAngleDeg - 10;
    const turnAngleRad = turnAngleDeg * (Math.PI / 180);
    const turnX = Math.cos(turnAngleRad) * (OrbitR * 0.9);
    const turnY = Math.sin(turnAngleRad) * (OrbitR * 0.9);
    const turnRot = finalRot - 45;

    frames += `92% { transform: translate(${turnX}px, ${turnY}px) rotate(${turnRot}deg) scale(0.6); opacity: 0.9; }\n`;

    // 100%: Impact at Surface Radius with Fade
    const impactAngleDeg = finalAngleDeg - 25;
    const impactAngleRad = impactAngleDeg * (Math.PI / 180);
    const impactX = Math.cos(impactAngleRad) * R;
    const impactY = Math.sin(impactAngleRad) * R;
    const impactRot = turnRot - 45;

    frames += `100% { opacity: 0; transform: translate(${impactX}px, ${impactY}px) rotate(${impactRot}deg) scale(0.3); }`;

    return frames;
  };

  const orbitalCrashKeyframes = `
    @keyframes terraformSpread {
      0% { height: 0%; }
      100% { height: 50.5%; }
    }
    @keyframes orbitalCrash {
      ${generateOrbitKeyframes()}
    }
    @keyframes moonOrbit {
      0% { transform: rotate(0deg) translateX(${planetSize * 1.0}px) rotate(0deg); z-index: 5; }
      25% { z-index: 0; }
      50% { transform: rotate(180deg) translateX(${planetSize * 1.0}px) rotate(-180deg); z-index: 0; }
      75% { z-index: 5; }
      100% { transform: rotate(360deg) translateX(${planetSize * 1.0}px) rotate(-360deg); z-index: 5; }
    }
    @keyframes explosionFlash {
       0% { opacity: 1; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(0.5); }
       100% { opacity: 0; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(8); }
    }
    @keyframes explosionShockwave {
      0% { opacity: 0.9; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(0.2); border-width: 6px; border-color: rgba(255,255,255,1); }
      100% { opacity: 0; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(6); border-width: 0px; border-color: rgba(255, 100, 0, 0); }
    }
    @keyframes explosionCore {
      0% { opacity: 1; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(0.2); background: #ffffff; }
      15% { background: #fef08a; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(2.0); } 
      30% { background: #f97316; opacity: 1; } 
      50% { background: #ef4444; opacity: 0.8; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(3.0); } 
      75% { background: #7f1d1d; opacity: 0.5; } 
      100% { opacity: 0; transform: translate(${actualLaunchX + 20}px, ${actualLaunchY - 10}px) scale(4.0); background: #000; }
    }
    @keyframes explosionSmoke {
      0% { opacity: 0; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(0.5); }
      10% { opacity: 0.8; transform: translate(${actualLaunchX}px, ${actualLaunchY}px) scale(1.5); background: #333; }
      100% { opacity: 0; transform: translate(${actualLaunchX + 50}px, ${actualLaunchY}px) scale(4); background: #111; }
    }
    @keyframes fumeEmit {
      0% { opacity: 0; transform: translate(-50%, -8px) scale(0.2); }
      50% { opacity: 0.4; transform: translate(-50%, 0px) scale(0.6); }
      100% { opacity: 0; transform: translate(-50%, 25px) scale(1.5); }
    }
    @keyframes fumeEmitWide {
      0% { opacity: 0; transform: translate(-50%, -5px) scale(0.2); }
      40% { opacity: 0.3; transform: translate(-50%, 5px) scale(0.8) translateX(2px); }
      100% { opacity: 0; transform: translate(-50%, 30px) scale(2.0) translateX(-4px); }
    }
  `;

  // Determine texture layering for Mars Terraforming effect
  const isMars = planet.id === 'mars';
  const isEarth = planet.id === 'earth';
  const baseTexture = isMars ? MARS_TEXTURE_URL : planet.textureUrl;
  const overlayTexture = isMars && isMarsTerraformed ? planet.textureUrl : null;

  const isOriginalMars = isMars && !isMarsTerraformed;
  const isTerraformedMars = isMars && isMarsTerraformed;
  
  // Re-enable color tinting and brighten textures to replace "dark hue"
  // Boost brightness/contrast to make continents/features visible
  let textureFilter = 'contrast(1.2) saturate(1.3) brightness(1.3)';
  let tintOpacity = 0.2; // Gentle tint to show planet color
  let overlayOpacity = 0.2;

  if (isTerraformedMars) {
    textureFilter = 'grayscale(0) contrast(1.1) brightness(1.1)'; // No grayscale to let natural colors show
    tintOpacity = 0.05; // Reduced from 0.15 to minimal
    overlayOpacity = 0.05; // Reduced from 0.1 to minimal
  } else if (isOriginalMars) {
    // Make Mars very red and distinct
    textureFilter = 'contrast(1.2) saturate(1.2) brightness(1.1)';
    tintOpacity = 0.1;
    overlayOpacity = 0.2;
  } else if (isEarth) {
    // Earth specific settings to show continents and oceans clearly
    // Minimal tinting to prevent washing out the blue/green/white
    textureFilter = 'contrast(1.1) saturate(1.2) brightness(1.2)';
    tintOpacity = 0.05; // Very low tint
    overlayOpacity = 0.1; // Minimal overlay
  }

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-[400px] md:h-[600px] perspective-1000"
    >
      {/* Responsive Wrapper - Keeps mobile scaling */}
      <div className="relative transition-transform duration-1000 ease-out transform scale-75 md:scale-100">
        
        {/* User Zoom Wrapper & Planet Assembly */}
        <div 
          className="relative group transition-transform duration-300 ease-out"
          style={{ width: planetSize, height: planetSize, transform: `scale(${zoom})` }}
        >
          
          <div className="absolute inset-0 rounded-full z-10">
            
            {/* 1. Outer Atmosphere / Exosphere (Glow) */}
            <div 
              className="absolute inset-0 rounded-full transition-all duration-100 ease-out pointer-events-none"
              style={{
                 boxShadow: `
                   0 0 ${planetSize * 0.05}px rgba(${rgb}, ${0.8 + sunIntensity * 0.2}), 
                   0 0 ${planetSize * 0.25}px rgba(${rgb}, ${0.4 + sunIntensity * 0.3})
                 `,
                 opacity: 0.95 
              }}
            />

            {/* 2. Base Texture Layer Container */}
            <div 
              className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
              style={{ 
                transform: 'translateZ(0)',
                // Reduced shadow darkness to allow texture colors to pop
                boxShadow: `inset 10px 0px ${planetSize * 0.15}px rgba(0,0,0,0.4)` 
              }}
            >
               {/* Note: No CSS animation here anymore, controlled by JS refs */}
               <div className="absolute inset-0 w-full h-full">
                  
                  {/* A. Base Texture */}
                  <div 
                      ref={baseTextureRef}
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backgroundImage: `url(${baseTexture})`,
                        backgroundSize: '200% 100%',
                        backgroundRepeat: 'repeat-x',
                        filter: textureFilter,
                        transition: 'filter 1s ease-in-out',
                      }}
                  />

                  {/* B. Terraformed Overlay */}
                  {overlayTexture && (
                    <>
                      <div 
                        className="absolute top-0 left-0 right-0 overflow-hidden"
                        style={{ animation: 'terraformSpread 8s ease-in-out forwards' }}
                      >
                         <div 
                           ref={terraformTopRef}
                           className="absolute top-0 left-0 w-full"
                           style={{ 
                             height: planetSize, 
                             backgroundImage: `url(${overlayTexture})`,
                             backgroundSize: '200% 100%',
                             backgroundRepeat: 'repeat-x',
                             filter: 'grayscale(0) contrast(1.1) brightness(1.1)',
                           }}
                         />
                      </div>
                      <div 
                        className="absolute bottom-0 left-0 right-0 overflow-hidden"
                        style={{ animation: 'terraformSpread 8s ease-in-out forwards' }}
                      >
                         <div 
                           ref={terraformBottomRef}
                           className="absolute bottom-0 left-0 w-full"
                           style={{ 
                             height: planetSize, 
                             backgroundImage: `url(${overlayTexture})`,
                             backgroundSize: '200% 100%',
                             backgroundRepeat: 'repeat-x',
                             filter: 'grayscale(0) contrast(1.1) brightness(1.1)',
                           }}
                         />
                      </div>
                    </>
                  )}
               </div>

               {/* Unique Terrain/Mesh Overlay */}
               <div 
                  ref={meshRef}
                  className="absolute inset-0 w-full h-full mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `url("${uniqueTerrainSvg}")`,
                    backgroundSize: '200% 100%', // Match base texture aspect
                    backgroundRepeat: 'repeat-x',
                    opacity: terrainOpacity
                  }}
               />

               {/* Parallax Cloud Layer - Increased opacity for depth */}
               <div 
                  ref={cloudsRef}
                  className="absolute inset-0 w-full h-full mix-blend-screen opacity-40" 
                  style={{
                    backgroundImage: `url(${baseTexture})`,
                    backgroundSize: '200% 100%',
                    backgroundRepeat: 'repeat-x',
                    filter: 'contrast(1.5) brightness(1.2) grayscale(0.8)',
                  }}
               />

               <div 
                  className="absolute inset-0 w-full h-full mix-blend-color pointer-events-none transition-all duration-[1000ms] ease-in-out"
                  style={{ backgroundColor: planet.color, opacity: tintOpacity }}
               />

               <div 
                  className="absolute inset-0 w-full h-full mix-blend-overlay pointer-events-none transition-all duration-[1000ms] ease-in-out"
                  style={{ backgroundColor: planet.color, opacity: overlayOpacity }}
               />
            </div>

            {/* 3. Inner Atmosphere */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow: `inset -10px 0 ${planetSize * 0.12}px rgba(${rgb}, 0.5)`,
                mixBlendMode: 'screen',
                opacity: sunIntensity
              }}
            />

            {/* 4. Dynamic Lighting */}
            <div 
              className="absolute inset-0 rounded-full transition-all duration-100 ease-out pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${lightX} 50%, transparent 40%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.85) 100%)`,
              }}
            />
            
            {/* 5. Specular Highlight */}
            <div 
              className="absolute inset-0 rounded-full transition-all duration-100 ease-out pointer-events-none mix-blend-add"
              style={{
                 background: `radial-gradient(circle at ${lightX} 50%, rgba(255,255,255,${0.5 * sunIntensity}) 0%, transparent 30%)`,
              }}
            />
            
            {/* 6. Night Side Tint */}
            <div 
              className="absolute inset-0 rounded-full bg-black transition-opacity duration-100 pointer-events-none mix-blend-multiply"
              style={{ opacity: shadowOpacity * 0.75 }} 
            />
          </div>

          {/* Moons - Orbiting Small Spheres */}
          {!viewingMoon && planet.moons && planet.moons.map((moon, i) => (
             <div 
              key={moon.id}
              className="absolute top-1/2 left-1/2 w-0 h-0 cursor-pointer z-20 group/moon"
              style={{ 
                animation: 'moonOrbit 20s linear infinite',
                animationDelay: `${i * -5}s`
              }}
              onClick={(e) => {
                e.stopPropagation();
                onMoonClick && onMoonClick(moon);
              }}
             >
               <div 
                className="absolute w-8 h-8 rounded-full shadow-lg bg-gray-300 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
                style={{
                   backgroundImage: `url(${moon.textureUrl})`,
                   backgroundSize: 'cover',
                   boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.7)'
                }}
               >
                 {/* Label on Hover */}
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white bg-black/50 px-2 py-0.5 rounded opacity-0 group-hover/moon:opacity-100 transition-opacity whitespace-nowrap">
                   {moon.name}
                 </div>
               </div>
             </div>
          ))}

          {/* Rocket Animation Layer */}
          {isRocketActive && (
            <>
              {/* Launch Explosion Layers */}
              {/* 1. Flash */}
              <div 
                className="absolute top-1/2 left-1/2 w-8 h-8 z-30 pointer-events-none rounded-full bg-white mix-blend-overlay blur-md"
                style={{
                  marginTop: '-16px', marginLeft: '-16px',
                  animation: 'explosionFlash 0.4s ease-out forwards'
                }}
              />
              {/* 2. Shockwave */}
              <div 
                className="absolute top-1/2 left-1/2 w-8 h-8 z-30 pointer-events-none rounded-full border-2 border-white box-border"
                style={{
                  marginTop: '-16px', marginLeft: '-16px',
                  animation: 'explosionShockwave 0.6s ease-out forwards'
                }}
              />
              {/* 3. Volumetric Core Fireball */}
              <div 
                className="absolute top-1/2 left-1/2 w-8 h-8 z-30 pointer-events-none rounded-full blur-sm"
                style={{
                  marginTop: '-16px', marginLeft: '-16px',
                  animation: 'explosionCore 1.2s ease-out forwards'
                }}
              />
              {/* 4. Lingering Smoke */}
               <div 
                className="absolute top-1/2 left-1/2 w-8 h-8 z-20 pointer-events-none rounded-full blur-md"
                style={{
                  marginTop: '-16px', marginLeft: '-16px',
                  animation: 'explosionSmoke 2.5s ease-out forwards'
                }}
              />

              {/* Rocket */}
              <div 
                className="absolute top-1/2 left-1/2 w-8 h-8 z-20 pointer-events-none"
                style={{
                   marginTop: '-16px',
                   marginLeft: '-16px',
                   animation: `orbitalCrash ${flightDuration}s linear forwards`,
                }}
                onAnimationEnd={handleAnimationEnd}
              >
                {/* Rocket Icon */}
                <div className="text-3xl transform rotate-45 filter drop-shadow-[0_0_5px_rgba(255,165,0,0.8)] relative z-20">
                  🚀
                </div>

                {/* Fumes & Trail Wrapper */}
                <div className="absolute top-[22px] left-[15px] w-0 h-0 flex justify-center rotate-90 z-10">
                  <div className="absolute top-4 -translate-x-1/2 w-1.5 h-6 bg-gradient-to-b from-orange-500 to-transparent blur-[2px] rounded-full opacity-90" />
                  <div className="absolute top-6 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-white/10 to-transparent blur-[1px]" />
                  
                  {/* Fume Effect Particles */}
                  <div 
                    className="absolute top-6 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full blur-[1px]"
                    style={{ animation: 'fumeEmit 0.6s ease-out infinite 0s' }}
                  />
                  <div 
                    className="absolute top-7 -translate-x-1/2 w-1.5 h-1.5 bg-orange-200/20 rounded-full blur-[2px]"
                    style={{ animation: 'fumeEmitWide 0.8s ease-out infinite 0.1s' }}
                  />
                  <div 
                    className="absolute top-6 -translate-x-1/2 w-1 h-1 bg-gray-200/10 rounded-full blur-[1px]"
                    style={{ animation: 'fumeEmit 0.6s ease-out infinite 0.2s' }}
                  />
                  <div 
                    className="absolute top-8 -translate-x-1/2 w-2 h-2 bg-orange-100/10 rounded-full blur-[2px]"
                    style={{ animation: 'fumeEmitWide 0.9s ease-out infinite 0.3s' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Rings */}
          {planet.hasRings && (
             <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-x-1/2 w-[160%] h-[160%] rounded-full border-[30px] md:border-[50px] border-double opacity-80 z-0 pointer-events-none"
              style={{
                borderColor: planet.ringColor,
                transform: 'translate(-50%, -50%) rotateX(75deg) rotateY(10deg)',
                boxShadow: '0 0 20px rgba(255,255,255,0.1)'
              }}
             ></div>
          )}
        </div>
      </div>

      <style>{`
        ${orbitalCrashKeyframes}
      `}</style>
    </div>
  );
};

export default Planet3D;