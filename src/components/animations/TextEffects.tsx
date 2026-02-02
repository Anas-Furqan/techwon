import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * TextScramble - Premium AI-style text reveal effect
 * Uses requestAnimationFrame for smooth 60fps animation
 * Memory-optimized with proper cleanup
 */
interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealDelay?: number;
  onComplete?: () => void;
}

// Reduced character set for cleaner look
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function TextScramble({
  text,
  className = '',
  scrambleSpeed = 50,
  revealDelay = 0,
  onComplete,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  const randomChar = useCallback(() => chars[Math.floor(Math.random() * chars.length)], []);

  useEffect(() => {
    isMountedRef.current = true;
    
    const timeout = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      const length = text.length;
      const duration = length * scrambleSpeed;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        if (!isMountedRef.current) return;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const revealedCount = Math.floor(progress * length);
        
        let result = '';
        for (let i = 0; i < length; i++) {
          if (i < revealedCount) {
            result += text[i];
          } else if (text[i] === ' ') {
            result += ' ';
          } else {
            result += randomChar();
          }
        }
        
        setDisplayText(result);
        
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
          onComplete?.();
        }
      };
      
      frameRef.current = requestAnimationFrame(animate);
    }, revealDelay);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, revealDelay, scrambleSpeed, randomChar, onComplete]);

  return (
    <span className={`text-scramble gpu-accelerated ${className}`}>
      {displayText}
    </span>
  );
}

// Typewriter effect component
interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(cursor);
  const indexRef = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayText((prev) => prev + text[indexRef.current]);
          indexRef.current++;
        } else {
          clearInterval(interval);
          onComplete?.();
          // Blink cursor then hide
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={`typewriter ${className}`}>
      {displayText}
      {showCursor && (
        <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-blink" />
      )}
    </span>
  );
}

// Glitch text effect
interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: number;
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  return (
    <span className={`glitch-text relative ${className}`} data-text={text}>
      {text}
    </span>
  );
}
