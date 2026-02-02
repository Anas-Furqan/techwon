import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingRobot from './3d/FloatingRobot';
import MagneticButton from './animations/MagneticButton';
import TextScramble from './animations/TextEffects';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const [showScramble, setShowScramble] = useState(false);

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

      // Split text animation for title
      const titleText = title.innerHTML;
      const words = titleText.split(' ');
      title.innerHTML = words
        .map((word) => {
          if (word.includes('TECHWON')) {
            return `<span class="word-wrapper inline-block overflow-hidden"><span class="word inline-block gradient-text">${word}</span></span>`;
          }
          return `<span class="word-wrapper inline-block overflow-hidden"><span class="word inline-block">${word}</span></span>`;
        })
        .join(' ');

      const wordElements = title.querySelectorAll('.word');

      // Create master timeline
      const masterTl = gsap.timeline({
        delay: 0.3,
        defaults: { ease: 'power4.out' },
        onComplete: () => setShowScramble(true),
      });

      // Tagline animation with scramble effect
      masterTl.fromTo(
        tagline,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8 }
      );

      // Title split-text reveal
      gsap.set(wordElements, { yPercent: 120, rotateX: -40 });
      gsap.set(title, { opacity: 1 });
      
      masterTl.to(
        wordElements,
        {
          yPercent: 0,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
        },
        '-=0.4'
      );

      // Description reveal with blur
      masterTl.fromTo(
        description,
        { yPercent: 40, opacity: 0, filter: 'blur(20px)' },
        { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1 },
        '-=0.8'
      );

      // CTA buttons stagger entrance
      masterTl.fromTo(
        cta.children,
        { yPercent: 50, opacity: 0, scale: 0.9 },
        { yPercent: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15 },
        '-=0.6'
      );
      gsap.set(cta, { opacity: 1 });

      // Stats reveal with 3D flip
      const statCards = stats.querySelectorAll('.stat-card');
      gsap.set(stats, { opacity: 1 });
      masterTl.fromTo(
        statCards,
        { yPercent: 80, opacity: 0, rotateY: -30, scale: 0.8 },
        { 
          yPercent: 0, 
          opacity: 1, 
          rotateY: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.12,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      );

      // Scroll indicator
      masterTl.fromTo(
        scrollIndicator,
        { opacity: 0, yPercent: 20 },
        { opacity: 1, yPercent: 0, duration: 0.6 },
        '-=0.2'
      );

      // Mouse parallax effect (desktop only)
      if (!isMobile && parallaxContainer) {
        const parallaxElements = parallaxContainer.querySelectorAll('.parallax-layer');
        
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          
          const moveX = (clientX - centerX) / centerX;
          const moveY = (clientY - centerY) / centerY;

          parallaxElements.forEach((el, index) => {
            const depth = (index + 1) * 15;
            gsap.to(el, {
              xPercent: moveX * depth,
              yPercent: moveY * depth,
              duration: 1,
              ease: 'power2.out',
            });
          });
        };

        window.addEventListener('mousemove', handleMouseMove);
        
        // Store cleanup function
        (section as any)._parallaxCleanup = () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }

      // Scroll-linked parallax using yPercent for smoothness
      gsap.to('.hero-bg-element', {
        yPercent: (i) => (i + 1) * 20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Scale down hero on scroll for cinematic exit
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(section, {
            opacity: 1 - progress * 0.7,
            scale: 1 - progress * 0.08,
            filter: `blur(${progress * 5}px)`,
          });
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
          {/* Tagline with AI scramble effect */}
          <div ref={taglineRef} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary font-medium">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {showScramble ? (
                <TextScramble text="AI-First Digital Agency" scrambleSpeed={25} />
              ) : (
                'AI-First Digital Agency'
              )}
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
