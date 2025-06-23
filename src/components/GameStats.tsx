
import { Card } from "@/components/ui/card";
import { GameState } from '@/types/game';
import { Trophy, Heart, Target } from 'lucide-react';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats = ({ gameState }: GameStatsProps) => {
  const { score, lives, level, dotsRemaining } = gameState;

  return (
    <Card className="bg-gradient-to-r from-gray-900 to-blue-900 border-blue-600 p-1 sm:p-2">
      <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold font-mono mb-0.5">
            <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline text-xs">PTS</span>
          </div>
          <div className="text-white text-xs sm:text-sm font-mono font-bold">
            {score.toLocaleString()}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-red-400 text-xs font-bold font-mono mb-0.5">
            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline text-xs">VIDA</span>
          </div>
          <div className="flex justify-center gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  i < lives 
                    ? 'bg-yellow-400 shadow-lg animate-pulse' 
                    : 'bg-gray-700 opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold font-mono mb-0.5">
            <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline text-xs">LVL</span>
          </div>
          <div className="text-white text-xs sm:text-sm font-mono font-bold">
            {level}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-green-400 text-xs font-bold font-mono mb-0.5">
            <span className="hidden xs:inline">DOT</span>
            <span className="xs:hidden">•</span>
          </div>
          <div className="text-white text-xs sm:text-sm font-mono font-bold">
            {dotsRemaining}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameStats;
