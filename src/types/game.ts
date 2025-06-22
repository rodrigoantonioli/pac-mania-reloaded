
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Position = {
  x: number;
  y: number;
};

export type PacMan = {
  position: Position;
  direction: Direction;
  nextDirection: Direction;
};

export type Ghost = {
  id: number;
  position: Position;
  direction: Direction;
  color: string;
  mode: 'scatter' | 'chase' | 'frightened';
};

export type GameState = {
  score: number;
  lives: number;
  level: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'gameOver';
  pacman: PacMan;
  ghosts: Ghost[];
  maze: number[][];
  dotsRemaining: number;
};
