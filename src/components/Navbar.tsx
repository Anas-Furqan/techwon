import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import techwonLogo from '@/assets/techwon-logo.jpg';
import MagneticButton from './animations/MagneticButton';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Why Us', href: '#why-us' },
  { name: 'Team', href: '#team' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;
    const links = linksRef.current;
    const cta = ctaRef.current;

    if (!nav || !logo || !links || !cta) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(nav, { yPercent: -100 });
      gsap.set(logo, { opacity: 0, xPercent: -20 });
      gsap.set(links.children, { opacity: 0, yPercent: -30 });
      gsap.set(cta, { opacity: 0, xPercent: 20 });

      // Entrance timeline
      const entranceTl = gsap.timeline({
        delay: 0.5,
        defaults: { ease: 'power4.out' },
      });

      // Nav slides down
      entranceTl.to(nav, {
        yPercent: 0,
        duration: 0.8,
      });

      // Logo fades in from left
      entranceTl.to(
        logo,
        {
          opacity: 1,
          xPercent: 0,
          duration: 0.6,
        },
        '-=0.4'
      );

      // Links stagger in
      entranceTl.to(
        links.children,
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.5,
          stagger: 0.08,
        },
        '-=0.3'
      );

      // CTA fades in from right
      entranceTl.to(
        cta,
        {
          opacity: 1,
          xPercent: 0,
          duration: 0.6,
        },
        '-=0.3'
      );

      // Scroll-based navbar background intensity
      let lastScrollY = 0;
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const scrolled = scrollY > 50;

        gsap.to(nav.querySelector('.nav-glass'), {
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
          backgroundColor: scrolled
            ? 'rgba(17, 24, 39, 0.9)'
            : 'rgba(17, 24, 39, 0.7)',
          duration: 0.3,
        });

        // Hide/show navbar on scroll direction
        if (scrollY > 300) {
          if (scrollY > lastScrollY) {
            // Scrolling down
            gsap.to(nav, {
              yPercent: -100,
              duration: 0.3,
              ease: 'power2.in',
            });
          } else {
            // Scrolling up
            gsap.to(nav, {
              yPercent: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        }

        lastScrollY = scrollY;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Link hover effects
      const linkElements = links.querySelectorAll('a');
      linkElements.forEach((link) => {
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl.to(link, {
          color: 'hsl(var(--primary))',
          duration: 0.2,
        });

        link.addEventListener('mouseenter', () => hoverTl.play());
        link.addEventListener('mouseleave', () => hoverTl.reverse());
      });

      // Cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, nav);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="container-custom">
        <div className="nav-glass glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a ref={logoRef} href="#home" className="flex items-center gap-2">
            <img src={techwonLogo} alt="TECHWON" className="h-10 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div ref={linksRef} className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground-secondary hover:text-primary transition-colors duration-300 text-sm font-medium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div ref={ctaRef} className="hidden md:block">
            <MagneticButton href="#contact" strength={0.3}>
              <span className="btn-primary text-sm" data-cursor="action" data-cursor-text="Start">
                Get Started
              </span>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden mt-2 glass-card overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-foreground-secondary hover:text-primary transition-colors duration-300 text-sm font-medium py-2"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary text-sm text-center mt-2"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
