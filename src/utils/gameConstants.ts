export const PACMAN_SPEED_MS = 150;
export const GHOST_SPEED_MS = 250;
export const POWER_PELLET_DURATION_MS = 8000;

import { INITIAL_MAZE } from './mazeData';
import type { Ghost, GameState, PacMan } from '@/types/game';

export const INITIAL_PACMAN: PacMan = {
  position: { x: 13, y: 26 },
  direction: 'RIGHT',
  nextDirection: 'RIGHT'
};

export const INITIAL_GHOSTS: Ghost[] = [
  { id: 1, position: { x: 13, y: 11 }, direction: 'UP', color: 'red', mode: 'scatter' },
  { id: 2, position: { x: 12, y: 13 }, direction: 'UP', color: 'pink', mode: 'scatter' },
  { id: 3, position: { x: 13, y: 13 }, direction: 'UP', color: 'cyan', mode: 'scatter' },
  { id: 4, position: { x: 14, y: 13 }, direction: 'UP', color: 'orange', mode: 'scatter' }
];

export const INITIAL_DOTS_COUNT = INITIAL_MAZE.flat().filter(c => c === 1 || c === 2).length;

export const createInitialGameState = (): GameState => ({
  score: 0,
  lives: 3,
  level: 1,
  gameStatus: 'ready',
  pacman: { ...INITIAL_PACMAN },
  ghosts: INITIAL_GHOSTS.map(g => ({ ...g })),
  maze: INITIAL_MAZE.map(row => [...row]),
  dotsRemaining: INITIAL_DOTS_COUNT
});
