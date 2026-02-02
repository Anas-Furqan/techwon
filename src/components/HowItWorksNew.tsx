import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Target, Code, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Search,
    title: 'Discovery',
    description:
      'We dive deep into understanding your business, goals, and challenges to create a tailored strategy.',
    step: '01',
    detail: 'In-depth analysis of your current systems and future needs',
  },
  {
    icon: Target,
    title: 'Strategy',
    description:
      'Our team crafts a comprehensive roadmap with clear milestones and deliverables for your project.',
    step: '02',
    detail: 'Custom AI implementation plan with ROI projections',
  },
  {
    icon: Code,
    title: 'Development',
    description:
      'We build your solution using cutting-edge technologies with regular updates and feedback loops.',
    step: '03',
    detail: 'Agile sprints with continuous integration and testing',
  },
  {
    icon: Rocket,
    title: 'Deployment',
    description:
      'Launch your project with confidence. We provide ongoing support and optimization post-launch.',
    step: '04',
    detail: '24/7 monitoring and continuous improvement',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const stickyContainer = stickyContainerRef.current;
    const progressLine = progressLineRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !header || !stickyContainer) return;

    // Check for mobile
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header.children,
        { yPercent: 50, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (!isMobile) {
        // Desktop: Sticky scroll implementation
        const totalHeight = cards.length * 100; // vh units
        
        // Pin the sticky container
        ScrollTrigger.create({
          trigger: stickyContainer,
          start: 'top 15%',
          end: `+=${totalHeight}vh`,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const currentStep = Math.min(
              Math.floor(progress * cards.length),
              cards.length - 1
            );
            setActiveStep(currentStep);

            // Animate SVG progress line
            if (progressLine) {
              const lineLength = progressLine.getTotalLength();
              gsap.set(progressLine, {
                strokeDasharray: lineLength,
                strokeDashoffset: lineLength * (1 - progress),
              });
            }
          },
        });

        // Animate cards based on scroll
        cards.forEach((card, index) => {
          if (!card) return;

          const startProgress = index / cards.length;
          const endProgress = (index + 1) / cards.length;

          ScrollTrigger.create({
            trigger: stickyContainer,
            start: 'top 15%',
            end: `+=${totalHeight}vh`,
            onUpdate: (self) => {
              const progress = self.progress;
              
              if (progress >= startProgress && progress < endProgress) {
                // Active card
                gsap.to(card, {
                  scale: 1,
                  opacity: 1,
                  yPercent: 0,
                  filter: 'blur(0px)',
                  duration: 0.5,
                  ease: 'power2.out',
                });
              } else if (progress < startProgress) {
                // Future card
                gsap.to(card, {
                  scale: 0.85,
                  opacity: 0.3,
                  yPercent: 30,
                  filter: 'blur(3px)',
                  duration: 0.5,
                  ease: 'power2.out',
                });
              } else {
                // Past card
                gsap.to(card, {
                  scale: 0.9,
                  opacity: 0.5,
                  yPercent: -20,
                  filter: 'blur(2px)',
                  duration: 0.5,
                  ease: 'power2.out',
                });
              }
            },
          });
        });
      } else {
        // Mobile: Standard reveal animation
        cards.forEach((card, index) => {
          if (!card) return;

          gsap.fromTo(
            card,
            { yPercent: 30, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }

      // Card hover effects (both mobile and desktop)
      cards.forEach((card) => {
        if (!card) return;

        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(card, {
          yPercent: -3,
          boxShadow: '0 0 60px hsl(199 89% 60% / 0.3)',
          duration: 0.3,
          ease: 'power2.out',
        });

        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => hoverTl.reverse());
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary font-medium mb-4">
            Our Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How <span className="gradient-text">TECHWON</span> Works
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            A streamlined process designed to deliver exceptional results efficiently and
            effectively.
          </p>
        </div>

        {/* Sticky Container for Desktop */}
        <div ref={stickyContainerRef} className="relative">
          {/* SVG Progress Line (Desktop only) */}
          <svg
            className="hidden lg:block absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 z-0"
            viewBox="0 0 8 400"
            preserveAspectRatio="none"
          >
            {/* Background line */}
            <path
              d="M4 0 L4 400"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Animated progress line */}
            <path
              ref={progressLineRef}
              d="M4 0 L4 400"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_hsl(var(--primary))]"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="50%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`strategy-card relative ${
                  index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16 lg:col-start-2'
                }`}
                data-cursor="action"
                data-cursor-text="Learn"
              >
                {/* Step indicator dot */}
                <div
                  className={`hidden lg:flex absolute top-1/2 ${
                    index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                  } -translate-y-1/2 w-6 h-6 rounded-full items-center justify-center z-10 transition-all duration-300 ${
                    activeStep >= index
                      ? 'bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_hsl(var(--primary))]'
                      : 'bg-background-card border-2 border-border'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeStep >= index ? 'bg-white' : 'bg-border'}`} />
                </div>

                {/* Card */}
                <div className={`glass-card-hover p-8 h-full relative overflow-hidden transition-all duration-500 ${
                  activeStep === index ? 'border-primary/50 shadow-[0_0_40px_hsl(var(--primary)/0.2)]' : ''
                }`}>
                  {/* Step Number Background */}
                  <div className="absolute -top-6 -right-6 text-[120px] font-display font-bold text-primary/5 leading-none select-none">
                    {step.step}
                  </div>

                  {/* Step Badge */}
                  <div className="step-number inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent font-display font-bold text-primary-foreground text-lg mb-6 shadow-lg relative z-10">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 relative z-10">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="card-content font-display text-2xl font-semibold mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="card-content text-foreground-muted text-sm leading-relaxed mb-4 relative z-10">
                    {step.description}
                  </p>
                  
                  {/* Detail line (visible when active) */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    activeStep === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-primary text-xs font-medium pt-4 border-t border-border/50">
                      → {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Step Counter (Mobile) */}
          <div className="lg:hidden flex justify-center gap-2 mt-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeStep === index ? 'w-8 bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
