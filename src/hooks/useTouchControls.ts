
import { useCallback, useEffect, useRef } from 'react';
import { Direction } from '@/types/game';

interface TouchPosition {
  x: number;
  y: number;
}

interface UseTouchControlsProps {
  onDirectionChange: (direction: Direction) => void;
  isGamePlaying: boolean;
}

export const useTouchControls = ({ onDirectionChange, isGamePlaying }: UseTouchControlsProps) => {
  const touchStartPos = useRef<TouchPosition | null>(null);
  const minSwipeDistance = 30; // Distância mínima para considerar um swipe

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isGamePlaying) return;
    
    const touch = e.touches[0];
    touchStartPos.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }, [isGamePlaying]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isGamePlaying || !touchStartPos.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartPos.current.x;
    const deltaY = touch.clientY - touchStartPos.current.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Verificar se o movimento é suficiente para ser considerado um swipe
    if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) {
      touchStartPos.current = null;
      return;
    }

    // Determinar direção baseada no maior movimento
    if (absDeltaX > absDeltaY) {
      // Movimento horizontal
      onDirectionChange(deltaX > 0 ? 'RIGHT' : 'LEFT');
    } else {
      // Movimento vertical
      onDirectionChange(deltaY > 0 ? 'DOWN' : 'UP');
    }

    touchStartPos.current = null;
  }, [isGamePlaying, onDirectionChange, minSwipeDistance]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Prevenir scroll da página durante o jogo
    if (isGamePlaying) {
      e.preventDefault();
    }
  }, [isGamePlaying]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  return null;
};
