import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Twitter, Github, Instagram, ArrowUpRight } from 'lucide-react';
import techwonLogo from '@/assets/techwon-logo.jpg';
import MagneticButton from './animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  services: [
    { name: 'AI Agents', href: '#services' },
    { name: 'E-Commerce Automation', href: '#services' },
    { name: 'Voice & Calling Agents', href: '#services' },
    { name: 'Custom AI Solutions', href: '#services' },
  ],
  company: [
    { name: 'About Us', href: '#why-us' },
    { name: 'Our Team', href: '#team' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

const socials = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const content = contentRef.current;
    const brand = brandRef.current;
    const links = linksRef.current;
    const bottom = bottomRef.current;

    if (!footer || !content) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Desktop: Full timeline animations
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });

        tl.fromTo('.footer-top-line', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.inOut' });

        if (brand) {
          tl.fromTo(brand.children, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, '-=0.5');
        }

        if (links) {
          const linkColumns = links.querySelectorAll('.link-column');
          tl.fromTo(linkColumns, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power4.out' }, '-=0.5');
        }

        if (bottom) {
          tl.fromTo(bottom, { yPercent: 20, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power4.out' }, '-=0.3');
        }

        // Hover effects - desktop only
        const socialIcons = footer.querySelectorAll('.social-icon');
        socialIcons.forEach((icon) => {
          const hoverTl = gsap.timeline({ paused: true });
          hoverTl.to(icon, { scale: 1.2, yPercent: -10, duration: 0.3, ease: 'back.out(2)' });
          icon.addEventListener('mouseenter', () => hoverTl.play());
          icon.addEventListener('mouseleave', () => hoverTl.reverse());
        });

        const linkItems = footer.querySelectorAll('.footer-link');
        linkItems.forEach((link) => {
          const arrow = link.querySelector('.link-arrow');
          const hoverTl = gsap.timeline({ paused: true });
          hoverTl.to(arrow, { xPercent: 100, yPercent: -100, opacity: 1, duration: 0.3 });
          link.addEventListener('mouseenter', () => hoverTl.play());
          link.addEventListener('mouseleave', () => hoverTl.reverse());
        });

        // Parallax - desktop only
        gsap.to('.footer-bg-glow', {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        });
      });

      // Mobile/Tablet: Simple fade-in
      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          [brand, links, bottom].filter(Boolean),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footer,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, footer);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative pt-20 pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-card" />
      <div className="footer-bg-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Top gradient line */}
      <div className="footer-top-line absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div ref={contentRef} className="container-custom relative z-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div ref={brandRef} className="lg:col-span-2">
            <img src={techwonLogo} alt="TECHWON" className="h-12 w-auto mb-4" />
            <p className="text-foreground-muted text-sm leading-relaxed mb-6 max-w-sm">
              TECHWON is your AI-first digital agency, transforming businesses with
              cutting-edge technology and innovative solutions.
            </p>
            
            {/* Social Icons with magnetic effect */}
            <div className="flex items-center gap-3">
              {socials.map((social, index) => (
                <MagneticButton key={index} strength={0.4}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="social-icon w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div ref={linksRef} className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Services */}
            <div className="link-column">
              <h4 className="font-display font-semibold mb-4 text-foreground">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="footer-link group relative inline-flex items-center gap-1 text-foreground-muted text-sm hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                      <ArrowUpRight className="link-arrow w-3 h-3 opacity-0 -translate-x-1 translate-y-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="link-column">
              <h4 className="font-display font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="footer-link group relative inline-flex items-center gap-1 text-foreground-muted text-sm hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                      <ArrowUpRight className="link-arrow w-3 h-3 opacity-0 -translate-x-1 translate-y-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="link-column">
              <h4 className="font-display font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="footer-link group relative inline-flex items-center gap-1 text-foreground-muted text-sm hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                      <ArrowUpRight className="link-arrow w-3 h-3 opacity-0 -translate-x-1 translate-y-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          ref={bottomRef}
          className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-foreground-muted text-sm">
            © {new Date().getFullYear()} TECHWON. All rights reserved.
          </p>
          <p className="text-foreground-muted text-sm flex items-center gap-1">
            Built with <span className="text-red-500 animate-pulse">❤</span> by{' '}
            <span className="text-primary font-medium">TECHWON</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
