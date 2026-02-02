import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, CheckCircle, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import MagneticButton from './animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/**
 * ContactFormNew - Premium animated contact form
 * Features:
 * - Line-draw focus animation on inputs
 * - Magnetic submit button
 * - Staggered scroll reveal
 * - Optimized with gsap.context()
 */

const services = [
  'Website Development',
  'AI Agents',
  'E-Commerce Automation',
  'Digital Marketing',
  'Brand Strategies',
  'Graphics Designing',
];

interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const leftContent = leftContentRef.current;
    const formContainer = formContainerRef.current;

    if (!section || !leftContent || !formContainer) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Desktop: Full reveal animations
      mm.add('(min-width: 1024px)', () => {
        gsap.fromTo(
          leftContent.children,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftContent,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        gsap.fromTo(
          formContainer,
          { x: 50, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formContainer,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Mobile/Tablet: Simple fade-up
      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          leftContent.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftContent,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        gsap.fromTo(
          formContainer,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formContainer,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Input line-draw effect (all devices)
      inputRefs.current.forEach((inputWrapper) => {
        if (!inputWrapper) return;
        const line = inputWrapper.querySelector('.input-line');
        if (line) gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  // Handle input focus animation
  const handleInputFocus = (index: number) => {
    const wrapper = inputRefs.current[index];
    if (!wrapper) return;
    const line = wrapper.querySelector('.input-line');
    if (line) {
      gsap.to(line, { scaleX: 1, duration: 0.4, ease: 'power2.out' });
    }
  };

  const handleInputBlur = (index: number) => {
    const wrapper = inputRefs.current[index];
    if (!wrapper) return;
    const line = wrapper.querySelector('.input-line');
    if (line) {
      gsap.to(line, { scaleX: 0, duration: 0.3, ease: 'power2.in' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const submissions = JSON.parse(localStorage.getItem('techwon-submissions') || '[]');
    submissions.push({
      ...formData,
      id: Date.now(),
      date: new Date().toISOString(),
      notes: '',
    });
    localStorage.setItem('techwon-submissions', JSON.stringify(submissions));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Your request has been submitted successfully!');

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', service: '', message: '' });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl gpu-accelerated" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl gpu-accelerated" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={leftContentRef}>
            <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary font-medium mb-4">
              Get In Touch
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Business?
            </h2>
            <p className="text-foreground-secondary mb-8">
              Let's discuss how TECHWON can help you achieve your digital goals. Fill out the form
              and our team will get back to you within 24 hours.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <div className="glass-card p-4 flex items-center gap-4 gpu-accelerated hover:border-primary/30 transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground-muted text-sm">Email Us</p>
                  <p className="font-medium">techwon@gmail.com</p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center gap-4 gpu-accelerated hover:border-primary/30 transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground-muted text-sm">Call Us</p>
                  <p className="font-medium">+92 329 2123655</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div ref={formContainerRef}>
            <div className="glass-card p-8 neon-border gpu-accelerated">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-foreground-muted">
                    We've received your request and will contact you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div
                    ref={(el) => (inputRefs.current[0] = el)}
                    className="relative"
                  >
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleInputFocus(0)}
                      onBlur={() => handleInputBlur(0)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                    <div className="input-line absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  </div>

                  {/* Email Input */}
                  <div
                    ref={(el) => (inputRefs.current[1] = el)}
                    className="relative"
                  >
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleInputFocus(1)}
                      onBlur={() => handleInputBlur(1)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                    <div className="input-line absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  </div>

                  {/* Service Select */}
                  <div
                    ref={(el) => (inputRefs.current[2] = el)}
                    className="relative"
                  >
                    <label htmlFor="service" className="block text-sm font-medium mb-2">
                      Select Service
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      onFocus={() => handleInputFocus(2)}
                      onBlur={() => handleInputBlur(2)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Choose a service...</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    <div className="input-line absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  </div>

                  {/* Message Textarea */}
                  <div
                    ref={(el) => (inputRefs.current[3] = el)}
                    className="relative"
                  >
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleInputFocus(3)}
                      onBlur={() => handleInputBlur(3)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                    <div className="input-line absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  </div>

                  {/* Magnetic Submit Button */}
                  <MagneticButton className="w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-cursor="action"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
