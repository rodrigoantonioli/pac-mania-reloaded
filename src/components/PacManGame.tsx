
import { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './GameBoard';
import GameUI from './GameUI';
import { GameState, Position, Direction, Ghost } from '@/types/game';
import { MAZE_WIDTH, MAZE_HEIGHT, INITIAL_MAZE } from '@/utils/mazeData';
import { toast } from 'sonner';

const PacManGame = () => {
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const ghostLoopRef = useRef<NodeJS.Timeout | null>(null);
  const powerPelletTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<GameState>({
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
    dotsRemaining: 0
  });

  // Contar dots iniciais
  useEffect(() => {
    const initialDots = INITIAL_MAZE.flat().filter(cell => cell === 1 || cell === 2).length;
    setGameState(prev => ({ ...prev, dotsRemaining: initialDots }));
  }, []);

  const isValidMove = (position: Position, direction: Direction): boolean => {
    let newX = position.x;
    let newY = position.y;

    switch (direction) {
      case 'UP':
        newY = position.y - 1;
        break;
      case 'DOWN':
        newY = position.y + 1;
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

    // Verificar limites do maze
    if (newY < 0 || newY >= MAZE_HEIGHT) return false;
    
    // Verificar se não é parede
    return gameState.maze[newY] && gameState.maze[newY][newX] !== 0;
  };

  const moveEntity = (position: Position, direction: Direction): Position => {
    if (!isValidMove(position, direction)) {
      return position;
    }

    let newX = position.x;
    let newY = position.y;

    switch (direction) {
      case 'UP':
        newY = position.y - 1;
        break;
      case 'DOWN':
        newY = position.y + 1;
        break;
      case 'LEFT':
        newX = position.x - 1;
        if (newX < 0) newX = MAZE_WIDTH - 1;
        break;
      case 'RIGHT':
        newX = position.x + 1;
        if (newX >= MAZE_WIDTH) newX = 0;
        break;
    }

    return { x: newX, y: newY };
  };

  const handleCollisions = useCallback(() => {
    setGameState(prev => {
      const { pacman, ghosts } = prev;
      
      // Verificar colisão com fantasmas
      const collidedGhost = ghosts.find(ghost => 
        ghost.position.x === pacman.position.x && 
        ghost.position.y === pacman.position.y
      );

      if (collidedGhost) {
        if (collidedGhost.mode === 'frightened') {
          // Pac-Man comeu um fantasma
          toast("Fantasma comido! +200 pontos!");
          return {
            ...prev,
            score: prev.score + 200,
            ghosts: prev.ghosts.map(g => 
              g.id === collidedGhost.id 
                ? { ...g, position: { x: 13, y: 13 }, mode: 'scatter' }
                : g
            )
          };
        } else {
          // Pac-Man foi pego
          toast("Você foi pego!");
          return {
            ...prev,
            lives: prev.lives - 1,
            pacman: { 
              ...prev.pacman, 
              position: { x: 13, y: 26 },
              direction: 'RIGHT',
              nextDirection: 'RIGHT'
            },
            ghosts: [
              { id: 1, position: { x: 13, y: 11 }, direction: 'UP', color: 'red', mode: 'scatter' },
              { id: 2, position: { x: 12, y: 13 }, direction: 'UP', color: 'pink', mode: 'scatter' },
              { id: 3, position: { x: 13, y: 13 }, direction: 'UP', color: 'cyan', mode: 'scatter' },
              { id: 4, position: { x: 14, y: 13 }, direction: 'UP', color: 'orange', mode: 'scatter' }
            ]
          };
        }
      }
      
      return prev;
    });
  }, []);

  const eatDot = useCallback(() => {
    setGameState(prev => {
      const { pacman, maze } = prev;
      const cellValue = maze[pacman.position.y][pacman.position.x];
      
      if (cellValue === 1) {
        // Dot normal
        const newMaze = maze.map(row => [...row]);
        newMaze[pacman.position.y][pacman.position.x] = 3;
        
        return {
          ...prev,
          maze: newMaze,
          score: prev.score + 10,
          dotsRemaining: prev.dotsRemaining - 1
        };
      } else if (cellValue === 2) {
        // Power pellet
        const newMaze = maze.map(row => [...row]);
        newMaze[pacman.position.y][pacman.position.x] = 3;
        
        // Limpar timeout anterior se existir
        if (powerPelletTimeoutRef.current) {
          clearTimeout(powerPelletTimeoutRef.current);
        }
        
        // Assustar fantasmas por 10 segundos
        powerPelletTimeoutRef.current = setTimeout(() => {
          setGameState(current => ({
            ...current,
            ghosts: current.ghosts.map(ghost => ({ ...ghost, mode: 'scatter' }))
          }));
        }, 10000);
        
        toast("Power Pellet! Fantasmas estão assustados!");
        
        return {
          ...prev,
          maze: newMaze,
          score: prev.score + 50,
          dotsRemaining: prev.dotsRemaining - 1,
          ghosts: prev.ghosts.map(ghost => ({ ...ghost, mode: 'frightened' }))
        };
      }
      
      return prev;
    });
  }, []);

  const moveGhosts = useCallback(() => {
    setGameState(prev => {
      const newGhosts = prev.ghosts.map(ghost => {
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        
        // Filtrar direções válidas (não pode ir para trás)
        const oppositeDirection = {
          'UP': 'DOWN',
          'DOWN': 'UP',
          'LEFT': 'RIGHT',
          'RIGHT': 'LEFT'
        }[ghost.direction] as Direction;
        
        const validDirections = directions.filter(dir => {
          if (dir === oppositeDirection) return false; // Não pode voltar
          return isValidMove(ghost.position, dir);
        });
        
        if (validDirections.length === 0) {
          // Se não há direções válidas, pode voltar
          const backDirection = oppositeDirection;
          if (isValidMove(ghost.position, backDirection)) {
            const newPosition = moveEntity(ghost.position, backDirection);
            return { ...ghost, position: newPosition, direction: backDirection };
          }
          return ghost;
        }
        
        // IA dos fantasmas: seguir Pac-Man se no modo chase
        let chosenDirection: Direction;
        
        if (ghost.mode === 'chase' && Math.random() > 0.3) {
          // 70% chance de seguir Pac-Man
          const dx = prev.pacman.position.x - ghost.position.x;
          const dy = prev.pacman.position.y - ghost.position.y;
          
          if (Math.abs(dx) > Math.abs(dy)) {
            chosenDirection = dx > 0 ? 'RIGHT' : 'LEFT';
          } else {
            chosenDirection = dy > 0 ? 'DOWN' : 'UP';
          }
          
          // Se a direção escolhida não é válida, escolher aleatória
          if (!validDirections.includes(chosenDirection)) {
            chosenDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
          }
        } else {
          // Movimento aleatório
          chosenDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
        }
        
        const newPosition = moveEntity(ghost.position, chosenDirection);
        return { ...ghost, position: newPosition, direction: chosenDirection };
      });
      
      return { ...prev, ghosts: newGhosts };
    });
  }, [isValidMove, moveEntity]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.gameStatus !== 'playing') return;

    let newDirection: Direction | null = null;
    
    switch (event.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        newDirection = 'UP';
        break;
      case 'arrowdown':
      case 's':
        newDirection = 'DOWN';
        break;
      case 'arrowleft':
      case 'a':
        newDirection = 'LEFT';
        break;
      case 'arrowright':
      case 'd':
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

  // Game loop principal
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        // Verificar se pode mudar de direção
        const canChangeDirection = isValidMove(prev.pacman.position, prev.pacman.nextDirection);
        const direction = canChangeDirection ? prev.pacman.nextDirection : prev.pacman.direction;
        
        // Mover Pac-Man
        const newPosition = moveEntity(prev.pacman.position, direction);
        
        return {
          ...prev,
          pacman: {
            ...prev.pacman,
            position: newPosition,
            direction: direction
          }
        };
      });
    }, 150);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.gameStatus, isValidMove, moveEntity]);

  // Loop dos fantasmas
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      if (ghostLoopRef.current) {
        clearInterval(ghostLoopRef.current);
        ghostLoopRef.current = null;
      }
      return;
    }

    ghostLoopRef.current = setInterval(() => {
      moveGhosts();
    }, 300);

    return () => {
      if (ghostLoopRef.current) {
        clearInterval(ghostLoopRef.current);
        ghostLoopRef.current = null;
      }
    };
  }, [gameState.gameStatus, moveGhosts]);

  // Verificar colisões e comer dots após movimento
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      eatDot();
      handleCollisions();
    }
  }, [gameState.pacman.position, eatDot, handleCollisions]);

  // Alternar modo dos fantasmas periodicamente
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const modeInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        ghosts: prev.ghosts.map(ghost => 
          ghost.mode === 'frightened' 
            ? ghost 
            : { ...ghost, mode: ghost.mode === 'scatter' ? 'chase' : 'scatter' }
        )
      }));
    }, 7000); // Alternar a cada 7 segundos

    return () => clearInterval(modeInterval);
  }, [gameState.gameStatus]);

  // Verificar condições de vitória/derrota
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
    if (gameState.gameStatus === 'paused') {
      setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    } else {
      setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
      toast("Jogo iniciado! Use as setas ou WASD para mover.");
    }
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
  };

  const resetGame = () => {
    // Limpar timeouts
    if (powerPelletTimeoutRef.current) {
      clearTimeout(powerPelletTimeoutRef.current);
      powerPelletTimeoutRef.current = null;
    }
    
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

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (ghostLoopRef.current) clearInterval(ghostLoopRef.current);
      if (powerPelletTimeoutRef.current) clearTimeout(powerPelletTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <GameUI 
        gameState={gameState}
        onStart={startGame}
        onPause={pauseGame}
        onReset={resetGame}
      />
      <GameBoard gameState={gameState} />
    </div>
  );
};

export default PacManGame;
