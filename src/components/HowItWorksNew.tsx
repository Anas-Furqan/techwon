import { useRef, useEffect } from 'react';
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
  },
  {
    icon: Target,
    title: 'Strategy',
    description:
      'Our team crafts a comprehensive roadmap with clear milestones and deliverables for your project.',
    step: '02',
  },
  {
    icon: Code,
    title: 'Development',
    description:
      'We build your solution using cutting-edge technologies with regular updates and feedback loops.',
    step: '03',
  },
  {
    icon: Rocket,
    title: 'Deployment',
    description:
      'Launch your project with confidence. We provide ongoing support and optimization post-launch.',
    step: '04',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const line = lineRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !header) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Connection line animation
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: line,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Cards animation with stagger
      cards.forEach((card, index) => {
        if (!card) return;

        const stepNumber = card.querySelector('.step-number');
        const cardContent = card.querySelector('.card-content');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // Step number pop-in
        if (stepNumber) {
          tl.fromTo(
            stepNumber,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: 'back.out(2)',
            }
          );
        }

        // Card slide up
        if (cardContent) {
          tl.fromTo(
            cardContent,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power4.out',
            },
            '-=0.3'
          );
        }

        // Hover animation
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(card, {
          y: -10,
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

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="relative cursor-pointer"
              >
                {/* Step Number */}
                <div className="step-number absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-bold text-primary-foreground text-lg z-10 shadow-lg">
                  {step.step}
                </div>

                {/* Card */}
                <div className="card-content glass-card-hover p-6 pt-10 h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
