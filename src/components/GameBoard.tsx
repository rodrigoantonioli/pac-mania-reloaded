
import { GameState } from '@/types/game';
import { MAZE_WIDTH, MAZE_HEIGHT, CELL_SIZE } from '@/utils/mazeData';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard = ({ gameState }: GameBoardProps) => {
  const { maze, pacman, ghosts } = gameState;

  // Calcular tamanho responsivo do cell baseado na altura disponível da viewport
  const getResponsiveCellSize = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Reservar espaço para UI (aproximadamente 200px no mobile, 250px no desktop)
      const reservedHeight = screenWidth < 640 ? 180 : 220;
      const availableHeight = screenHeight - reservedHeight;
      const availableWidth = screenWidth - 32; // padding lateral
      
      const cellByWidth = Math.floor(availableWidth / MAZE_WIDTH);
      const cellByHeight = Math.floor(availableHeight / MAZE_HEIGHT);
      
      // Usar o menor para garantir que caiba na tela
      const optimalSize = Math.min(cellByWidth, cellByHeight);
      
      // Limites mínimos e máximos
      if (screenWidth < 640) {
        return Math.max(Math.min(optimalSize, 14), 8); // Entre 8px e 14px no mobile
      } else {
        return Math.max(Math.min(optimalSize, CELL_SIZE), 12); // Entre 12px e 20px no desktop
      }
    }
    
    return CELL_SIZE;
  };

  const responsiveCellSize = getResponsiveCellSize();

  const getCellContent = (x: number, y: number) => {
    // Verificar se é a posição do Pac-Man
    if (pacman.position.x === x && pacman.position.y === y) {
      const rotation = {
        'RIGHT': 'rotate-0',
        'LEFT': 'rotate-180', 
        'UP': '-rotate-90',
        'DOWN': 'rotate-90'
      }[pacman.direction];
      
      const pacmanSize = Math.max(responsiveCellSize * 0.7, 12);
      
      return (
        <div className={`w-full h-full flex items-center justify-center ${rotation} transform transition-transform duration-100`}>
          <div 
            className="bg-yellow-400 rounded-full relative animate-pulse"
            style={{ width: `${pacmanSize}px`, height: `${pacmanSize}px` }}
          >
            {/* Boca do Pac-Man - mais visível */}
            <div 
              className="absolute top-1/2 right-0 border-l-black border-t-transparent border-b-transparent transform -translate-y-1/2"
              style={{
                borderLeftWidth: `${pacmanSize * 0.25}px`,
                borderTopWidth: `${pacmanSize * 0.125}px`,
                borderBottomWidth: `${pacmanSize * 0.125}px`
              }}
            />
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
      const ghostSize = Math.max(responsiveCellSize * 0.7, 12);
      
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div 
            className={`${baseColor} relative transition-colors duration-300`}
            style={{ width: `${ghostSize}px`, height: `${ghostSize}px` }}
          >
            {/* Corpo principal do fantasma */}
            <div className="w-full h-4/6 bg-current rounded-t-full"></div>
            {/* Parte inferior com ondas */}
            <div className="w-full h-2/6 bg-current relative overflow-hidden">
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
    const dotSize = Math.max(responsiveCellSize * 0.2, 3);
    const powerPelletSize = Math.max(responsiveCellSize * 0.5, 8);
    
    switch (cellValue) {
      case 0: // Parede
        return <div className="w-full h-full bg-blue-800 border border-blue-600 shadow-inner" />;
      case 1: // Dot
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div 
              className="bg-yellow-300 rounded-full shadow-sm"
              style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
            />
          </div>
        );
      case 2: // Power pellet
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div 
              className="bg-yellow-300 rounded-full animate-pulse shadow-lg"
              style={{ width: `${powerPelletSize}px`, height: `${powerPelletSize}px` }}
            />
          </div>
        );
      case 3: // Espaço vazio
      default:
        return <div className="w-full h-full bg-black" />;
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="relative bg-black border border-blue-600 rounded-lg shadow-2xl overflow-hidden">
        <div 
          className="grid gap-0 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${MAZE_WIDTH}, ${responsiveCellSize}px)`,
            gridTemplateRows: `repeat(${MAZE_HEIGHT}, ${responsiveCellSize}px)`,
            width: `${MAZE_WIDTH * responsiveCellSize}px`,
            height: `${MAZE_HEIGHT * responsiveCellSize}px`
          }}
        >
          {Array.from({ length: MAZE_HEIGHT }, (_, y) =>
            Array.from({ length: MAZE_WIDTH }, (_, x) => (
              <div
                key={`${x}-${y}`}
                className="relative"
                style={{ width: `${responsiveCellSize}px`, height: `${responsiveCellSize}px` }}
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
                <div className="text-yellow-400 text-xl sm:text-3xl font-bold animate-bounce font-mono">
                  READY?
                </div>
              )}
              {gameState.gameStatus === 'paused' && (
                <div className="text-yellow-400 text-xl sm:text-3xl font-bold font-mono">
                  PAUSED
                </div>
              )}
              {gameState.gameStatus === 'gameOver' && (
                <div className="text-red-400 text-xl sm:text-3xl font-bold animate-pulse font-mono">
                  GAME OVER
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
