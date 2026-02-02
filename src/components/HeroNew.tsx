import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingRobot from './3d/FloatingRobot';
import MagneticButton from './animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Section - Optimized with clean GSAP split-text animation
 * Fixed: Removed TextScramble component that caused visual bugs
 * Performance: GPU-accelerated transforms, single context cleanup
 */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const tagline = taglineRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;
    const stats = statsRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const parallaxContainer = parallaxContainerRef.current;

    if (!section || !title || !tagline || !description || !cta || !stats || !scrollIndicator) return;

    // Check for mobile using matchMedia
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([tagline, title, description, cta, stats, scrollIndicator], {
        opacity: 0,
      });

      // Split text animation for title - clean word-by-word reveal
      const titleText = title.textContent || '';
      const words = titleText.split(' ');
      title.innerHTML = words
        .map((word) => {
          if (word.includes('TECHWON')) {
            return `<span class="word-wrapper inline-block overflow-hidden"><span class="word inline-block gradient-text gpu-accelerated">${word}</span></span>`;
          }
          return `<span class="word-wrapper inline-block overflow-hidden"><span class="word inline-block gpu-accelerated">${word}</span></span>`;
        })
        .join(' ');

      const wordElements = title.querySelectorAll('.word');

      // Create master timeline
      const masterTl = gsap.timeline({
        delay: 0.3,
        defaults: { ease: 'power3.out' },
      });

      // Tagline fade in (no scramble - cleaner)
      masterTl.fromTo(
        tagline,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      // Title split-text reveal
      gsap.set(wordElements, { yPercent: 120, rotateX: -40 });
      gsap.set(title, { opacity: 1 });
      
      masterTl.to(
        wordElements,
        {
          yPercent: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // Description reveal
      masterTl.fromTo(
        description,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      );

      // CTA buttons stagger entrance
      masterTl.fromTo(
        cta.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
        '-=0.5'
      );
      gsap.set(cta, { opacity: 1 });

      // Stats reveal
      const statCards = stats.querySelectorAll('.stat-card');
      gsap.set(stats, { opacity: 1 });
      masterTl.fromTo(
        statCards,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // Scroll indicator
      masterTl.fromTo(
        scrollIndicator,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2'
      );

      // Mouse parallax effect (desktop only) - throttled for performance
      if (!isMobile && parallaxContainer) {
        const parallaxElements = parallaxContainer.querySelectorAll('.parallax-layer');
        let rafId: number;
        
        const handleMouseMove = (e: MouseEvent) => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (clientX - centerX) / centerX;
            const moveY = (clientY - centerY) / centerY;

            parallaxElements.forEach((el, index) => {
              const depth = (index + 1) * 10;
              gsap.to(el, {
                xPercent: moveX * depth,
                yPercent: moveY * depth,
                duration: 0.8,
                ease: 'power2.out',
              });
            });
          });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        
        // Store cleanup function
        (section as any)._parallaxCleanup = () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }

      // Scroll-linked parallax - balanced scrub value
      gsap.to('.hero-bg-element', {
        yPercent: (i) => (i + 1) * 15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5, // Balanced scrub for smooth scrolling
        },
      });

      // Simplified exit animation (removed per-frame onUpdate for performance)
      gsap.to(section, {
        opacity: 0.3,
        scale: 0.95,
        scrollTrigger: {
          trigger: section,
          start: 'center top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => {
      ctx.revert();
      // Cleanup parallax listener
      if ((section as any)?._parallaxCleanup) {
        (section as any)._parallaxCleanup();
      }
    };
  }, []);

  const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '100%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
    { value: '5+', label: 'Years Experience' },
  ];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Container */}
      <div ref={parallaxContainerRef} className="absolute inset-0 pointer-events-none">
        {/* Background Effects with Parallax Layers */}
        <div className="parallax-layer absolute inset-0 bg-grid-pattern opacity-50 hero-bg-element" />
        <div className="parallax-layer absolute inset-0 hero-gradient hero-bg-element" />
        <div className="parallax-layer absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl hero-bg-element" />
        <div className="parallax-layer absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl hero-bg-element" />
        <div className="parallax-layer absolute top-1/3 right-1/3 w-64 h-64 bg-secondary/5 rounded-full blur-2xl hero-bg-element" />
        <div className="parallax-layer absolute bottom-1/3 left-1/3 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl hero-bg-element" />
      </div>

      {/* 3D Robot */}
      <FloatingRobot />

      {/* Content */}
      <div className="relative z-10 container-custom px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline - clean text, no scramble effect */}
          <div ref={taglineRef} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary font-medium">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              AI-First Digital Agency
            </span>
          </div>

          {/* Title with Split Text */}
          <h1
            ref={titleRef}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ perspective: '1000px' }}
          >
            Build The Future With TECHWON
          </h1>

          {/* Description */}
          <p
            ref={descriptionRef}
            className="text-foreground-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            We transform businesses with cutting-edge AI solutions and stunning web experiences.
            From intelligent automation to beautiful interfaces, we build what's next.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton href="#services" className="w-full sm:w-auto">
              <span className="btn-primary flex items-center justify-center gap-2 group w-full" data-cursor="action" data-cursor-text="Explore">
                Buy a Service
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
            <MagneticButton href="#contact" className="w-full sm:w-auto">
              <span className="btn-outline flex items-center justify-center gap-2 w-full" data-cursor="action" data-cursor-text="Book">
                <Calendar className="w-4 h-4" />
                Book Consultation
              </span>
            </MagneticButton>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card glass-card p-4 hover:scale-105 transition-transform duration-300"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-foreground-muted text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
