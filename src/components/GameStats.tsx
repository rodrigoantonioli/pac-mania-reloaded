
import { Card } from "@/components/ui/card";
import { GameState } from '@/types/game';
import { Trophy, Heart, Target } from 'lucide-react';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats = ({ gameState }: GameStatsProps) => {
  const { score, lives, level, dotsRemaining } = gameState;

  return (
    <Card className="bg-gradient-to-r from-gray-900 to-blue-900 border-blue-600 p-2 sm:p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-2 text-yellow-400 text-xs sm:text-sm font-bold font-mono mb-1">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">SCORE</span>
            <span className="sm:hidden">PTS</span>
          </div>
          <div className="text-white text-sm sm:text-xl font-mono font-bold">
            {score.toLocaleString()}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-2 text-red-400 text-xs sm:text-sm font-bold font-mono mb-1">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">LIVES</span>
            <span className="sm:hidden">VIDA</span>
          </div>
          <div className="flex justify-center gap-0.5 sm:gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full transition-all duration-300 ${
                  i < lives 
                    ? 'bg-yellow-400 shadow-lg animate-pulse' 
                    : 'bg-gray-700 opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-2 text-cyan-400 text-xs sm:text-sm font-bold font-mono mb-1">
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">LEVEL</span>
            <span className="sm:hidden">LVL</span>
          </div>
          <div className="text-white text-sm sm:text-xl font-mono font-bold">
            {level}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-green-400 text-xs sm:text-sm font-bold font-mono mb-1">
            <span className="hidden sm:inline">DOTS</span>
            <span className="sm:hidden">DOT</span>
          </div>
          <div className="text-white text-sm sm:text-xl font-mono font-bold">
            {dotsRemaining}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameStats;
