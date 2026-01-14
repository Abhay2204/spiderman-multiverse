import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, RefreshCw, Trophy } from 'lucide-react';

interface Enemy {
  id: number;
  x: number;
  y: number;
  health: number;
}

export const MilesVenomStrike: React.FC = () => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [venomCharge, setVenomCharge] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const spawnEnemy = useCallback(() => {
    const newEnemy: Enemy = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      health: 1,
    };
    setEnemies(prev => [...prev, newEnemy]);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const spawnInterval = setInterval(spawnEnemy, 1200);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timer);
    };
  }, [gameStarted, gameOver, spawnEnemy]);

  // Recharge venom
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const recharge = setInterval(() => {
      setVenomCharge(prev => Math.min(100, prev + 5));
    }, 500);
    return () => clearInterval(recharge);
  }, [gameStarted, gameOver]);

  const handleVenomStrike = (enemyId: number) => {
    if (venomCharge < 20) return;
    
    setVenomCharge(prev => prev - 20);
    setEnemies(prev => prev.filter(e => e.id !== enemyId));
    setScore(prev => prev + (100 * (combo + 1)));
    setCombo(prev => prev + 1);

    // Reset combo after 2 seconds of no hits
    setTimeout(() => setCombo(0), 2000);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setVenomCharge(100);
    setTimeLeft(30);
    setEnemies([]);
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden select-none">
      {/* Brooklyn Skyline Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'hue-rotate(280deg) saturate(150%)',
        }}
      />
      
      {/* Glitch Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[2px] bg-miles-pink opacity-30"
            style={{ top: `${20 + i * 15}%` }}
            animate={{ 
              x: [-100, 100, -100],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{ 
              duration: 2 + i * 0.5, 
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start">
        <div className="space-y-2">
          <div className="bg-black/80 border border-miles-pink px-4 py-2 backdrop-blur-sm">
            <div className="text-miles-pink font-shout text-2xl">{score}</div>
            <div className="text-white/60 text-xs font-tech">SCORE</div>
          </div>
          {combo > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-miles-pink text-black px-3 py-1 font-shout"
            >
              {combo}x COMBO!
            </motion.div>
          )}
        </div>

        <div className="text-right space-y-2">
          <div className="bg-black/80 border border-white/30 px-4 py-2 backdrop-blur-sm">
            <div className="text-white font-tech text-xl">{timeLeft}s</div>
          </div>
          
          {/* Venom Charge Bar */}
          <div className="w-32 bg-black/80 border border-miles-pink p-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={12} className="text-miles-pink" />
              <span className="text-[10px] font-tech text-miles-pink">VENOM</span>
            </div>
            <div className="h-2 bg-black/50 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-miles-pink to-miles-purple"
                animate={{ width: `${venomCharge}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 cursor-crosshair">
        <AnimatePresence>
          {enemies.map((enemy) => (
            <motion.button
              key={enemy.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              onClick={() => handleVenomStrike(enemy.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
              style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
              disabled={venomCharge < 20}
            >
              <div className="relative">
                {/* Enemy Target */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-red-400 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] transition-shadow">
                  <Target size={24} className="text-white" />
                </div>
                
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50" />
                
                {/* Venom Strike Effect on Hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-[-10px] rounded-full border-2 border-miles-pink animate-pulse" />
                  <Zap className="absolute -top-2 -right-2 text-miles-pink" size={20} />
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Venom Strike Visual Effect */}
        <svg className="absolute inset-0 pointer-events-none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Start/Game Over Screen */}
      {(!gameStarted || gameOver) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-8 border-2 border-miles-pink bg-black max-w-md"
          >
            {gameOver ? (
              <>
                <Trophy size={48} className="text-miles-pink mx-auto mb-4" />
                <h2 className="font-shout text-4xl text-white mb-2 glitch-text" data-text="TIME'S UP!">TIME'S UP!</h2>
                <p className="font-tech text-miles-pink text-2xl mb-4">FINAL SCORE: {score}</p>
                <p className="font-body text-white/60 mb-6">
                  {score >= 2000 ? "You're the new Spider-Man!" : score >= 1000 ? "Not bad, rookie!" : "Keep practicing!"}
                </p>
              </>
            ) : (
              <>
                <Zap size={48} className="text-miles-pink mx-auto mb-4" />
                <h2 className="font-shout text-4xl text-white mb-2">VENOM STRIKE</h2>
                <p className="font-body text-white/60 mb-6">
                  Click enemies to unleash your bio-electric powers! Build combos for bonus points.
                </p>
              </>
            )}
            
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-miles-pink hover:bg-pink-400 text-black font-shout text-xl tracking-wider border-2 border-white shadow-[4px_4px_0px_white] active:shadow-none active:translate-y-1 transition-all"
            >
              {gameOver ? "PLAY AGAIN" : "START"}
            </button>
          </motion.div>
        </div>
      )}

      {/* Low Venom Warning */}
      {venomCharge < 20 && gameStarted && !gameOver && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-900/80 border border-red-500 px-4 py-2 text-red-200 font-tech text-sm"
        >
          LOW VENOM - RECHARGING...
        </motion.div>
      )}
    </div>
  );
};
