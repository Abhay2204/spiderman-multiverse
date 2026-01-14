import React from 'react';

export type StoryPhase = 'origin' | 'hero' | 'miles' | 'gwen' | 'noir' | 'peni';

export type SuitMode = 'peter' | 'miles' | 'gwen' | 'noir' | 'peni';

export interface UniverseConfig {
  mode: SuitMode;
  universeName: string;
  universeId: string;
  spiderPerson: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
    panel: string;
    glow: string;
  };
  animation: {
    stiffness: number;
    damping: number;
    mass: number;
  };
  fonts: {
    heading: string;
    body: string;
  };
  style: 'classic' | 'graffiti' | 'punk' | 'noir' | 'anime';
}

export interface ComicPanelProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  colSpan?: string;
  rowSpan?: string;
  delay?: number;
}

export interface ComicPanelData {
  id: string;
  phase: StoryPhase;
  title: string;
  image: string;
  captionPrompt: string;
  interactionType?: 'bite' | 'web' | 'toggle' | 'scroll';
}

export interface GeminiResponse {
  caption: string;
  soundEffect?: string;
}

// Spider-Verse dimension data
export interface DimensionData {
  id: string;
  name: string;
  spiderPerson: string;
  universeId: string;
  description: string;
  heroImage: string;
  accentColor: string;
}
