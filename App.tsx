import React, { useState, useMemo } from 'react';
import Starfield from './components/Starfield';
import Planet3D from './components/Planet3D';
import InfoPanel from './components/InfoPanel';
import SunFlare from './components/SunFlare';
import { PLANETS } from './constants';
import { Planet, Moon } from './types';

const App: React.FC = () => {
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(0); 
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');
  const [sunPosition, setSunPosition] = useState(150); // Default to angled sun (150 degrees)
  // Store the planet ID along with the timestamp to ensure missions are specific to a planet
  const [lastLaunch, setLastLaunch] = useState<{planetId: string, timestamp: number} | null>(null);
  
  // State for Mars Terraforming
  const [isMarsTerraformed, setIsMarsTerraformed] = useState(false);
  // State to toggle between Original and Terraformed view
  const [viewingTerraformed, setViewingTerraformed] = useState(true);
  
  // State for Feedback Messages
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'failure'; text: string } | null>(null);

  // State for Moon Selection
  const [selectedMoon, setSelectedMoon] = useState<Moon | null>(null);

  // Derived state to handle data overrides (like Terraformed Mars or Selected Moon)
  const currentPlanet = useMemo(() => {
    // If a moon is selected, transform it into a Planet-like structure for display
    if (selectedMoon) {
      return {
        ...PLANETS[selectedPlanetIndex], // Inherit parent props mostly for safety
        id: selectedMoon.id,
        name: selectedMoon.name,
        diameter: selectedMoon.diameter,
        mass: selectedMoon.mass,
        description: selectedMoon.description,
        textureUrl: selectedMoon.textureUrl,
        color: selectedMoon.color,
        // Approximate temps for moon or inherit from parent if not defined
        tempDay: 120, 
        tempNight: -130,
        volume: '0.02 Earths', // Approximation
        dayLength: '27 Earth days',
        yearLength: '27 Earth days',
        au: PLANETS[selectedPlanetIndex].au // Keep parent distance for context
      } as Planet;
    }

    const basePlanet = PLANETS[selectedPlanetIndex];
    
    // Override logic for Terraformed Mars
    // Only show terraformed data if the mission succeeded AND the user has selected that view
    if (basePlanet.id === 'mars' && isMarsTerraformed && viewingTerraformed) {
      return {
        ...basePlanet,
        name: 'Mars (Terraformed)',
        description: `...Kaboom! The project was a success! The strategic release of polar CO2 has thickened the atmosphere.

        **A New Dawn**
        Global temperatures have risen, allowing liquid water to flow once again across the ancient riverbeds of the Red Planet. The first signs of a hydrological cycle have returned: rain falls in the Valles Marineris, and shallow seas are beginning to fill the northern lowlands. Algae blooms are slowly turning the red dust into a green biosphere, creating a second Earth.

        **Atmospheric Transformation**
        The thickening of the atmosphere has triggered a greenhouse effect, trapping solar heat and raising the average surface temperature above freezing. The sky, once a dusty pink, is transitioning to a pale blue as the dust settles and nitrogen levels rise. While the air is not yet breathable for humans without assistance, the pressure has increased enough that pressure suits are no longer required—simple oxygen masks suffice.

        **Hydrosphere**
        Water ice from the poles and subsurface aquifers has melted, creating the Borealis Ocean which now covers nearly a third of the planet's surface. This new ocean moderates the global climate, reducing the extreme temperature swings between day and night. Clouds, once rare, now drift regularly across the Tharsis volcanoes.

        **Biosphere**
        Genetically modified lichen and mosses were the first pioneers, breaking down the regolith to create arable soil. Now, hardy grasses and shrubs are taking root in the equatorial regions. These plants are slowly converting the carbon dioxide-rich atmosphere into oxygen, paving the way for more complex life forms in the coming centuries.

        **Human Settlement**
        With the harsh radiation shielding requirements reduced and water readily available, colonization efforts have exploded. Domes are being replaced by open-air settlements in the most temperate zones. Humanity has effectively backed up its civilization on a second world, ensuring the survival of the species against planetary-scale catastrophes on Earth.

        **The Future**
        The terraforming process is ongoing. It will take centuries to fully oxygenate the atmosphere, but the most difficult step—warming the planet—has been achieved. Mars is no longer a dead world; it is a living, breathing frontier.`,
        textureUrl: 'https://raw.githubusercontent.com/yuriyy/solar-system/master/public/img/earth.jpg', // Reuse Earth texture for "Earth-like"
        color: '#2DD4BF', // Green Teal (Teal-400)
        tempDay: 15,
        tempNight: -10
      };
    }
    
    return basePlanet;
  }, [selectedPlanetIndex, isMarsTerraformed, viewingTerraformed, selectedMoon]);

  const handlePlanetChange = (index: number) => {
    if (index === selectedPlanetIndex || isTransitioning) return;
    
    // Reset moon selection when changing planets
    setSelectedMoon(null);
    setIsTransitioning(true);

    // Determine direction for slide effect
    let direction = 'next';
    
    if (index < selectedPlanetIndex) {
      direction = 'prev';
    }
    // Handle edge case: Mercury (0) -> Neptune (Last) = Prev
    if (selectedPlanetIndex === 0 && index === PLANETS.length - 1) {
      direction = 'prev';
    }
    // Handle edge case: Neptune (Last) -> Mercury (0) = Next
    if (selectedPlanetIndex === PLANETS.length - 1 && index === 0) {
      direction = 'next';
    }

    // 1. Exit Phase
    const exitTranslate = direction === 'next' ? '-translate-x-1/2' : 'translate-x-1/2';
    setTransitionClass(`opacity-0 ${exitTranslate} blur-sm transition-all duration-500 ease-in-out`);
    
    // 2. Wait for animation to complete before switching data
    setTimeout(() => {
      setSelectedPlanetIndex(index);
      
      // 3. Preparation Phase (Instant Jump)
      const entryStartTranslate = direction === 'next' ? 'translate-x-1/2' : '-translate-x-1/2';
      setTransitionClass(`opacity-0 ${entryStartTranslate} transition-none`);

      // 4. Enter Phase (Next Frame)
      setTimeout(() => {
        setTransitionClass('opacity-100 translate-x-0 blur-0 transition-all duration-500 ease-out');
        setIsTransitioning(false);
      }, 50);

    }, 500);
  };

  const handleNext = () => {
    const nextIndex = selectedPlanetIndex < PLANETS.length - 1 ? selectedPlanetIndex + 1 : 0;
    handlePlanetChange(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = selectedPlanetIndex > 0 ? selectedPlanetIndex - 1 : PLANETS.length - 1;
    handlePlanetChange(prevIndex);
  };

  const triggerLaunch = () => {
    setLastLaunch({ planetId: currentPlanet.id, timestamp: Date.now() });
  };

  const attemptTerraform = () => {
    // 50% Chance
    if (Math.random() > 0.5) {
      setIsMarsTerraformed(true);
      setViewingTerraformed(true); // Switch to terraformed view automatically on success
      setFeedbackMessage({ type: 'success', text: 'Amazing! The mission was a success!' });
    } else {
      setFeedbackMessage({ type: 'failure', text: 'Nukes insufficient. Polar caps remain frozen.' });
    }

    // Clear message after 4 seconds
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  const handleMoonClick = (moon: Moon) => {
     // Trigger Zoom transition
     setIsTransitioning(true);
     setTransitionClass('opacity-0 scale-150 blur-md transition-all duration-500 ease-in-out');
     
     setTimeout(() => {
       setSelectedMoon(moon);
       setTransitionClass('opacity-0 scale-50 transition-none');
       
       setTimeout(() => {
          setTransitionClass('opacity-100 scale-100 blur-0 transition-all duration-500 ease-out');
          setIsTransitioning(false);
       }, 50);
     }, 500);
  };

  const handleBackToPlanet = () => {
    setIsTransitioning(true);
    setTransitionClass('opacity-0 scale-50 blur-md transition-all duration-500 ease-in-out');
    
    setTimeout(() => {
      setSelectedMoon(null);
      setTransitionClass('opacity-0 scale-150 transition-none');
      
      setTimeout(() => {
        setTransitionClass('opacity-100 scale-100 blur-0 transition-all duration-500 ease-out');
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Background Layer */}
      <Starfield />
      
      {/* Solar Flare Layer - sits above stars but below content */}
      <SunFlare sunPosition={sunPosition} distanceAU={currentPlanet.au} />
      
      {/* Feedback Message Overlay */}
      {feedbackMessage && (
        <div className="fixed top-24 left-0 right-0 z-[100] flex justify-center pointer-events-none">
          <div className={`
            mx-4 px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border backdrop-blur-xl
            transform transition-all duration-500 animate-[bounce_1s_infinite]
            flex items-center gap-4 pointer-events-auto
            ${feedbackMessage.type === 'success' 
              ? 'bg-green-500/20 border-green-400 text-green-100 shadow-green-900/50' 
              : 'bg-red-500/20 border-red-400 text-red-100 shadow-red-900/50'}
          `}>
            <span className="text-3xl">
              {feedbackMessage.type === 'success' ? '🌟' : '💥'}
            </span>
            <div className="flex flex-col">
              <span className={`text-xl font-bold uppercase tracking-wider ${
                feedbackMessage.type === 'success' ? 'text-green-300' : 'text-red-300'
              }`}>
                {feedbackMessage.type === 'success' ? 'Success!' : 'Failure!'}
              </span>
              <span className="text-sm font-medium opacity-90">{feedbackMessage.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content Layer - Z-Index 10 ensures it sits above the canvas */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex gap-2 md:gap-4 overflow-x-auto max-w-full px-4 pb-2 scrollbar-hide">
            {PLANETS.map((planet, idx) => (
              <button
                key={planet.id}
                onClick={() => handlePlanetChange(idx)}
                disabled={isTransitioning || !!selectedMoon} // Disable main nav when zoomed in on moon
                className={`
                  px-3 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 border
                  ${idx === selectedPlanetIndex 
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                    : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/40 hover:text-white'}
                  ${isTransitioning || selectedMoon ? 'cursor-not-allowed opacity-50' : ''}
                `}
              >
                {planet.id === 'pluto' ? 'Special' : planet.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow pt-24 pb-10 container mx-auto px-6 overflow-hidden">
          
          {/* Transition Wrapper for Slide Effect */}
          <div className={`w-full flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-16 transform will-change-transform ${transitionClass}`}>
            
            {/* Left Column: Visual */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:mt-64">
              <div className="relative w-full flex justify-center lg:translate-x-64 transition-transform duration-500">
                <Planet3D 
                  key={currentPlanet.id} // Forces component reset when planet changes
                  planet={currentPlanet} 
                  sunPosition={sunPosition} 
                  lastLaunch={lastLaunch}
                  // Only show terraform visual if global state is true AND user wants to view it
                  isMarsTerraformed={isMarsTerraformed && viewingTerraformed}
                  onMoonClick={handleMoonClick}
                  viewingMoon={!!selectedMoon}
                />
              </div>
              
              {/* Navigation Arrows for Mobile convenience */}
              {!selectedMoon && (
                <div className="flex gap-8 mt-8 lg:hidden">
                  <button 
                    onClick={handlePrev}
                    disabled={isTransitioning}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white transition-all disabled:opacity-30"
                  >
                    ← Prev
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={isTransitioning}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white transition-all disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Info */}
            <div className="w-full lg:w-1/2 lg:mt-8">
              <InfoPanel 
                planet={currentPlanet} 
                sunPosition={sunPosition}
                setSunPosition={setSunPosition}
                onLaunch={triggerLaunch}
                onTerraform={attemptTerraform}
                isTerraformed={isMarsTerraformed}
                viewingTerraformed={viewingTerraformed}
                setViewingTerraformed={setViewingTerraformed}
                viewingMoon={!!selectedMoon}
                onBackToPlanet={handleBackToPlanet}
                parentPlanetName={PLANETS[selectedPlanetIndex].name}
              />
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-gray-600 pointer-events-none hidden md:block">
          Solar Explorer v1.1
        </footer>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;