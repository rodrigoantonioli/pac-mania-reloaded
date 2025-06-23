
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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header com título - mais compacto */}
      <div className="text-center mb-3 sm:mb-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 tracking-wider mb-1 sm:mb-2 font-mono drop-shadow-lg">
          PAC-MAN
        </h1>
        <div className="text-cyan-400 text-xs sm:text-sm font-mono bg-black bg-opacity-50 px-2 sm:px-4 py-1 sm:py-2 rounded-lg mx-2">
          <span className="hidden sm:inline">Use SETAS ou WASD para mover • ENTER para iniciar • ESC para pausar • R para reiniciar</span>
          <span className="sm:hidden">WASD/Setas: mover • ENTER: iniciar • ESC: pausar • R: reiniciar</span>
        </div>
      </div>

      {/* Stats do jogo - usando novo componente */}
      <div className="mb-2 sm:mb-3">
        <GameStats gameState={gameState} />
      </div>

      {/* Controles - mais compactos em mobile */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-2 sm:mb-4 px-2">
        {gameStatus === 'ready' && (
          <Button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            INICIAR JOGO
          </Button>
        )}
        
        {gameStatus === 'playing' && (
          <Button
            onClick={onPause}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            PAUSAR
          </Button>
        )}
        
        {gameStatus === 'paused' && (
          <Button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            CONTINUAR
          </Button>
        )}
        
        <Button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          REINICIAR
        </Button>
      </div>

      {/* Status do jogo - mais compacto */}
      {gameStatus === 'gameOver' && (
        <div className="text-center p-3 sm:p-6 bg-gradient-to-r from-red-900 to-red-800 border border-red-600 rounded-lg shadow-lg mx-2">
          <div className="text-red-400 text-lg sm:text-2xl font-bold font-mono mb-2 sm:mb-3 animate-pulse">
            {lives <= 0 ? '💀 GAME OVER! 💀' : '🎉 PARABÉNS! VOCÊ VENCEU! 🎉'}
          </div>
          <div className="text-white font-mono text-sm sm:text-lg">
            Pontuação Final: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span>
          </div>
          <div className="text-gray-300 font-mono text-xs sm:text-sm mt-1 sm:mt-2">
            Pressione R para jogar novamente
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
