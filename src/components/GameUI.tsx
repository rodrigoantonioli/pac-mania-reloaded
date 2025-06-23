
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
    <div className="w-full px-2 sm:px-4 py-1 sm:py-2 bg-black">
      {/* Header compacto */}
      <div className="text-center mb-1 sm:mb-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 tracking-wider mb-1 font-mono drop-shadow-lg">
          PAC-MAN
        </h1>
        <div className="text-cyan-400 text-xs font-mono bg-black bg-opacity-50 px-2 py-1 rounded mx-2">
          <span className="hidden sm:inline">Use SETAS/WASD para mover ou arraste o dedo • ENTER: iniciar • ESC: pausar • R: reiniciar</span>
          <span className="sm:hidden">Arraste o dedo ou use teclas • ENTER: iniciar • ESC: pausar • R: reiniciar</span>
        </div>
      </div>

      {/* Stats compactos */}
      <div className="mb-1 sm:mb-2">
        <GameStats gameState={gameState} />
      </div>

      {/* Controles em linha para economizar espaço */}
      <div className="flex justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
        {gameStatus === 'ready' && (
          <Button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm transition-all duration-200 transform hover:scale-105"
          >
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            INICIAR
          </Button>
        )}
        
        {gameStatus === 'playing' && (
          <Button
            onClick={onPause}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm transition-all duration-200 transform hover:scale-105"
          >
            <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            PAUSAR
          </Button>
        )}
        
        {gameStatus === 'paused' && (
          <Button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm transition-all duration-200 transform hover:scale-105"
          >
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            CONTINUAR
          </Button>
        )}
        
        <Button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm transition-all duration-200 transform hover:scale-105"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          REINICIAR
        </Button>
      </div>

      {/* Status do jogo - mais compacto */}
      {gameStatus === 'gameOver' && (
        <div className="text-center p-2 sm:p-3 bg-gradient-to-r from-red-900 to-red-800 border border-red-600 rounded-lg shadow-lg mx-2">
          <div className="text-red-400 text-sm sm:text-lg font-bold font-mono mb-1 animate-pulse">
            {lives <= 0 ? '💀 GAME OVER! 💀' : '🎉 PARABÉNS! VOCÊ VENCEU! 🎉'}
          </div>
          <div className="text-white font-mono text-xs sm:text-sm">
            Pontuação Final: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span>
          </div>
          <div className="text-gray-300 font-mono text-xs mt-1">
            Pressione R para jogar novamente
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
