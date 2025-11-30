import React, { useState, useEffect, useRef } from 'react';
import { Planet, Message } from '../types';
import { getGeminiResponse } from '../services/gemini';

interface InfoPanelProps {
  planet: Planet;
  sunPosition: number;
  setSunPosition: (val: number) => void;
  onLaunch: () => void;
  onTerraform: () => void;
  isTerraformed: boolean;
  viewingTerraformed?: boolean;
  setViewingTerraformed?: (val: boolean) => void;
  viewingMoon?: boolean;
  onBackToPlanet?: () => void;
  parentPlanetName?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ 
  planet, 
  sunPosition, 
  setSunPosition, 
  onLaunch,
  onTerraform,
  isTerraformed,
  viewingTerraformed,
  setViewingTerraformed,
  viewingMoon,
  onBackToPlanet,
  parentPlanetName
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNukeModal, setShowNukeModal] = useState(false);
  
  // Ref to store the animation frame ID so we can cancel it if needed
  const animationRef = useRef<number | null>(null);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Reset chat when planet changes
  useEffect(() => {
    setMessages([{ role: 'model', text: `Greetings! I am the consciousness of ${planet.name}. Ask me anything about my world.` }]);
    setIsOpen(false);
  }, [planet]);

  // Calculate dynamic temperature based on sun position
  // 180 = Noon (Max Temp), 0/360 = Midnight (Min Temp)
  const calculateTemp = () => {
    // Normalize sun position to 0-1 range where 1 is noon (180deg) and 0 is midnight
    const phase = 1 - Math.abs(sunPosition - 180) / 180;
    
    // Interpolate
    const tempDiff = planet.tempDay - planet.tempNight;
    const currentTemp = planet.tempNight + (tempDiff * phase);
    return Math.round(currentTemp);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const context = `You are roleplaying as the planet ${planet.name}. 
    Data: 
    - Diameter: ${planet.diameter}
    - Mass: ${planet.mass}
    - Volume: ${planet.volume}
    - Distance from Sun: ${planet.au} AU
    - Day Length: ${planet.dayLength}
    - Year Length: ${planet.yearLength}
    - Description: ${planet.description}
    - Current Surface Temp: ${calculateTemp()}°C
    
    Answer the user's question in character (first person), keeping it educational but slightly mysterious.`;

    const responseText = await getGeminiResponse(userMsg.text, context);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  // Calculate avg distance from Earth (roughly |planet.au - earth.au|)
  const distanceFromEarth = Math.abs(planet.au - 1.0).toFixed(2);

  // Helper to map 0-100 slider to 180-0 sun position (Day -> Night)
  // Slider 0 = Day (180 deg)
  // Slider 100 = Night (0 deg)
  const sliderValue = ((180 - sunPosition) / 180) * 100;

  const handleSliderChange = (val: number) => {
    // If user manually drags slider, cancel any auto-animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Convert 0-100 back to 180-0
    const newSunPos = 180 - (val / 100 * 180);
    setSunPosition(newSunPos);
  };

  // Smoothly animate sun position to target value
  const animateSunTo = (target: number) => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = sunPosition;
    const distance = target - startValue;
    // Don't animate if already there
    if (Math.abs(distance) < 0.1) return;

    const duration = 1200; // Increased to 1200ms for slower, smoother transition
    const startTime = performance.now();

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic Ease Out function for smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      
      const newValue = startValue + (distance * ease);
      setSunPosition(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        animationRef.current = null;
        setSunPosition(target); // Ensure we land exactly on target
      }
    };

    animationRef.current = requestAnimationFrame(tick);
  };

  return (
    // Reduced width constraint to 2xl to shrink the box
    <div className="w-full ml-auto p-4 lg:max-w-2xl relative">
      
      {/* Nuke Mars Confirmation Modal */}
      {showNukeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="rounded-2xl p-8 max-w-sm w-full bg-gray-950 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] transform scale-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <span className="animate-pulse">⚠️</span> Warning
            </h2>
            <p className="text-gray-200 mb-8 text-lg leading-relaxed">
              Do you really want to nuke Mars?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowNukeModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-all"
              >
                No
              </button>
              <button 
                onClick={() => {
                  onTerraform();
                  setShowNukeModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Unified Card containing Stats, Controls, AND Chat */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/10 flex flex-col gap-8">
        
        {/* Header Section */}
        <div>
          {/* Back to Planet Button (Moon View) */}
          {viewingMoon && onBackToPlanet && (
            <div className="flex mb-4">
               <button 
                 onClick={onBackToPlanet}
                 className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest group"
               >
                 <span>←</span> Return to {parentPlanetName}
               </button>
            </div>
          )}

          {/* Terraformed Toggle Tabs - Only visible if Mars and Terraformed */}
          {planet.id === 'mars' && isTerraformed && setViewingTerraformed && !viewingMoon && (
            <div className="flex gap-2 mb-4">
               <button 
                 onClick={() => setViewingTerraformed(false)}
                 className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                   !viewingTerraformed 
                     ? 'bg-red-500/20 text-red-300 border-red-500' 
                     : 'bg-black/30 text-gray-500 border-white/10 hover:border-white/30'
                 }`}
               >
                 Original Mars
               </button>
               <button 
                 onClick={() => setViewingTerraformed(true)}
                 className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                   viewingTerraformed 
                     ? 'bg-green-500/20 text-green-300 border-green-500' 
                     : 'bg-black/30 text-gray-500 border-white/10 hover:border-white/30'
                 }`}
               >
                 Mars (Terraformed)
               </button>
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
            {/* Colored Planet Name */}
            <h1 
              className="text-5xl md:text-7xl font-bold tracking-tighter drop-shadow-lg"
              style={{ color: planet.color, textShadow: `0 0 30px ${planet.color}40` }}
            >
              {planet.name}
            </h1>
            <div className="text-right">
              <div className="text-5xl font-mono font-bold text-yellow-400 drop-shadow-lg transition-all duration-300">
                {calculateTemp()}°C
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Surface Temp</div>
            </div>
          </div>

          <p className="text-blue-300 font-mono text-sm mb-6 tracking-wide">{planet.au} AU from the Sun</p>
          
          {/* Description Section with Side Button */}
          <div className="flex gap-6 items-start h-[320px]">
            {/* Text Container with Scroll on Left */}
            <div 
              className="flex-1 h-full overflow-y-auto"
              style={{ direction: 'rtl' }}
            >
               <div style={{ direction: 'ltr' }} className="pl-6 pr-2">
                 <p className="text-gray-200 leading-relaxed text-lg md:text-xl whitespace-pre-line pb-4 text-left">
                  {planet.description}
                 </p>
               </div>
            </div>
            
            {/* Buttons Column - Hide launch button if viewing moon */}
            <div className="flex flex-col gap-3 justify-start min-w-[100px] h-full pt-1">
              
              {/* Terraform Button (Mars Specific) */}
              {planet.id === 'mars' && !isTerraformed && !viewingMoon && (
                <button 
                  onClick={() => setShowNukeModal(true)}
                  className="group relative flex flex-col items-center justify-center gap-1 p-3 bg-gradient-to-br from-cyan-600 to-green-600 hover:from-cyan-500 hover:to-green-500 border border-white/20 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 w-full h-24 shadow-lg hover:shadow-green-500/20"
                  title="Terraform Mars"
                >
                  <span className="text-2xl group-hover:animate-spin">🌱</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white text-center">
                    Terraform
                  </span>
                </button>
              )}

              {/* Launch Astronaut Button - Disable/Hide for Moon for simplicity or keep if desired. Hiding for clarity. */}
              {!viewingMoon && (
                <button 
                  onClick={onLaunch}
                  className="group relative flex flex-col items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 w-full min-h-[120px]"
                  title="Send Astronaut"
                >
                  <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:animate-bounce">🚀</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white text-center">
                    Launch<br/>Mission
                  </span>
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Controls and Stats Section */}
        <div className="space-y-8">
          {/* Interactive Slider */}
          <div className="p-6 bg-black/30 rounded-2xl border border-white/10 relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <label className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">Surface Illumination</label>
              
              {/* Day/Night Toggle Buttons */}
              <div className="flex bg-black/50 rounded-lg p-1 border border-white/10 gap-1">
                <button 
                  onClick={() => animateSunTo(180)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                    sunPosition > 90 
                      ? 'bg-yellow-500/20 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="text-base">☀️</span> DAY
                </button>
                <button 
                  onClick={() => animateSunTo(0)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                    sunPosition <= 90 
                      ? 'bg-indigo-500/20 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="text-base">🌙</span> NIGHT
                </button>
              </div>
            </div>
            
            {/* Custom Slider Styling */}
            <div className="relative h-8 flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderValue} 
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-yellow-500/50 to-indigo-900/50 rounded-full appearance-none cursor-pointer focus:outline-none z-20 relative slider-thumb-white"
              />
            </div>

            <style>{`
              .slider-thumb-white::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #ffffff;
                cursor: pointer;
                box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.8);
                transition: transform 0.1s ease;
              }
              .slider-thumb-white::-webkit-slider-thumb:hover {
                transform: scale(1.15);
              }
              .slider-thumb-white::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #ffffff;
                cursor: pointer;
                box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.8);
                border: none;
              }
            `}</style>
            
            <div className="flex justify-between text-[11px] text-gray-500 mt-3 font-mono uppercase font-bold tracking-widest">
              <span>Day Side</span>
              <span>Night Side</span>
            </div>
          </div>

          {/* Stats Grid - Updated to 3 columns for better layout of 6 items */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <StatBox label="Dist. from Earth" value={planet.id === 'earth' ? '0 AU' : `${distanceFromEarth} AU`} />
            <StatBox label="Mass" value={planet.mass} />
            <StatBox label="Volume" value={planet.volume} />
            <StatBox label="Day Length" value={planet.dayLength} />
            <StatBox label="Year Length" value={planet.yearLength} />
            <StatBox label="Temp Range" value={`${planet.tempNight}°C to ${planet.tempDay}°C`} /> 
          </div>
        </div>

        {/* AI Chat Section - Unified into the card */}
        <div className="pt-8 border-t border-white/10 w-full">
          {!isOpen ? (
            <button 
              onClick={() => setIsOpen(true)}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold text-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center gap-3 group border border-white/10"
            >
              <span className="group-hover:animate-spin-slow text-2xl">✨</span> 
              Ask {planet.name} a Question
              <span className="group-hover:animate-spin-slow text-2xl">✨</span>
            </button>
          ) : (
            <div className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-inner">
              <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <span className="font-semibold text-indigo-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                  Cosmic Link Established
                </span>
                <button onClick={() => setIsOpen(false)} className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-white/5 rounded">Close Channel</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-base shadow-lg ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-gray-700/80 text-gray-100 rounded-tl-none border border-gray-600/50'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-indigo-300 ml-4 animate-pulse">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}/>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}/>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={`Ask ${planet.name} anything...`}
                    className="flex-1 bg-gray-900/60 border border-gray-600/50 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-indigo-500 focus:bg-gray-900 transition-all placeholder-gray-500"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 rounded-xl text-base font-bold hover:bg-indigo-500 disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
    <div className="text-gray-400 text-[10px] uppercase tracking-widest mb-1 opacity-70">{label}</div>
    <div className="font-mono text-white text-sm md:text-base font-medium tracking-tight">{value}</div>
  </div>
);

export default InfoPanel;