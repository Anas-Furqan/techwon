import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Bot,
  ShoppingCart,
  Phone,
  Brain,
  Search,
  BarChart3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import ServiceFlowchart from './animations/ServiceFlowchart';
import MagneticButton from './animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/**
 * Services Section - Optimized sticky stack cards
 * Performance: Single ScrollTrigger with onUpdate instead of per-card triggers
 * Uses gsap.context() for clean memory management
 */

// Service data with flowcharts
const services = [
  {
    icon: Bot,
    title: 'AI Agents',
    shortDesc: 'Intelligent automation for your business',
    description:
      'Automating business workflows, chatbots, and customer support. Our AI agents learn, adapt, and work 24/7 to streamline your operations.',
    color: 'from-secondary to-primary',
    flowchart: {
      nodes: [
        { id: '1', label: 'User Input', x: 20, y: 40, description: 'Customer query or trigger event' },
        { id: '2', label: 'NLP Processing', x: 200, y: 40, description: 'Natural language understanding and intent detection' },
        { id: '3', label: 'Knowledge Base', x: 380, y: 40, description: 'Access to your business data and FAQs' },
        { id: '4', label: 'AI Decision', x: 560, y: 40, description: 'Intelligent response generation' },
        { id: '5', label: 'Action Engine', x: 200, y: 160, description: 'Execute automated workflows' },
        { id: '6', label: 'Human Handoff', x: 380, y: 160, description: 'Escalate complex queries to team' },
        { id: '7', label: 'Response', x: 560, y: 160, description: 'Deliver personalized answer' },
        { id: '8', label: 'Analytics', x: 380, y: 280, description: 'Track performance and improve' },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '2', to: '5' },
        { from: '5', to: '6' },
        { from: '4', to: '7' },
        { from: '6', to: '7' },
        { from: '7', to: '8' },
      ],
    },
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Automation',
    shortDesc: 'AI-driven retail optimization',
    description:
      'AI-driven inventory management, dynamic pricing, and personalized customer engagement that boosts sales and reduces operational costs.',
    color: 'from-accent to-neon-cyan',
    flowchart: {
      nodes: [
        { id: '1', label: 'Data Collection', x: 20, y: 100, description: 'Gather sales, inventory, and market data' },
        { id: '2', label: 'AI Analysis', x: 200, y: 40, description: 'Pattern recognition and demand forecasting' },
        { id: '3', label: 'Price Optimization', x: 380, y: 40, description: 'Dynamic pricing based on market conditions' },
        { id: '4', label: 'Inventory Mgmt', x: 200, y: 160, description: 'Automated reordering and stock optimization' },
        { id: '5', label: 'Personalization', x: 380, y: 160, description: 'Customer-specific recommendations' },
        { id: '6', label: 'Engagement', x: 560, y: 100, description: 'Targeted marketing and retention' },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '1', to: '4' },
        { from: '2', to: '5' },
        { from: '3', to: '6' },
        { from: '5', to: '6' },
      ],
    },
  },
  {
    icon: Phone,
    title: 'Voice & Calling Agents',
    shortDesc: 'Intelligent voice solutions',
    description:
      'Intelligent AI voice solutions for automated sales calls, customer service, and appointment scheduling. Human-like conversations at scale.',
    color: 'from-primary to-secondary',
    flowchart: {
      nodes: [
        { id: '1', label: 'Call Initiated', x: 20, y: 100, description: 'Inbound or outbound call connection' },
        { id: '2', label: 'Voice Recognition', x: 200, y: 40, description: 'Speech-to-text processing' },
        { id: '3', label: 'Intent Analysis', x: 380, y: 40, description: 'Understand caller needs' },
        { id: '4', label: 'Response Gen', x: 560, y: 40, description: 'AI generates natural response' },
        { id: '5', label: 'Text-to-Speech', x: 560, y: 160, description: 'Natural voice synthesis' },
        { id: '6', label: 'CRM Update', x: 200, y: 160, description: 'Log call details and outcomes' },
        { id: '7', label: 'Follow-up Queue', x: 380, y: 280, description: 'Schedule next actions' },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '4', to: '5' },
        { from: '3', to: '6' },
        { from: '6', to: '7' },
      ],
    },
  },
  {
    icon: Brain,
    title: 'Custom AI Solutions',
    shortDesc: 'Predictive analytics & data intelligence',
    description:
      'Tailored predictive analytics and data intelligence solutions designed for your specific industry challenges and business objectives.',
    color: 'from-neon-cyan to-accent',
    flowchart: {
      nodes: [
        { id: '1', label: 'Data Sources', x: 20, y: 100, description: 'Connect your data ecosystems' },
        { id: '2', label: 'Data Pipeline', x: 200, y: 40, description: 'ETL and data processing' },
        { id: '3', label: 'ML Training', x: 380, y: 40, description: 'Custom model development' },
        { id: '4', label: 'Validation', x: 560, y: 40, description: 'Testing and accuracy verification' },
        { id: '5', label: 'Deployment', x: 380, y: 160, description: 'Production-ready AI systems' },
        { id: '6', label: 'Predictions', x: 560, y: 160, description: 'Real-time insights and forecasts' },
        { id: '7', label: 'Monitoring', x: 200, y: 160, description: 'Continuous model improvement' },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '4', to: '5' },
        { from: '5', to: '6' },
        { from: '5', to: '7' },
        { from: '7', to: '3' },
      ],
    },
  },
  {
    icon: Search,
    title: 'Agentic Workflow Audits',
    shortDesc: 'Deep-dive analysis for AI implementation',
    description:
      'Comprehensive analysis of your business bottlenecks to identify high-ROI AI implementation points. We map your processes and recommend optimal automation strategies.',
    color: 'from-secondary to-accent',
    isNew: true,
    flowchart: {
      nodes: [
        { id: '1', label: 'Process Mapping', x: 20, y: 40, description: 'Document current workflows' },
        { id: '2', label: 'Pain Point ID', x: 200, y: 40, description: 'Identify inefficiencies' },
        { id: '3', label: 'AI Opportunity', x: 380, y: 40, description: 'Match AI solutions to problems' },
        { id: '4', label: 'ROI Analysis', x: 560, y: 40, description: 'Calculate potential returns' },
        { id: '5', label: 'Priority Matrix', x: 200, y: 160, description: 'Rank implementation order' },
        { id: '6', label: 'Roadmap', x: 380, y: 160, description: 'Create implementation plan' },
        { id: '7', label: 'Quick Wins', x: 560, y: 160, description: 'Immediate automation targets' },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '2', to: '5' },
        { from: '5', to: '6' },
        { from: '4', to: '7' },
      ],
    },
  },
  {
    icon: BarChart3,
    title: 'Predictive Data Visualization',
    shortDesc: 'Real-time 3D dashboards',
    description:
      'Real-time 3D dashboards that forecast market trends using proprietary AI models. Transform complex data into actionable visual insights.',
    color: 'from-accent to-primary',
    isNew: true,
    flowchart: {
      nodes: [
        { id: '1', label: 'Data Streams', x: 20, y: 100, description: 'Real-time data ingestion' },
        { id: '2', label: 'AI Processing', x: 200, y: 40, description: 'Pattern detection algorithms' },
        { id: '3', label: 'Prediction Engine', x: 380, y: 40, description: 'Forecast future trends' },
        { id: '4', label: '3D Rendering', x: 560, y: 40, description: 'Visual representation' },
        { id: '5', label: 'Alert System', x: 200, y: 160, description: 'Anomaly notifications' },
        { id: '6', label: 'Dashboard', x: 380, y: 160, description: 'Interactive visualization' },
        { id: '7', label: 'Export & Share', x: 560, y: 160, description: 'Reports and collaboration' },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '2', to: '5' },
        { from: '4', to: '6' },
        { from: '6', to: '7' },
      ],
    },
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cardsContainer = cardsContainerRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!section || !header || !cardsContainer || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Header animation
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

      // Sticky stack card animation - SINGLE ScrollTrigger for performance
      const cardHeight = 280;
      const cardGap = 20;
      const totalScrollHeight = cards.length * (cardHeight + cardGap);

      // Set initial states for all cards
      cards.forEach((card, index) => {
        const isEven = index % 2 === 0;
        gsap.set(card, {
          y: index * 25,
          scale: 1 - index * 0.015,
          zIndex: cards.length - index,
          rotateY: isEven ? -2 : 2,
          transformPerspective: 1000,
        });
      });

      // SINGLE ScrollTrigger that handles all cards via onUpdate
      ScrollTrigger.create({
        trigger: cardsContainer,
        start: 'top 15%',
        end: `+=${totalScrollHeight}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1.5, // Balanced scrub value
        onUpdate: (self) => {
          const progress = self.progress;
          
          cards.forEach((card, index) => {
            if (!card) return;
            const isEven = index % 2 === 0;
            const cardProgress = Math.max(0, Math.min(1, (progress * cards.length) - index));
            
            // Smooth interpolation
            const y = gsap.utils.interpolate(index * 25, -80 - index * 60, cardProgress);
            const scale = gsap.utils.interpolate(1 - index * 0.015, 0.92, cardProgress);
            const opacity = gsap.utils.interpolate(1, index === 0 ? 0.4 : 0.6, cardProgress);
            const rotateY = gsap.utils.interpolate(isEven ? -2 : 2, 0, cardProgress);
            
            // Use set for immediate update (smoother than tween during scrub)
            gsap.set(card, { y, scale, opacity, rotateY });
          });
        },
      });

      // Card hover effects - no ScrollTrigger
      cards.forEach((card) => {
        if (!card) return;

        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(card, {
          scale: '+=0.02', // Relative scale increase
          boxShadow: '0 0 50px hsl(199 89% 60% / 0.25)',
          duration: 0.25,
          ease: 'power2.out',
        });

        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => hoverTl.reverse());
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleServiceClick = (service: (typeof services)[0]) => {
    setSelectedService(service);
    setIsFlowchartOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What We <span className="gradient-text">Offer</span>
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            Comprehensive AI-powered solutions designed to elevate your business with
            cutting-edge technology and creative excellence.
          </p>
        </div>

        {/* Sticky Stack Cards */}
        <div
          ref={cardsContainerRef}
          className="relative min-h-[600px] flex flex-col items-center justify-start"
          style={{ perspective: '1500px' }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              onClick={() => handleServiceClick(service)}
              className="absolute w-full max-w-4xl glass-card-hover p-8 cursor-pointer transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-0.5`}
                >
                  <div className="w-full h-full rounded-2xl bg-background-card flex items-center justify-center">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl font-semibold group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    {service.isNew && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-secondary to-accent text-[10px] font-bold text-primary-foreground uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-foreground-secondary font-medium mb-3">
                    {service.shortDesc}
                  </p>
                  <p className="text-foreground-muted text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <MagneticButton strength={0.3}>
                    <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group/link">
                      View Workflow
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </span>
                  </MagneticButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="text-center mt-8 text-foreground-muted text-sm">
          <span className="animate-pulse">↓ Scroll to explore more services ↓</span>
        </div>
      </div>

      {/* Flowchart Modal */}
      {selectedService && (
        <ServiceFlowchart
          isOpen={isFlowchartOpen}
          onClose={() => {
            setIsFlowchartOpen(false);
            setTimeout(() => setSelectedService(null), 300);
          }}
          service={{
            title: selectedService.title,
            description: selectedService.description,
            color: selectedService.color,
            nodes: selectedService.flowchart.nodes,
            connections: selectedService.flowchart.connections,
          }}
        />
      )}
    </section>
  );
}
