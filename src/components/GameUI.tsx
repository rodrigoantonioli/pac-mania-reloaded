
import { Button } from "@/components/ui/button";
import { GameState } from '@/types/game';
import { Play, RotateCcw, Pause } from 'lucide-react';
import GameStats from './GameStats';

interface GameUIProps {
  gameState: GameState;
  onStart: () => void;
  onPause?: () => void;
  onReset: () => void;
}

const GameUI = ({ gameState, onStart, onPause, onReset }: GameUIProps) => {
  const { score, lives, gameStatus } = gameState;

  return (
    <div className="w-full max-w-2xl">
      {/* Header com título */}
      <div className="text-center mb-6">
        <h1 className="text-6xl font-bold text-yellow-400 tracking-wider mb-2 font-mono drop-shadow-lg">
          PAC-MAN
        </h1>
        <div className="text-cyan-400 text-sm font-mono bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          Use SETAS ou WASD para mover • ENTER para iniciar • ESC para pausar • R para reiniciar
        </div>
      </div>

      {/* Stats do jogo - usando novo componente */}
      <div className="mb-4">
        <GameStats gameState={gameState} />
      </div>

      {/* Controles */}
      <div className="flex justify-center gap-4 mb-4">
        {gameStatus === 'ready' && (
          <Button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-lg transition-all duration-200 transform hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            INICIAR JOGO
          </Button>
        )}
        
        {gameStatus === 'playing' && (
          <Button
            onClick={onPause}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 text-lg transition-all duration-200 transform hover:scale-105"
          >
            <Pause className="w-5 h-5 mr-2" />
            PAUSAR
          </Button>
        )}
        
        {gameStatus === 'paused' && (
          <Button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-lg transition-all duration-200 transform hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            CONTINUAR
          </Button>
        )}
        
        <Button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 text-lg transition-all duration-200 transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          REINICIAR
        </Button>
      </div>

      {/* Status do jogo */}
      {gameStatus === 'gameOver' && (
        <div className="text-center p-6 bg-gradient-to-r from-red-900 to-red-800 border border-red-600 rounded-lg shadow-lg">
          <div className="text-red-400 text-2xl font-bold font-mono mb-3 animate-pulse">
            {lives <= 0 ? '💀 GAME OVER! 💀' : '🎉 PARABÉNS! VOCÊ VENCEU! 🎉'}
          </div>
          <div className="text-white font-mono text-lg">
            Pontuação Final: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span>
          </div>
          <div className="text-gray-300 font-mono text-sm mt-2">
            Pressione R para jogar novamente
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
