import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/dist/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

// Hook for parallax effects
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        y: () => speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, element);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

// Hook for reveal animations
export function useReveal(options?: {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { direction = 'up', distance = 60, duration = 1, delay = 0 } = options || {};

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const getFromVars = () => {
      switch (direction) {
        case 'up':
          return { y: distance, opacity: 0 };
        case 'down':
          return { y: -distance, opacity: 0 };
        case 'left':
          return { x: distance, opacity: 0 };
        case 'right':
          return { x: -distance, opacity: 0 };
      }
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        getFromVars(),
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration,
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
  }, [direction, distance, duration, delay]);

  return ref;
}

// Hook for stagger animations on children
export function useStaggerReveal(options?: {
  stagger?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { stagger = 0.1, duration = 0.8, delay = 0 } = options || {};

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const children = element.children;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
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
  }, [stagger, duration, delay]);

  return ref;
}

// Hook for GSAP context management
export function useGsapContext() {
  const contextRef = useRef<gsap.Context | null>(null);

  const createContext = useCallback((scope: HTMLElement, callback: () => void) => {
    contextRef.current = gsap.context(callback, scope);
  }, []);

  const revert = useCallback(() => {
    contextRef.current?.revert();
  }, []);

  useEffect(() => {
    return () => {
      contextRef.current?.revert();
    };
  }, []);

  return { createContext, revert, context: contextRef };
}

// Hook for flip animations
export function useFlipAnimation() {
  const getState = useCallback((targets: Element | Element[] | string) => {
    return Flip.getState(targets);
  }, []);

  const animate = useCallback(
    (
      state: Flip.FlipState,
      options?: Flip.FromToVars
    ) => {
      return Flip.from(state, {
        duration: 0.8,
        ease: 'power3.inOut',
        absolute: true,
        ...options,
      });
    },
    []
  );

  return { getState, animate };
}

// Hook for scroll-linked animations
export function useScrollAnimation(
  callback: (progress: number) => void,
  options?: {
    start?: string;
    end?: string;
  }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: options?.start || 'top bottom',
        end: options?.end || 'bottom top',
        onUpdate: (self) => {
          callback(self.progress);
        },
      });
    }, element);

    return () => ctx.revert();
  }, [callback, options?.start, options?.end]);

  return ref;
}

// Utility to create timeline
export function createTimeline(options?: gsap.TimelineVars) {
  return gsap.timeline(options);
}
