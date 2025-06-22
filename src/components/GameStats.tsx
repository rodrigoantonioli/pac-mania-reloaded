
import { Card } from "@/components/ui/card";
import { GameState } from '@/types/game';
import { Trophy, Heart, Target } from 'lucide-react';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats = ({ gameState }: GameStatsProps) => {
  const { score, lives, level, dotsRemaining } = gameState;

  return (
    <Card className="bg-gradient-to-r from-gray-900 to-blue-900 border-blue-600 p-4">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold font-mono mb-1">
            <Trophy className="w-4 h-4" />
            SCORE
          </div>
          <div className="text-white text-xl font-mono font-bold">
            {score.toLocaleString()}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-red-400 text-sm font-bold font-mono mb-1">
            <Heart className="w-4 h-4" />
            LIVES
          </div>
          <div className="flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  i < lives 
                    ? 'bg-yellow-400 shadow-lg animate-pulse' 
                    : 'bg-gray-700 opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold font-mono mb-1">
            <Target className="w-4 h-4" />
            LEVEL
          </div>
          <div className="text-white text-xl font-mono font-bold">
            {level}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-green-400 text-sm font-bold font-mono mb-1">
            DOTS
          </div>
          <div className="text-white text-xl font-mono font-bold">
            {dotsRemaining}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameStats;
