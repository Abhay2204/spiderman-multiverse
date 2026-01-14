import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { generateComicMonologue } from '../../services/geminiService';
import { RefreshCw, MessageSquare } from 'lucide-react';

export const NarrativeBox: React.FC = () => {
  const { mode, config } = useTheme();
  const isSymbiote = mode === 'symbiote';
  const [fullText, setFullText] = useState<string>("Initializing noir narrative protocol...");
  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(false);
  const typeIndex = useRef(0);

  const fetchNarrative = async () => {
    setLoading(true);
    setDisplayedText(""); // Clear for loading state
    const result = await generateComicMonologue(isSymbiote);
    setFullText(result);
    setLoading(false);
    typeIndex.current = 0;
  };

  useEffect(() => {
    fetchNarrative();
  }, [mode]);

  // Typewriter Effect
  useEffect(() => {
    if (loading) return;
    
    // If text changed, reset
    if (displayedText.length < fullText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(fullText.slice(0, typeIndex.current + 1));
        typeIndex.current += 1;
      }, 30); // Typing speed
      return () => clearTimeout(timeoutId);
    }
  }, [fullText, displayedText, loading]);

  return (
    <div className={`
      relative h-full flex flex-col justify-between p-6 overflow-hidden
      ${isSymbiote ? 'bg-zinc-900 text-white' : 'bg-[#F2EECB] text-noir-ink'}
    `}>
      {/* Paper texture overlay for Noir mode */}
      {!isSymbiote && <div className="absolute inset-0 opacity-10 bg-noise pointer-events-none" />}
      
      {/* Decorative Corner */}
      <div className={`absolute top-0 right-0 w-8 h-8 
        bg-gradient-to-bl from-black/10 to-transparent
      `} />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 border-b-2 border-current pb-2 opacity-70">
            <MessageSquare size={16} />
            <h3 className={`${config.fonts.heading} text-xl tracking-wide`}>
            {isSymbiote ? "THE HIVE MIND" : "INTERNAL LOG"}
            </h3>
        </div>
        
        <p className={`${config.fonts.body} text-lg leading-relaxed font-semibold italic min-h-[100px]`}>
          "{loading ? <span className="animate-pulse">Thinking...</span> : displayedText}"
          <span className="animate-pulse inline-block w-2 h-5 bg-current ml-1 align-middle" />
        </p>
      </div>
      
      <button 
        onClick={fetchNarrative}
        disabled={loading}
        className={`
          relative z-10 mt-4 self-start px-4 py-2 border-2 
          flex items-center gap-2 text-xs font-bold uppercase tracking-widest
          hover:bg-current hover:text-white transition-all
          ${isSymbiote ? 'border-white text-white hover:text-black' : 'border-black text-black'}
        `}
      >
        <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        {isSymbiote ? "SCREAM" : "NARRATE"}
      </button>
    </div>
  );
};