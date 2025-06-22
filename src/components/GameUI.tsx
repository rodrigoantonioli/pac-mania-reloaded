
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameState } from '@/types/game';
import { Play, RotateCcw, Pause } from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
  highScore: number;
  onStart: () => void;
  onPause?: () => void;
  onReset: () => void;
}

const GameUI = ({ gameState, highScore, onStart, onPause, onReset }: GameUIProps) => {
  const { score, lives, level, gameStatus } = gameState;

  return (
    <div className="w-full max-w-2xl">
      {/* Header com título */}
      <div className="text-center mb-6">
        <h1 className="text-6xl font-bold text-yellow-400 tracking-wider mb-2 font-mono">
          PAC-MAN
        </h1>
        <div className="text-cyan-400 text-sm font-mono">
          Use SETAS ou WASD para mover • ESPAÇO para pausar
        </div>
      </div>

      {/* Stats do jogo */}
      <Card className="bg-gray-900 border-blue-600 p-4 mb-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-yellow-400 text-lg font-bold font-mono">
              SCORE
            </div>
            <div className="text-white text-2xl font-mono">
              {score.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-green-400 text-lg font-bold font-mono">
              HIGH SCORE
            </div>
            <div className="text-white text-2xl font-mono">
              {highScore.toLocaleString()}
            </div>
          </div>
          
          <div>
            <div className="text-red-400 text-lg font-bold font-mono">
              LIVES
            </div>
            <div className="flex justify-center gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${
                    i < lives ? 'bg-yellow-400' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-cyan-400 text-lg font-bold font-mono">
              LEVEL
            </div>
            <div className="text-white text-2xl font-mono">
              {level}
            </div>
          </div>
        </div>
      </Card>

      {/* Controles */}
      <div className="flex justify-center gap-4">
        {gameStatus === 'ready' && (
          <Button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            INICIAR JOGO
          </Button>
        )}
        
        {gameStatus === 'playing' && (
          <Button
            onClick={onPause}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 text-lg"
          >
            <Pause className="w-5 h-5 mr-2" />
            PAUSAR
          </Button>
        )}
        
        {gameStatus === 'paused' && (
          <Button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            CONTINUAR
          </Button>
        )}
        
        <Button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 text-lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          REINICIAR
        </Button>
      </div>

      {/* Status do jogo */}
      {gameStatus === 'gameOver' && (
        <div className="text-center mt-4 p-4 bg-red-900 border border-red-600 rounded-lg">
          <div className="text-red-400 text-xl font-bold font-mono mb-2">
            {lives <= 0 ? 'GAME OVER!' : 'PARABÉNS! VOCÊ VENCEU!'}
          </div>
          <div className="text-white font-mono">
            Pontuação Final: {score.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
