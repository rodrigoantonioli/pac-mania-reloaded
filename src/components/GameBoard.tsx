
import { GameState } from '@/types/game';
import { MAZE_WIDTH, MAZE_HEIGHT } from '@/utils/mazeData';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard = ({ gameState }: GameBoardProps) => {
  const { maze, pacman, ghosts } = gameState;

  const getCellContent = (x: number, y: number) => {
    // Verificar se é a posição do Pac-Man
    if (pacman.position.x === x && pacman.position.y === y) {
      const rotation = {
        'RIGHT': 'rotate-0',
        'LEFT': 'rotate-180',
        'UP': '-rotate-90',
        'DOWN': 'rotate-90'
      }[pacman.direction];
      
      return (
        <div className={`w-full h-full flex items-center justify-center ${rotation} transform transition-transform duration-100`}>
          <div className="w-5 h-5 bg-yellow-400 rounded-full relative animate-pulse">
            {/* Boca do Pac-Man */}
            <div className="absolute top-1/2 right-0 w-0 h-0 border-l-[5px] border-l-black border-t-[2.5px] border-t-transparent border-b-[2.5px] border-b-transparent transform -translate-y-1/2" />
          </div>
        </div>
      );
    }

    // Verificar se é a posição de algum fantasma
    const ghostAtPosition = ghosts.find(ghost => ghost.position.x === x && ghost.position.y === y);
    if (ghostAtPosition) {
      const ghostColors = {
        red: 'bg-red-500',
        pink: 'bg-pink-400',
        cyan: 'bg-cyan-400',
        orange: 'bg-orange-400'
      };
      
      const isScared = ghostAtPosition.mode === 'frightened';
      const colorClass = isScared ? 'bg-blue-600 animate-pulse' : ghostColors[ghostAtPosition.color as keyof typeof ghostColors];
      
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className={`w-5 h-5 ${colorClass} relative transition-colors duration-300`}>
            {/* Corpo do fantasma */}
            <div className="w-full h-3 rounded-t-full bg-current" />
            <div className="w-full h-2 bg-current relative">
              {/* Ondas na parte inferior */}
              <div className="absolute bottom-0 left-0 w-1 h-1 bg-black rounded-full" />
              <div className="absolute bottom-0 left-2 w-1 h-1 bg-black rounded-full" />
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-black rounded-full" />
            </div>
            {/* Olhos */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
            <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full" />
            {/* Pupilas */}
            <div className="absolute top-1.5 left-1 w-0.5 h-0.5 bg-black rounded-full" />
            <div className="absolute top-1.5 right-1 w-0.5 h-0.5 bg-black rounded-full" />
          </div>
        </div>
      );
    }

    // Conteúdo baseado no maze
    const cellValue = maze[y] && maze[y][x] !== undefined ? maze[y][x] : 0;
    switch (cellValue) {
      case 0: // Parede
        return <div className="w-full h-full bg-blue-700 border border-blue-500 shadow-inner" />;
      case 1: // Dot
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-1 h-1 bg-yellow-300 rounded-full" />
          </div>
        );
      case 2: // Power pellet
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse" />
          </div>
        );
      case 3: // Espaço vazio
      default:
        return <div className="w-full h-full bg-black" />;
    }
  };

  return (
    <div className="relative bg-black border-4 border-blue-600 rounded-lg shadow-2xl overflow-hidden">
      <div 
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${MAZE_HEIGHT}, 1fr)`,
          width: '540px',
          height: '620px'
        }}
      >
        {maze.map((row, y) =>
          row.map((_, x) => (
            <div
              key={`${x}-${y}`}
              className="relative"
              style={{ width: '100%', height: '100%' }}
            >
              {getCellContent(x, y)}
            </div>
          ))
        )}
      </div>
      
      {/* Overlay para status do jogo */}
      {gameState.gameStatus !== 'playing' && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="text-center">
            {gameState.gameStatus === 'ready' && (
              <div className="text-yellow-400 text-3xl font-bold animate-pulse font-mono">
                READY?
              </div>
            )}
            {gameState.gameStatus === 'paused' && (
              <div className="text-yellow-400 text-3xl font-bold font-mono">
                PAUSED
              </div>
            )}
            {gameState.gameStatus === 'gameOver' && (
              <div className="text-red-400 text-3xl font-bold animate-pulse font-mono">
                GAME OVER
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
