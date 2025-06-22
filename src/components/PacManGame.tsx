
import { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import GameUI from './GameUI';
import { GameState, Position, Direction, Ghost } from '@/types/game';
import { MAZE_WIDTH, MAZE_HEIGHT, INITIAL_MAZE } from '@/utils/mazeData';
import { toast } from 'sonner';

const PacManGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    gameStatus: 'ready', // ready, playing, paused, gameOver
    pacman: {
      position: { x: 13, y: 26 },
      direction: 'RIGHT',
      nextDirection: 'RIGHT'
    },
    ghosts: [
      { id: 1, position: { x: 13, y: 11 }, direction: 'UP', color: 'red', mode: 'scatter' },
      { id: 2, position: { x: 12, y: 13 }, direction: 'UP', color: 'pink', mode: 'scatter' },
      { id: 3, position: { x: 13, y: 13 }, direction: 'UP', color: 'cyan', mode: 'scatter' },
      { id: 4, position: { x: 14, y: 13 }, direction: 'UP', color: 'orange', mode: 'scatter' }
    ],
    maze: INITIAL_MAZE,
    dotsRemaining: 0
  });

  // Contar dots iniciais
  useEffect(() => {
    const initialDots = INITIAL_MAZE.flat().filter(cell => cell === 1 || cell === 2).length;
    setGameState(prev => ({ ...prev, dotsRemaining: initialDots }));
  }, []);

  const moveEntity = (position: Position, direction: Direction): Position => {
    let newX = position.x;
    let newY = position.y;

    switch (direction) {
      case 'UP':
        newY = Math.max(0, position.y - 1);
        break;
      case 'DOWN':
        newY = Math.min(MAZE_HEIGHT - 1, position.y + 1);
        break;
      case 'LEFT':
        newX = position.x - 1;
        if (newX < 0) newX = MAZE_WIDTH - 1; // Túnel
        break;
      case 'RIGHT':
        newX = position.x + 1;
        if (newX >= MAZE_WIDTH) newX = 0; // Túnel
        break;
    }

    // Verificar se a nova posição é uma parede
    if (gameState.maze[newY] && gameState.maze[newY][newX] === 0) {
      return position; // Não pode mover
    }

    return { x: newX, y: newY };
  };

  const checkCollisions = useCallback(() => {
    const { pacman, ghosts } = gameState;
    
    // Verificar colisão com fantasmas
    const collision = ghosts.find(ghost => 
      ghost.position.x === pacman.position.x && 
      ghost.position.y === pacman.position.y
    );

    if (collision) {
      if (collision.mode === 'frightened') {
        // Pac-Man comeu um fantasma
        setGameState(prev => ({
          ...prev,
          score: prev.score + 200,
          ghosts: prev.ghosts.map(g => 
            g.id === collision.id 
              ? { ...g, position: { x: 13, y: 13 }, mode: 'scatter' }
              : g
          )
        }));
        toast("Fantasma comido! +200 pontos!");
      } else {
        // Pac-Man foi pego
        setGameState(prev => ({
          ...prev,
          lives: prev.lives - 1,
          pacman: { ...prev.pacman, position: { x: 13, y: 26 } }
        }));
        toast("Você foi pego!");
      }
    }
  }, [gameState]);

  const eatDot = useCallback(() => {
    const { pacman, maze } = gameState;
    const cellValue = maze[pacman.position.y][pacman.position.x];
    
    if (cellValue === 1) {
      // Dot normal
      const newMaze = maze.map(row => [...row]);
      newMaze[pacman.position.y][pacman.position.x] = 3; // Célula vazia
      
      setGameState(prev => ({
        ...prev,
        maze: newMaze,
        score: prev.score + 10,
        dotsRemaining: prev.dotsRemaining - 1
      }));
    } else if (cellValue === 2) {
      // Power pellet
      const newMaze = maze.map(row => [...row]);
      newMaze[pacman.position.y][pacman.position.x] = 3;
      
      setGameState(prev => ({
        ...prev,
        maze: newMaze,
        score: prev.score + 50,
        dotsRemaining: prev.dotsRemaining - 1,
        ghosts: prev.ghosts.map(ghost => ({ ...ghost, mode: 'frightened' }))
      }));
      
      // Retornar fantasmas ao normal após 10 segundos
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          ghosts: prev.ghosts.map(ghost => ({ ...ghost, mode: 'scatter' }))
        }));
      }, 10000);
      
      toast("Power Pellet! Fantasmas estão assustados!");
    }
  }, [gameState]);

  const moveGhosts = useCallback(() => {
    setGameState(prev => {
      const newGhosts = prev.ghosts.map(ghost => {
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const validDirections = directions.filter(dir => {
          const newPos = moveEntity(ghost.position, dir);
          return newPos.x !== ghost.position.x || newPos.y !== ghost.position.y;
        });
        
        if (validDirections.length === 0) return ghost;
        
        // IA simples: movimento aleatório
        const randomDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
        const newPosition = moveEntity(ghost.position, randomDirection);
        
        return {
          ...ghost,
          position: newPosition,
          direction: randomDirection
        };
      });
      
      return { ...prev, ghosts: newGhosts };
    });
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.gameStatus !== 'playing') return;

    let newDirection: Direction | null = null;
    
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        newDirection = 'UP';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        newDirection = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        newDirection = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        newDirection = 'RIGHT';
        break;
      case ' ':
        event.preventDefault();
        setGameState(prev => ({
          ...prev,
          gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing'
        }));
        return;
    }

    if (newDirection) {
      event.preventDefault();
      setGameState(prev => ({
        ...prev,
        pacman: { ...prev.pacman, nextDirection: newDirection! }
      }));
    }
  }, [gameState.gameStatus]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        // Mover Pac-Man
        const canMoveInNextDirection = (() => {
          const testPos = moveEntity(prev.pacman.position, prev.pacman.nextDirection);
          return testPos.x !== prev.pacman.position.x || testPos.y !== prev.pacman.position.y;
        })();

        const direction = canMoveInNextDirection ? prev.pacman.nextDirection : prev.pacman.direction;
        const newPacmanPosition = moveEntity(prev.pacman.position, direction);

        return {
          ...prev,
          pacman: {
            ...prev.pacman,
            position: newPacmanPosition,
            direction: direction
          }
        };
      });
    }, 200);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStatus]);

  // Ghost movement loop
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const ghostLoop = setInterval(moveGhosts, 400);
    return () => clearInterval(ghostLoop);
  }, [gameState.gameStatus, moveGhosts]);

  // Check for collisions and eat dots
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      eatDot();
      checkCollisions();
    }
  }, [gameState.pacman.position, checkCollisions, eatDot]);

  // Check win/lose conditions
  useEffect(() => {
    if (gameState.lives <= 0) {
      setGameState(prev => ({ ...prev, gameStatus: 'gameOver' }));
      toast("Game Over!");
    } else if (gameState.dotsRemaining <= 0) {
      setGameState(prev => ({ ...prev, gameStatus: 'gameOver' }));
      toast("Parabéns! Você venceu!");
    }
  }, [gameState.lives, gameState.dotsRemaining]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    toast("Jogo iniciado! Use as setas ou WASD para mover.");
  };

  const resetGame = () => {
    const initialDots = INITIAL_MAZE.flat().filter(cell => cell === 1 || cell === 2).length;
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameStatus: 'ready',
      pacman: {
        position: { x: 13, y: 26 },
        direction: 'RIGHT',
        nextDirection: 'RIGHT'
      },
      ghosts: [
        { id: 1, position: { x: 13, y: 11 }, direction: 'UP', color: 'red', mode: 'scatter' },
        { id: 2, position: { x: 12, y: 13 }, direction: 'UP', color: 'pink', mode: 'scatter' },
        { id: 3, position: { x: 13, y: 13 }, direction: 'UP', color: 'cyan', mode: 'scatter' },
        { id: 4, position: { x: 14, y: 13 }, direction: 'UP', color: 'orange', mode: 'scatter' }
      ],
      maze: INITIAL_MAZE.map(row => [...row]),
      dotsRemaining: initialDots
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <GameUI 
        gameState={gameState}
        onStart={startGame}
        onReset={resetGame}
      />
      <GameBoard gameState={gameState} />
    </div>
  );
};

export default PacManGame;
