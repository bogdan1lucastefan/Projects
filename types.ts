export interface Moon {
  id: string;
  name: string;
  diameter: string;
  mass: string;
  description: string;
  textureUrl: string;
  color: string;
  au?: number; // Distance from parent
}

export interface Planet {
  id: string;
  name: string;
  au: number; // Distance from sun in Astronomical Units
  diameter: string; // km
  mass: string; // Relative to Earth
  volume: string; // Relative to Earth
  dayLength: string;
  yearLength: string;
  description: string;
  textureUrl: string;
  color: string; // Fallback/Accent color
  ringColor?: string;
  hasRings?: boolean;
  tempDay: number; // Celsius
  tempNight: number; // Celsius
  moons?: Moon[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}