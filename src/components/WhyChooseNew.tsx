import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Layers, Zap, TrendingUp, Shield, HeadphonesIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    title: 'AI-First Solutions',
    description:
      'We integrate artificial intelligence into every solution, ensuring your business stays ahead of the curve.',
  },
  {
    icon: Layers,
    title: 'Scalable Systems',
    description:
      'Build once, scale infinitely. Our architectures are designed to grow with your business needs.',
  },
  {
    icon: Zap,
    title: 'Modern Tech Stack',
    description:
      'We use the latest technologies and frameworks to deliver fast, secure, and reliable solutions.',
  },
  {
    icon: TrendingUp,
    title: 'Business-Driven Results',
    description:
      'Every decision we make is focused on delivering measurable business outcomes and ROI.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Bank-level security protocols protect your data and your customers information.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock support ensures your systems are always running smoothly.',
  },
];

export default function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightGridRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const leftContent = leftContentRef.current;
    const rightGrid = rightGridRef.current;
    const featureCards = featureCardsRef.current.filter(Boolean);

    if (!section || !leftContent || !rightGrid) return;

    const ctx = gsap.context(() => {
      // Left content animation
      const leftElements = leftContent.children;
      gsap.fromTo(
        leftElements,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: leftContent,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Feature cards staggered reveal with perspective
      featureCards.forEach((card, index) => {
        if (!card) return;

        const row = Math.floor(index / 2);
        const col = index % 2;
        const delay = row * 0.15 + col * 0.1;

        gsap.fromTo(
          card,
          {
            y: 60,
            opacity: 0,
            rotateX: -15,
            transformPerspective: 1000,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.7,
            delay,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: rightGrid,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Hover animation
        const iconWrapper = card.querySelector('.icon-wrapper');
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl.to(card, {
          scale: 1.05,
          boxShadow: '0 0 40px hsl(199 89% 60% / 0.2)',
          duration: 0.3,
          ease: 'power2.out',
        });

        if (iconWrapper) {
          hoverTl.to(
            iconWrapper,
            {
              scale: 1.1,
              rotation: 5,
              duration: 0.3,
              ease: 'power2.out',
            },
            0
          );
        }

        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => hoverTl.reverse());
      });

      // Parallax effect on background elements
      gsap.to('.why-choose-bg', {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />
      <div className="why-choose-bg absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="why-choose-bg absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={leftContentRef}>
            <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Why Partner With <span className="gradient-text">TECHWON</span>?
            </h2>
            <p className="text-foreground-secondary mb-8">
              We're not just another agency. We're your technology partner committed to
              driving real business transformation through innovation and excellence.
            </p>

            {/* Main CTA Card */}
            <div className="glass-card p-6 neon-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-display font-semibold">AI-Powered Everything</h4>
                  <p className="text-foreground-muted text-sm">Automation at its finest</p>
                </div>
              </div>
              <p className="text-foreground-secondary text-sm">
                From development to deployment, AI enhances every step of our process,
                delivering smarter solutions faster.
              </p>
            </div>
          </div>

          {/* Right Grid */}
          <div ref={rightGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => (featureCardsRef.current[index] = el)}
                className="glass-card-hover p-5 group cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="icon-wrapper w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-display font-semibold mb-2 text-sm">{feature.title}</h4>
                <p className="text-foreground-muted text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
