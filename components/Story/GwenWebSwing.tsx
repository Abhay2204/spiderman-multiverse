import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, RotateCcw, Trophy } from 'lucide-react';

type ColorType = 'pink' | 'cyan' | 'yellow' | 'white';

const COLORS: { type: ColorType; bg: string; border: string; key: string }[] = [
  { type: 'pink', bg: 'bg-gwen-pink', border: 'border-gwen-pink', key: 'A' },
  { type: 'cyan', bg: 'bg-gwen-cyan', border: 'border-gwen-cyan', key: 'S' },
  { type: 'yellow', bg: 'bg-yellow-400', border: 'border-yellow-400', key: 'D' },
  { type: 'white', bg: 'bg-white', border: 'border-white', key: 'F' },
];

export const GwenWebSwing: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentColor, setCurrentColor] = useState<ColorType>('pink');
  const [timeLeft, setTimeLeft] = useState(100);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [round, setRound] = useState(1);

  const pickRandomColor = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    setCurrentColor(COLORS[randomIndex].type);
  }, []);

  const handleColorClick = useCallback((clickedColor: ColorType) => {
    if (!gameStarted || gameOver) return;

    if (clickedColor === currentColor) {
      // Correct!
      const points = 10 + streak * 2;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setTimeLeft(prev => Math.min(100, prev + 5));
      setFeedback('correct');
      setRound(prev => prev + 1);
      pickRandomColor();
    } else {
      // Wrong!
      setStreak(0);
      setTimeLeft(prev => Math.max(0, prev - 20));
      setFeedback('wrong');
    }

    setTimeout(() => setFeedback(null), 200);
  }, [gameStarted, gameOver, currentColor, streak, pickRandomColor]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      const key = e.key.toUpperCase();
      const colorIndex = COLORS.findIndex(c => c.key === key);
      if (colorIndex !== -1) {
        handleColorClick(COLORS[colorIndex].type);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, handleColorClick]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setGameOver(true);
          setHighScore(hs => Math.max(hs, score));
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, score]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(100);
    setRound(1);
    pickRandomColor();
  };

  const getColorStyle = (type: ColorType) => {
    switch (type) {
      case 'pink': return { bg: '#FF69B4', glow: 'rgba(255, 105, 180, 0.6)' };
      case 'cyan': return { bg: '#00CED1', glow: 'rgba(0, 206, 209, 0.6)' };
      case 'yellow': return { bg: '#FACC15', glow: 'rgba(250, 204, 21, 0.6)' };
      case 'white': return { bg: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.6)' };
    }
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden select-none" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}>
      {/* Punk dots background */}
      <div className="absolute inset-0 punk-dots opacity-20" />

      {/* Feedback flash */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 z-50 pointer-events-none ${feedback === 'correct' ? 'bg-green-500/30' : 'bg-red-500/30'}`}
          />
        )}
      </AnimatePresence>

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start">
        <div className="bg-black/80 border-2 border-gwen-pink px-4 py-2">
          <div className="text-gwen-pink font-title text-3xl">{score}</div>
          <div className="text-white/60 text-xs font-tech">SCORE</div>
        </div>

        <div className="text-center">
          {streak > 2 && (
            <motion.div
              key={streak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gwen-cyan text-black px-4 py-1 font-shout text-lg"
            >
              🔥 {streak} STREAK!
            </motion.div>
          )}
        </div>

        <div className="bg-black/80 border-2 border-gwen-cyan px-4 py-2">
          <div className="text-gwen-cyan font-title text-xl">#{round}</div>
          <div className="text-white/60 text-xs font-tech">ROUND</div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="absolute top-20 left-4 right-4 z-20">
        <div className="h-3 bg-black/50 border border-white/20 overflow-hidden">
          <motion.div
            className="h-full"
            animate={{ width: `${timeLeft}%` }}
            transition={{ duration: 0.1 }}
            style={{
              background: timeLeft > 30 
                ? 'linear-gradient(90deg, #FF69B4, #00CED1)' 
                : 'linear-gradient(90deg, #ef4444, #f97316)',
            }}
          />
        </div>
      </div>

      {/* Main Game Area */}
      {gameStarted && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16">
          {/* Target Color Display */}
          <div className="mb-8 text-center">
            <div className="text-white/60 font-tech text-sm mb-2 tracking-widest">MATCH THIS COLOR</div>
            <motion.div
              key={currentColor}
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-32 h-32 rounded-lg border-4 mx-auto"
              style={{
                backgroundColor: getColorStyle(currentColor).bg,
                borderColor: 'white',
                boxShadow: `0 0 40px ${getColorStyle(currentColor).glow}`,
              }}
            />
          </div>

          {/* Color Buttons */}
          <div className="flex gap-4 flex-wrap justify-center px-4">
            {COLORS.map((color) => (
              <motion.button
                key={color.type}
                onClick={() => handleColorClick(color.type)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 rounded-lg border-4 border-white/50 flex flex-col items-center justify-center transition-all hover:border-white"
                style={{
                  backgroundColor: getColorStyle(color.type).bg,
                  boxShadow: `0 0 20px ${getColorStyle(color.type).glow}`,
                }}
              >
                <span className="font-title text-black text-2xl drop-shadow-lg">{color.key}</span>
              </motion.button>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-8 text-white/40 text-xs font-tech text-center">
            Press A, S, D, F or click the matching color!
          </div>
        </div>
      )}

      {/* Start / Game Over Screen */}
      {(!gameStarted || gameOver) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-8 border-4 border-gwen-pink bg-gwen-black max-w-sm mx-4"
          >
            {gameOver ? (
              <>
                <Trophy size={48} className="text-gwen-cyan mx-auto mb-4" />
                <h2 className="font-title text-4xl text-gwen-pink mb-2">GAME OVER!</h2>
                <p className="font-title text-gwen-cyan text-3xl mb-1">{score}</p>
                <p className="font-tech text-white/60 text-sm mb-4">
                  {score > highScore ? '🎉 NEW HIGH SCORE!' : `Best: ${highScore}`}
                </p>
                <p className="font-body text-white/60 mb-6">
                  {score >= 200 ? "Amazing reflexes! 🕷️" : score >= 100 ? "Great job!" : "Keep practicing!"}
                </p>
              </>
            ) : (
              <>
                <Zap size={48} className="text-gwen-pink mx-auto mb-4" />
                <h2 className="font-title text-4xl text-white mb-2">COLOR MATCH</h2>
                <p className="font-body text-white/60 mb-6">
                  Match the color as fast as you can! Build streaks for bonus points. Don't let the timer run out!
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {COLORS.map((c) => (
                    <div
                      key={c.type}
                      className="w-10 h-10 rounded border-2 border-white/50 flex items-center justify-center font-title text-black"
                      style={{ backgroundColor: getColorStyle(c.type).bg }}
                    >
                      {c.key}
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
              onClick={startGame}
              className="px-8 py-3 bg-gwen-pink hover:bg-pink-400 text-black font-title text-xl border-2 border-white shadow-[4px_4px_0px_#00CED1] active:shadow-none active:translate-y-1 transition-all"
            >
              {gameOver ? "PLAY AGAIN" : "START!"}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
