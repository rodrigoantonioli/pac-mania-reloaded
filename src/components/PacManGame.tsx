import { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './GameBoard';
import GameUI from './GameUI';
import { GameState, Position, Direction } from '@/types/game';
import { MAZE_WIDTH, MAZE_HEIGHT } from '@/utils/mazeData';
import {
  createInitialGameState,
  PACMAN_SPEED_MS,
  GHOST_SPEED_MS,
  POWER_PELLET_DURATION_MS
} from '@/utils/gameConstants';
import { toast } from 'sonner';

const PacManGame = () => {
  // Generic timer types make the code compatible with both browser and Node
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ghostLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const powerPelletTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const modeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  // Funções básicas de movimento e validação
  const isValidMove = useCallback((maze: number[][], position: Position, direction: Direction): boolean => {
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
    
    // Verificar se não é parede (0)
    return maze[newY] && maze[newY][newX] !== 0;
  }, []);

  const moveEntity = useCallback((position: Position, direction: Direction): Position => {
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
  }, []);

  // Funções de controle do jogo - definidas antes de serem usadas
  const startGame = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus === 'paused') {
        return { ...prev, gameStatus: 'playing' };
      } else {
        toast("Jogo iniciado! Use as setas ou WASD para mover.");
        return { ...prev, gameStatus: 'playing' };
      }
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
  }, []);

  const resetGame = useCallback(() => {
    // Limpar todos os timeouts e intervalos
    if (powerPelletTimeoutRef.current) {
      clearTimeout(powerPelletTimeoutRef.current);
      powerPelletTimeoutRef.current = null;
    }
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (ghostLoopRef.current) {
      clearInterval(ghostLoopRef.current);
      ghostLoopRef.current = null;
    }
    if (modeIntervalRef.current) {
      clearInterval(modeIntervalRef.current);
      modeIntervalRef.current = null;
    }
    
    setGameState(createInitialGameState());
  }, []);

  // Controle de teclado - agora pode referenciar startGame e resetGame
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // Controles globais (funcionam mesmo quando o jogo não está em andamento)
      if (key === 'enter' && gameState.gameStatus !== 'playing') {
        event.preventDefault();
        startGame();
        return;
      }

      if (key === 'r' && gameState.gameStatus === 'gameOver') {
        event.preventDefault();
        resetGame();
        return;
      }

      if (key === 'escape') {
        event.preventDefault();
        setGameState(prev => ({
          ...prev,
          gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing'
        }));
        return;
      }

      if (gameState.gameStatus !== 'playing') return;

      let newDirection: Direction | null = null;

      switch (key) {
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
          pacman: { ...prev.pacman, nextDirection: newDirection }
        }));
      }
    },
    [gameState.gameStatus, startGame, resetGame]
  );

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
                ? { ...g, position: { x: 13, y: 13 }, mode: 'scatter' as const }
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
              direction: 'RIGHT' as const,
              nextDirection: 'RIGHT' as const
            },
            ghosts: [
              { id: 1, position: { x: 13, y: 11 }, direction: 'UP' as const, color: 'red', mode: 'scatter' as const },
              { id: 2, position: { x: 12, y: 13 }, direction: 'UP' as const, color: 'pink', mode: 'scatter' as const },
              { id: 3, position: { x: 13, y: 13 }, direction: 'UP' as const, color: 'cyan', mode: 'scatter' as const },
              { id: 4, position: { x: 14, y: 13 }, direction: 'UP' as const, color: 'orange', mode: 'scatter' as const }
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
        
        // Assustar fantasmas por 8 segundos
        powerPelletTimeoutRef.current = setTimeout(() => {
          setGameState(current => ({
            ...current,
            ghosts: current.ghosts.map(ghost =>
              ghost.mode === 'frightened'
                ? { ...ghost, mode: 'scatter' as const }
                : ghost
            )
          }));
        }, POWER_PELLET_DURATION_MS);
        
        toast("Power Pellet! Fantasmas estão assustados!");
        
        return {
          ...prev,
          maze: newMaze,
          score: prev.score + 50,
          dotsRemaining: prev.dotsRemaining - 1,
          ghosts: prev.ghosts.map(ghost => ({ ...ghost, mode: 'frightened' as const }))
        };
      }
      
      return prev;
    });
  }, []);

  // Função para mover fantasmas
  const OPPOSITE: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
  };

  const moveGhosts = useCallback(() => {
    setGameState(prev => {
      const newGhosts = prev.ghosts.map(ghost => {
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        
        // Filtrar direções válidas
        const validDirections = directions.filter(dir => 
          isValidMove(prev.maze, ghost.position, dir)
        );
        
        if (validDirections.length === 0) {
          return ghost;
        }
        
        // Evitar voltar (exceto se for a única opção)
        const oppositeDirection = OPPOSITE[ghost.direction];
        
        const preferredDirections = validDirections.filter(dir => dir !== oppositeDirection);
        const directionsToUse = preferredDirections.length > 0 ? preferredDirections : validDirections;
        
        let chosenDirection: Direction;
        
        // IA dos fantasmas
        if (ghost.mode === 'chase' && Math.random() > 0.4) {
          // 60% chance de seguir Pac-Man no modo chase
          const dx = prev.pacman.position.x - ghost.position.x;
          const dy = prev.pacman.position.y - ghost.position.y;
          
          let targetDirection: Direction;
          if (Math.abs(dx) > Math.abs(dy)) {
            targetDirection = dx > 0 ? 'RIGHT' : 'LEFT';
          } else {
            targetDirection = dy > 0 ? 'DOWN' : 'UP';
          }
          
          if (directionsToUse.includes(targetDirection)) {
            chosenDirection = targetDirection;
          } else {
            chosenDirection = directionsToUse[Math.floor(Math.random() * directionsToUse.length)];
          }
        } else {
          // Modo scatter ou frightened - movimento mais aleatório
          chosenDirection = directionsToUse[Math.floor(Math.random() * directionsToUse.length)];
        }
        
        const newPosition = moveEntity(ghost.position, chosenDirection);
        
        return { 
          ...ghost, 
          position: newPosition, 
          direction: chosenDirection 
        };
      });
      
      return { ...prev, ghosts: newGhosts };
    });
  }, [isValidMove, moveEntity]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop principal - Pac-Man
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
        const canChangeDirection = isValidMove(prev.maze, prev.pacman.position, prev.pacman.nextDirection);
        const direction = canChangeDirection ? prev.pacman.nextDirection : prev.pacman.direction;
        
        // Verificar se pode mover na direção atual
        if (!isValidMove(prev.maze, prev.pacman.position, direction)) {
          return prev; // Não pode mover, fica parado
        }
        
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
    }, PACMAN_SPEED_MS);

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
    }, GHOST_SPEED_MS);

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
  }, [gameState.pacman.position, gameState.ghosts, eatDot, handleCollisions]);

  // Alternar modo dos fantasmas periodicamente
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      if (modeIntervalRef.current) {
        clearInterval(modeIntervalRef.current);
        modeIntervalRef.current = null;
      }
      return;
    }

    modeIntervalRef.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        ghosts: prev.ghosts.map(ghost => 
          ghost.mode === 'frightened' 
            ? ghost 
            : { ...ghost, mode: ghost.mode === 'scatter' ? 'chase' as const : 'scatter' as const }
        )
      }));
    }, 6000);

    return () => {
      if (modeIntervalRef.current) {
        clearInterval(modeIntervalRef.current);
        modeIntervalRef.current = null;
      }
    };
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

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (ghostLoopRef.current) clearInterval(ghostLoopRef.current);
      if (modeIntervalRef.current) clearInterval(modeIntervalRef.current);
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
