import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Twitter, Github, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

    // Check for mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header.children,
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards with clip-path reveal mask
      cards.forEach((card, index) => {
        if (!card) return;

        const image = card.querySelector('.team-image');
        const content = card.querySelector('.team-content');
        const techOverlay = card.querySelector('.tech-overlay');

        // Initial states
        gsap.set(card, { opacity: 0 });
        if (image) {
          gsap.set(image, { 
            clipPath: 'circle(0% at 50% 50%)',
            scale: 1.2,
          });
        }
        if (content) {
          gsap.set(content, { yPercent: 30, opacity: 0 });
        }

        // Reveal timeline
        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        revealTl
          .to(card, {
            opacity: 1,
            duration: 0.3,
          })
          .to(
            image,
            {
              clipPath: 'circle(75% at 50% 50%)',
              scale: 1,
              duration: 1.2,
              ease: 'power4.out',
            },
            '-=0.1'
          )
          .to(
            content,
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power4.out',
            },
            '-=0.6'
          );

        // Tilt effect (desktop only)
        if (!isMobile) {
          const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / (rect.height / 2)) * -10;
            const rotateY = (mouseX / (rect.width / 2)) * 10;

            gsap.to(card, {
              rotateX,
              rotateY,
              transformPerspective: 1000,
              duration: 0.5,
              ease: 'power2.out',
            });

            // Subtle image parallax
            if (image) {
              gsap.to(image, {
                xPercent: (mouseX / rect.width) * 5,
                yPercent: (mouseY / rect.height) * 5,
                duration: 0.5,
                ease: 'power2.out',
              });
            }
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.7,
              ease: 'elastic.out(1, 0.5)',
            });

            if (image) {
              gsap.to(image, {
                xPercent: 0,
                yPercent: 0,
                duration: 0.5,
                ease: 'power2.out',
              });
            }
          };

          const handleMouseEnter = () => {
            // Show tech overlay
            if (techOverlay) {
              gsap.to(techOverlay, {
                opacity: 1,
                duration: 0.3,
              });
            }

            gsap.to(card, {
              scale: 1.02,
              boxShadow: '0 0 60px hsl(199 89% 60% / 0.3)',
              duration: 0.3,
            });
          };

          const handleMouseLeaveCard = () => {
            if (techOverlay) {
              gsap.to(techOverlay, {
                opacity: 0,
                duration: 0.3,
              });
            }

            gsap.to(card, {
              scale: 1,
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              duration: 0.3,
            });
          };

          card.addEventListener('mousemove', handleMouseMove);
          card.addEventListener('mouseleave', handleMouseLeave);
          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeaveCard);

          // Store cleanup refs
          (card as any)._cleanup = () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeaveCard);
          };
        }
      });

      // Scroll-linked section scaling
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const progress = self.progress;
          // Scale up as entering, scale down as leaving
          const scale = progress < 0.5 
            ? 0.95 + progress * 0.1 
            : 1 - (progress - 0.5) * 0.1;
          
          gsap.set(section, {
            scale: Math.max(0.95, Math.min(1, scale)),
          });
        },
      });
    }, section);

    return () => {
      ctx.revert();
      // Cleanup event listeners
      cards.forEach((card) => {
        if ((card as any)?._cleanup) {
          (card as any)._cleanup();
        }
      });
    };
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

              {/* Avatar with clip-path reveal */}
              <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                <div className="team-image relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                  <img
                    src={member.image}
                    alt={member.name}
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
