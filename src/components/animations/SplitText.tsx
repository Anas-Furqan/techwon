import { useRef, useEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  className?: string;
  splitBy?: 'chars' | 'words' | 'lines';
  animation?: 'fadeUp' | 'reveal' | 'wave' | 'scramble';
  delay?: number;
  stagger?: number;
  duration?: number;
  scrollTrigger?: boolean;
  once?: boolean;
}

export default function SplitText({
  children,
  className = '',
  splitBy = 'chars',
  animation = 'fadeUp',
  delay = 0,
  stagger = 0.03,
  duration = 0.8,
  scrollTrigger = true,
  once = true,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const elements = container.querySelectorAll('.split-char, .split-word, .split-line');

      const animationConfig = {
        fadeUp: {
          from: { y: 60, opacity: 0, rotateX: -40 },
          to: { y: 0, opacity: 1, rotateX: 0 },
        },
        reveal: {
          from: { y: '100%', opacity: 0 },
          to: { y: '0%', opacity: 1 },
        },
        wave: {
          from: { y: 40, opacity: 0, scale: 0.8 },
          to: { y: 0, opacity: 1, scale: 1 },
        },
        scramble: {
          from: { opacity: 0, x: () => gsap.utils.random(-20, 20) },
          to: { opacity: 1, x: 0 },
        },
      };

      const config = animationConfig[animation];

      const tl = gsap.timeline({
        scrollTrigger: scrollTrigger
          ? {
              trigger: container,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: once ? 'play none none none' : 'play reverse play reverse',
            }
          : undefined,
        delay,
      });

      tl.fromTo(elements, config.from, {
        ...config.to,
        duration,
        stagger,
        ease: 'power4.out',
      });
    }, container);

    return () => ctx.revert();
  }, [children, animation, delay, stagger, duration, scrollTrigger, once]);

  const renderSplit = () => {
    if (splitBy === 'chars') {
      return children.split('').map((char, i) => (
        <span
          key={i}
          className="split-char inline-block"
          style={{ 
            display: char === ' ' ? 'inline' : 'inline-block',
            perspective: '1000px',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }

    if (splitBy === 'words') {
      return children.split(' ').map((word, i) => (
        <span key={i} className="split-word-wrapper inline-block overflow-hidden mr-[0.25em]">
          <span className="split-word inline-block">{word}</span>
        </span>
      ));
    }

    if (splitBy === 'lines') {
      return children.split('\n').map((line, i) => (
        <span key={i} className="split-line-wrapper block overflow-hidden">
          <span className="split-line inline-block">{line}</span>
        </span>
      ));
    }
  };

  return (
    <div ref={containerRef} className={`split-text ${className}`}>
      {renderSplit()}
    </div>
  );
}

interface AnimatedHeadingProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  delay?: number;
}

export function AnimatedHeading({
  children,
  as: Tag = 'h1',
  className = '',
  delay = 0,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: 50, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
