import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Twitter, Github, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Team Section - Optimized scroll reveal with clip-path animation
 * Features:
 * - Single ScrollTrigger per section (not per card)
 * - Clip-path reveal for images
 * - Scale-in animation on scroll
 * - Lazy loading for images
 * - GPU-accelerated transforms
 */

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Founder',
    bio: 'Visionary leader with 10+ years in tech innovation and AI development.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    techStack: ['Python', 'TensorFlow', 'Leadership'],
    socials: { linkedin: '#', twitter: '#', github: '#' },
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    bio: 'Expert in AI/ML systems and scalable architecture design.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    techStack: ['PyTorch', 'AWS', 'System Design'],
    socials: { linkedin: '#', twitter: '#', github: '#' },
  },
  {
    name: 'Marcus Williams',
    role: 'Lead Developer',
    bio: 'Full-stack wizard specializing in modern web technologies.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    techStack: ['React', 'Node.js', 'TypeScript'],
    socials: { linkedin: '#', twitter: '#', github: '#' },
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !header) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const ctx = gsap.context(() => {
      // Header animation - single trigger
      gsap.fromTo(
        header.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards - SINGLE ScrollTrigger with staggered reveal (clip-path + scale)
      cards.forEach((card, index) => {
        if (!card) return;
        const image = card.querySelector('.team-image');
        const content = card.querySelector('.team-content');

        // Set initial states
        gsap.set(card, { opacity: 0, y: 60, scale: 0.9 });
        if (image) {
          gsap.set(image, { 
            clipPath: 'circle(0% at 50% 50%)',
            scale: 1.2,
          });
        }
        if (content) {
          gsap.set(content, { y: 20, opacity: 0 });
        }
      });

      // Single timeline for all cards
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: section.querySelector('.grid'),
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      cards.forEach((card, index) => {
        if (!card) return;
        const image = card.querySelector('.team-image');
        const content = card.querySelector('.team-content');
        const staggerOffset = index * 0.15;

        cardsTl.to(
          card,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
          },
          staggerOffset
        );

        if (image) {
          cardsTl.to(
            image,
            {
              clipPath: 'circle(75% at 50% 50%)',
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
            },
            staggerOffset + 0.1
          );
        }

        if (content) {
          cardsTl.to(
            content,
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power3.out',
            },
            staggerOffset + 0.3
          );
        }
      });

      // Hover effects (desktop only) - no ScrollTrigger needed
      if (!isMobile) {
        cards.forEach((card) => {
          if (!card) return;
          const techOverlay = card.querySelector('.tech-overlay');

          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.03,
              boxShadow: '0 0 40px hsl(199 89% 60% / 0.2)',
              duration: 0.3,
              ease: 'power2.out',
            });
            if (techOverlay) {
              gsap.to(techOverlay, { opacity: 1, duration: 0.25 });
            }
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              duration: 0.3,
              ease: 'power2.out',
            });
            if (techOverlay) {
              gsap.to(techOverlay, { opacity: 0, duration: 0.25 });
            }
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="section-padding relative overflow-hidden"
      style={{ transformOrigin: 'center center' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary font-medium mb-4">
            Our Team
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Meet The <span className="gradient-text">Experts</span>
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            A passionate team of innovators, designers, and developers dedicated to building the
            future.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="team-card group glass-card-hover p-6 text-center h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              data-cursor="team"
            >
              {/* Tech Stack Overlay (shown on hover) */}
              <div className="tech-overlay absolute inset-0 bg-background/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-20 opacity-0 pointer-events-none">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <p className="text-xs text-foreground-muted mb-3">Tech Stack</p>
                <div className="flex flex-wrap gap-2 justify-center px-4">
                  {member.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Avatar with clip-path reveal - LAZY LOADING */}
              <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                <div className="team-image relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent p-0.5 gpu-accelerated">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="team-content">
                <h3 className="font-display text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-foreground-muted text-sm mb-6">{member.bio}</p>

                {/* Socials */}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={member.socials.linkedin}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={member.socials.twitter}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={member.socials.github}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
