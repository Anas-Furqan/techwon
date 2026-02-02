import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealDelay?: number;
  onComplete?: () => void;
}

const chars = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function TextScramble({
  text,
  className = '',
  scrambleSpeed = 30,
  revealDelay = 0,
  onComplete,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const frameRef = useRef(0);
  const resolveRef = useRef<((value: unknown) => void) | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scramble(text);
    }, revealDelay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, revealDelay]);

  const scramble = (newText: string) => {
    const length = newText.length;
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    
    // Build queue of character transitions
    for (let i = 0; i < length; i++) {
      const from = displayText[i] || '';
      const to = newText[i];
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end });
    }

    let frame = 0;
    
    const update = () => {
      let output = '';
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end } = queue[i];
        let { char } = queue[i];

        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = randomChar();
            queue[i].char = char;
          }
          output += `<span class="text-primary/60">${char}</span>`;
        } else {
          output += from;
        }
      }

      setDisplayText(output);

      if (complete === queue.length) {
        setIsComplete(true);
        onComplete?.();
        if (resolveRef.current) resolveRef.current(null);
      } else {
        frameRef.current = requestAnimationFrame(update);
        frame++;
      }
    };

    update();
  };

  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

  return (
    <span
      className={`text-scramble ${className}`}
      dangerouslySetInnerHTML={{ __html: displayText || text.replace(/./g, ' ') }}
    />
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

export function GlitchText({ text, className = '', intensity = 1 }: GlitchTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    // Create glitch effect with GSAP
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    tl.to(element, {
      skewX: 5 * intensity,
      duration: 0.1,
      ease: 'power2.inOut',
    })
      .to(element, {
        skewX: -3 * intensity,
        duration: 0.1,
        ease: 'power2.inOut',
      })
      .to(element, {
        skewX: 2 * intensity,
        duration: 0.1,
        ease: 'power2.inOut',
      })
      .to(element, {
        skewX: 0,
        duration: 0.1,
        ease: 'power2.inOut',
      });

    return () => {
      tl.kill();
    };
  }, [intensity]);

  return (
    <span ref={textRef} className={`glitch-text relative ${className}`} data-text={text}>
      {text}
    </span>
  );
}
