import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, FileText, CheckCircle, XCircle } from 'lucide-react';

interface Clue {
  id: string;
  name: string;
  description: string;
  found: boolean;
  x: number;
  y: number;
}

interface Case {
  title: string;
  description: string;
  clues: Clue[];
  solution: string;
  options: string[];
  correctAnswer: number;
}

const CASE: Case = {
  title: "THE MISSING SHIPMENT",
  description: "A weapons shipment has vanished from the docks. The Goblin's men are involved. Find the clues and solve the case.",
  clues: [
    { id: 'note', name: 'Torn Note', description: '"Meet at the old warehouse... midnight..."', found: false, x: 25, y: 35 },
    { id: 'footprint', name: 'Muddy Footprint', description: 'Size 12 boot print, military grade.', found: false, x: 70, y: 60 },
    { id: 'cigar', name: 'Cigar Butt', description: 'Cuban. Expensive. Only one man in town smokes these...', found: false, x: 45, y: 75 },
    { id: 'bullet', name: 'Shell Casing', description: '.45 caliber. Recently fired.', found: false, x: 80, y: 30 },
  ],
  solution: "The evidence points to Hammerhead's crew. The Cuban cigars are his signature, and the military boots match his enforcers.",
  options: [
    "The Goblin's personal guard",
    "Hammerhead's crew",
    "Corrupt dock workers",
    "The Vulture's gang"
  ],
  correctAnswer: 1,
};

export const NoirDetective: React.FC = () => {
  const [clues, setClues] = useState<Clue[]>(CASE.clues);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [phase, setPhase] = useState<'investigate' | 'deduce' | 'result'>('investigate');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const foundClues = clues.filter(c => c.found).length;
  const allCluesFound = foundClues === clues.length;

  const handleClueClick = (clueId: string) => {
    setClues(prev => prev.map(c => 
      c.id === clueId ? { ...c, found: true } : c
    ));
    const clue = clues.find(c => c.id === clueId);
    if (clue) setSelectedClue({ ...clue, found: true });
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setIsCorrect(index === CASE.correctAnswer);
    setPhase('result');
  };

  const resetGame = () => {
    setClues(CASE.clues.map(c => ({ ...c, found: false })));
    setSelectedClue(null);
    setPhase('investigate');
    setSelectedAnswer(null);
  };

  return (
    <div className="relative w-full h-[550px] bg-noir-black overflow-hidden select-none">
      {/* Film Grain Overlay */}
      <div className="absolute inset-0 film-grain opacity-30 pointer-events-none z-50" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.9)_100%)] pointer-events-none z-40" />

      {/* Scene Background */}
      <div 
        className="absolute inset-0 noir-filter"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start">
        <div className="bg-black/90 border border-noir-gold px-4 py-2">
          <div className="text-noir-gold font-noir text-lg tracking-wider">{CASE.title}</div>
          <div className="text-noir-white/60 text-xs font-tech mt-1">CLUES: {foundClues}/{clues.length}</div>
        </div>

        {allCluesFound && phase === 'investigate' && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setPhase('deduce')}
            className="bg-noir-gold text-black px-4 py-2 font-noir tracking-wider hover:bg-yellow-500 transition-colors"
          >
            MAKE DEDUCTION
          </motion.button>
        )}
      </div>

      {/* Investigation Phase */}
      {phase === 'investigate' && (
        <>
          {/* Clue Hotspots */}
          {clues.map((clue) => (
            <motion.button
              key={clue.id}
              onClick={() => handleClueClick(clue.id)}
              className={`
                absolute w-12 h-12 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 z-20
                ${clue.found 
                  ? 'border-noir-gold bg-noir-gold/20 cursor-default' 
                  : 'border-white/30 bg-white/10 hover:border-noir-gold hover:bg-noir-gold/30 cursor-pointer animate-pulse'
                }
              `}
              style={{ left: `${clue.x}%`, top: `${clue.y}%`, transform: 'translate(-50%, -50%)' }}
              disabled={clue.found}
              whileHover={!clue.found ? { scale: 1.2 } : {}}
              whileTap={!clue.found ? { scale: 0.9 } : {}}
            >
              {clue.found ? (
                <CheckCircle size={20} className="text-noir-gold" />
              ) : (
                <Search size={20} className="text-white/60" />
              )}
            </motion.button>
          ))}

          {/* Clue Detail Popup */}
          <AnimatePresence>
            {selectedClue && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 z-30"
              >
                <div className="bg-black/95 border border-noir-gold p-4 max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <Eye size={24} className="text-noir-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-noir-gold font-noir text-lg tracking-wider">{selectedClue.name}</h3>
                      <p className="text-noir-white/80 font-body text-sm mt-1 italic">"{selectedClue.description}"</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedClue(null)}
                    className="mt-3 text-noir-white/50 text-xs font-tech hover:text-noir-gold transition-colors"
                  >
                    [CLOSE]
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {!allCluesFound && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-noir-white/40 text-xs font-tech z-20">
              Click the glowing spots to investigate
            </div>
          )}
        </>
      )}

      {/* Deduction Phase */}
      {phase === 'deduce' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/95 p-4"
        >
          <div className="max-w-lg w-full">
            <div className="border border-noir-gold p-6 bg-black">
              <FileText size={32} className="text-noir-gold mb-4" />
              <h2 className="text-noir-gold font-noir text-2xl tracking-wider mb-2">CASE FILE</h2>
              <p className="text-noir-white/70 font-body text-sm mb-6">{CASE.description}</p>
              
              {/* Evidence Summary */}
              <div className="mb-6 space-y-2">
                <div className="text-noir-gold text-xs font-tech tracking-wider mb-2">EVIDENCE COLLECTED:</div>
                {clues.map(clue => (
                  <div key={clue.id} className="text-noir-white/60 text-sm font-body flex items-center gap-2">
                    <span className="text-noir-gold">•</span> {clue.name}: {clue.description}
                  </div>
                ))}
              </div>

              {/* Answer Options */}
              <div className="text-noir-gold text-xs font-tech tracking-wider mb-3">WHO IS RESPONSIBLE?</div>
              <div className="space-y-2">
                {CASE.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full text-left px-4 py-3 border border-noir-white/30 text-noir-white font-body hover:border-noir-gold hover:text-noir-gold transition-colors"
                  >
                    {index + 1}. {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Result Phase */}
      {phase === 'result' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/95 p-4"
        >
          <div className="max-w-lg w-full text-center">
            <div className="border border-noir-gold p-8 bg-black">
              {isCorrect ? (
                <>
                  <CheckCircle size={64} className="text-noir-gold mx-auto mb-4" />
                  <h2 className="text-noir-gold font-noir text-3xl tracking-wider mb-4">CASE CLOSED</h2>
                  <p className="text-noir-white/70 font-body mb-6">{CASE.solution}</p>
                </>
              ) : (
                <>
                  <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                  <h2 className="text-red-500 font-noir text-3xl tracking-wider mb-4">WRONG LEAD</h2>
                  <p className="text-noir-white/70 font-body mb-6">
                    The evidence doesn't support that conclusion. Review the clues more carefully.
                  </p>
                </>
              )}
              
              <button 
                onClick={resetGame}
                className="px-8 py-3 bg-noir-gold text-black font-noir tracking-wider hover:bg-yellow-500 transition-colors"
              >
                {isCorrect ? "NEW CASE" : "TRY AGAIN"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
