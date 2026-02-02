import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  cursorType: 'default' | 'link' | 'action' | 'team' | 'strategy';
  text?: string;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    cursorType: 'default',
  });

  const moveCursor = useCallback((e: MouseEvent) => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    // Use yPercent/xPercent for smoother performance
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: 'power3.out',
    });

    gsap.to(dot, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    // Check for mobile/touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    // Initial setup
    gsap.set([cursor, dot], { xPercent: -50, yPercent: -50 });

    // Mouse move
    window.addEventListener('mousemove', moveCursor);

    // Interactive element handlers
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Determine cursor type
      let cursorType: CursorState['cursorType'] = 'link';
      let text: string | undefined;

      if (target.closest('.team-card')) {
        cursorType = 'team';
        text = 'View';
      } else if (target.closest('.strategy-card')) {
        cursorType = 'strategy';
        text = 'Explore';
      } else if (target.closest('[data-cursor="action"]')) {
        cursorType = 'action';
        text = target.dataset.cursorText || 'Click';
      }

      setState({ isHovering: true, isClicking: false, cursorType, text });

      gsap.to(cursor, {
        scale: cursorType === 'team' ? 2.5 : cursorType === 'strategy' ? 2 : 1.5,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(dot, {
        scale: 0,
        duration: 0.2,
      });
    };

    const handleMouseLeave = () => {
      setState({ isHovering: false, isClicking: false, cursorType: 'default' });

      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(dot, {
        scale: 1,
        duration: 0.2,
      });
    };

    const handleMouseDown = () => {
      setState((prev) => ({ ...prev, isClicking: true }));
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
      });
    };

    const handleMouseUp = () => {
      setState((prev) => ({ ...prev, isClicking: false }));
      gsap.to(cursor, {
        scale: state.isHovering ? 1.5 : 1,
        duration: 0.2,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    // Add listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .team-card, .strategy-card, [data-cursor]'
    );
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter as EventListener);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.body.style.cursor = 'auto';
    };
  }, [moveCursor, state.isHovering]);

  // Update cursor text when state changes
  useEffect(() => {
    const textEl = cursorTextRef.current;
    if (!textEl) return;

    if (state.text && state.isHovering) {
      gsap.to(textEl, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
      });
    } else {
      gsap.to(textEl, {
        opacity: 0,
        scale: 0.5,
        duration: 0.15,
      });
    }
  }, [state.text, state.isHovering]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  const getCursorColor = () => {
    switch (state.cursorType) {
      case 'team':
        return 'border-secondary bg-secondary/10';
      case 'strategy':
        return 'border-accent bg-accent/10';
      case 'action':
        return 'border-primary bg-primary/20';
      default:
        return 'border-primary/50 bg-transparent';
    }
  };

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`custom-cursor fixed top-0 left-0 w-10 h-10 rounded-full border-2 pointer-events-none z-[9999] mix-blend-difference transition-colors duration-200 ${getCursorColor()}`}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <span
          ref={cursorTextRef}
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0"
        >
          {state.text}
        </span>
      </div>
      
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="custom-cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}
