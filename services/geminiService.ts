import { GeminiResponse, StoryPhase } from '../types';

// --- MOCK DATA STORES ---

const PETER_QUOTES = [
  "Just another friendly neighborhood patrol.",
  "With great power comes great... tiredness.",
  "New York never sleeps, neither do I.",
  "My Spider-Sense is tingling off the charts.",
  "Hope Aunt May didn't wait up.",
];

const MILES_QUOTES = [
  "Anyone can wear the mask.",
  "What's up danger?",
  "Brooklyn's got a new Spider-Man.",
  "I'm not giving up. Not ever.",
  "That's a leap of faith.",
];

const GWEN_QUOTES = [
  "I'm in a band. We're called The Mary Janes.",
  "Ghost Spider, at your service.",
  "Ballet and web-slinging have a lot in common.",
  "I've got my own dimension to protect.",
  "Drums and danger, my two specialties.",
];

const NOIR_QUOTES = [
  "In my world, there's no color. Only justice.",
  "The shadows are my ally.",
  "1933. The Great Depression. And me.",
  "I don't do colors, kid.",
  "Sometimes the only way out is through.",
];

const PENI_QUOTES = [
  "SP//dr and I are connected. Forever.",
  "Neo Tokyo needs its protector.",
  "The future is now, and it's dangerous.",
  "My father's legacy lives in this mech.",
  "Kawaii but deadly!",
];

// --- MOCK SERVICE FUNCTIONS ---

export const getStoryBeat = async (sceneDescription: string, phase: StoryPhase): Promise<GeminiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const lowerScene = sceneDescription.toLowerCase();

  // Peter Parker responses
  if (phase === 'origin' || phase === 'hero') {
    if (lowerScene.includes('swinging') || lowerScene.includes('manhattan')) {
      return { caption: "The city is my playground. Every rooftop, every alley.", soundEffect: "THWIP!" };
    }
    if (lowerScene.includes('gargoyle') || lowerScene.includes('watching')) {
      return { caption: "Someone has to watch over this city. Might as well be me.", soundEffect: "WHOOSH!" };
    }
    if (lowerScene.includes('soaring') || lowerScene.includes('skyscrapers')) {
      return { caption: "With great power comes great responsibility. Uncle Ben was right.", soundEffect: "AMAZING!" };
    }
    return { caption: PETER_QUOTES[Math.floor(Math.random() * PETER_QUOTES.length)], soundEffect: "THWIP!" };
  }

  // Miles Morales responses
  if (phase === 'miles') {
    if (lowerScene.includes('brooklyn') || lowerScene.includes('powers')) {
      return { caption: "These powers... they're mine now. Time to figure them out.", soundEffect: "BZZT!" };
    }
    if (lowerScene.includes('leap') || lowerScene.includes('faith')) {
      return { caption: "When you fall, you get back up. That's the Spider-Man way.", soundEffect: "WHAT'S UP DANGER!" };
    }
    if (lowerScene.includes('standing') || lowerScene.includes('new spider')) {
      return { caption: "Brooklyn's got a new hero. And he's just getting started.", soundEffect: "EXCELENTE!" };
    }
    return { caption: MILES_QUOTES[Math.floor(Math.random() * MILES_QUOTES.length)], soundEffect: "BZZT!" };
  }

  // Gwen Stacy responses
  if (phase === 'gwen') {
    if (lowerScene.includes('stage') || lowerScene.includes('drums') || lowerScene.includes('mary janes')) {
      return { caption: "By day, I'm in a band. By night, I'm saving the world.", soundEffect: "CRASH!" };
    }
    if (lowerScene.includes('swinging') || lowerScene.includes('ballet')) {
      return { caption: "Grace under pressure. That's what ballet taught me.", soundEffect: "WOOO!" };
    }
    if (lowerScene.includes('hood') || lowerScene.includes('rooftop')) {
      return { caption: "Ghost Spider. That's what they call me now.", soundEffect: "PUNK ROCK!" };
    }
    return { caption: GWEN_QUOTES[Math.floor(Math.random() * GWEN_QUOTES.length)], soundEffect: "CRASH!" };
  }

  // Spider-Man Noir responses
  if (phase === 'noir') {
    if (lowerScene.includes('shadows') || lowerScene.includes('lurking')) {
      return { caption: "In the shadows, I find my truth. And my targets.", soundEffect: "CLICK..." };
    }
    if (lowerScene.includes('rain') || lowerScene.includes('alley') || lowerScene.includes('criminals')) {
      return { caption: "Justice doesn't need color. Just conviction.", soundEffect: "BANG!" };
    }
    if (lowerScene.includes('fire escape') || lowerScene.includes('black and white')) {
      return { caption: "1933. The world is gray. But my purpose is clear.", soundEffect: "..." };
    }
    return { caption: NOIR_QUOTES[Math.floor(Math.random() * NOIR_QUOTES.length)], soundEffect: "..." };
  }

  // Peni Parker responses
  if (phase === 'peni') {
    if (lowerScene.includes('sp//dr') || lowerScene.includes('syncing') || lowerScene.includes('mech')) {
      return { caption: "SP//dr online. Neural link established. Let's go!", soundEffect: "ビープ!" };
    }
    if (lowerScene.includes('battle') || lowerScene.includes('neo tokyo') || lowerScene.includes('neon')) {
      return { caption: "The future needs protecting. That's why I'm here.", soundEffect: "ドカーン!" };
    }
    if (lowerScene.includes('cityscape') || lowerScene.includes('futuristic')) {
      return { caption: "My father built SP//dr. Now it's my turn to carry on.", soundEffect: "すごい!" };
    }
    return { caption: PENI_QUOTES[Math.floor(Math.random() * PENI_QUOTES.length)], soundEffect: "ビープ!" };
  }

  // Default fallback
  return { caption: "The multiverse is vast. And I'm just one spider.", soundEffect: "THWIP!" };
};

export const generateComicMonologue = async (mode: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const quotes: Record<string, string[]> = {
    peter: PETER_QUOTES,
    miles: MILES_QUOTES,
    gwen: GWEN_QUOTES,
    noir: NOIR_QUOTES,
    peni: PENI_QUOTES,
  };
  
  const modeQuotes = quotes[mode] || PETER_QUOTES;
  return modeQuotes[Math.floor(Math.random() * modeQuotes.length)];
};

export const getSuitAnalysis = async (mode: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const status: Record<string, string[]> = {
    peter: ["Web Fluid: 84%", "Nanotech: Online", "Spider-Sense: Active"],
    miles: ["Venom Blast: Charged", "Camouflage: Ready", "Bio-Electric: 100%"],
    gwen: ["Web Shooters: Full", "Dimension Watch: Synced", "Agility: Maximum"],
    noir: ["Revolver: Loaded", "Shadows: Embraced", "Justice: Unwavering"],
    peni: ["SP//dr: Online", "Neural Link: 98%", "Mech Systems: Optimal"],
  };

  const modeStatus = status[mode] || status.peter;
  return modeStatus[Math.floor(Math.random() * modeStatus.length)];
};
