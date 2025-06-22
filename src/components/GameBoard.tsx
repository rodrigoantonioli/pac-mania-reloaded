
import { GameState } from '@/types/game';
import { MAZE_WIDTH, MAZE_HEIGHT, CELL_SIZE } from '@/utils/mazeData';

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
          <div className="w-6 h-6 bg-yellow-400 rounded-full relative animate-pulse">
            {/* Boca do Pac-Man - mais visível */}
            <div className="absolute top-1/2 right-0 w-0 h-0 border-l-[6px] border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent transform -translate-y-1/2" />
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
      const baseColor = isScared ? 'bg-blue-600' : ghostColors[ghostAtPosition.color as keyof typeof ghostColors];
      
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className={`w-6 h-6 ${baseColor} relative transition-colors duration-300`}>
            {/* Corpo principal do fantasma */}
            <div className="w-full h-4 bg-current rounded-t-full"></div>
            {/* Parte inferior com ondas */}
            <div className="w-full h-2 bg-current relative overflow-hidden">
              <div className="absolute bottom-0 w-full h-full bg-current"
                   style={{
                     clipPath: 'polygon(0% 0%, 16.66% 100%, 33.33% 0%, 50% 100%, 66.66% 0%, 83.33% 100%, 100% 0%, 100% 0%)'
                   }}>
              </div>
            </div>
            {/* Olhos brancos */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></div>
            {/* Pupilas pretas */}
            <div className="absolute top-1.5 left-1.5 w-0.5 h-0.5 bg-black rounded-full"></div>
            <div className="absolute top-1.5 right-1.5 w-0.5 h-0.5 bg-black rounded-full"></div>
            {/* Animação de pulsação quando assustado */}
            {isScared && <div className="absolute inset-0 bg-white opacity-20 rounded animate-pulse"></div>}
          </div>
        </div>
      );
    }

    // Conteúdo baseado no maze
    const cellValue = maze[y] && maze[y][x] !== undefined ? maze[y][x] : 0;
    switch (cellValue) {
      case 0: // Parede
        return <div className="w-full h-full bg-blue-800 border border-blue-600 shadow-inner" />;
      case 1: // Dot
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-sm" />
          </div>
        );
      case 2: // Power pellet
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-4 h-4 bg-yellow-300 rounded-full animate-pulse shadow-lg" />
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
        className="grid gap-0 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${MAZE_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${MAZE_HEIGHT}, ${CELL_SIZE}px)`,
          width: `${MAZE_WIDTH * CELL_SIZE}px`,
          height: `${MAZE_HEIGHT * CELL_SIZE}px`
        }}
      >
        {Array.from({ length: MAZE_HEIGHT }, (_, y) =>
          Array.from({ length: MAZE_WIDTH }, (_, x) => (
            <div
              key={`${x}-${y}`}
              className="relative"
              style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }}
            >
              {getCellContent(x, y)}
            </div>
          ))
        )}
      </div>
      
      {/* Overlay para status do jogo */}
      {gameState.gameStatus !== 'playing' && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="text-center">
            {gameState.gameStatus === 'ready' && (
              <div className="text-yellow-400 text-4xl font-bold animate-bounce font-mono">
                READY?
              </div>
            )}
            {gameState.gameStatus === 'paused' && (
              <div className="text-yellow-400 text-4xl font-bold font-mono">
                PAUSED
              </div>
            )}
            {gameState.gameStatus === 'gameOver' && (
              <div className="text-red-400 text-4xl font-bold animate-pulse font-mono">
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
