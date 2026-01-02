import { motion } from 'framer-motion';
import { Brain, Layers, Zap, TrendingUp, Shield, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-First Solutions',
    description: 'We integrate artificial intelligence into every solution, ensuring your business stays ahead of the curve.',
  },
  {
    icon: Layers,
    title: 'Scalable Systems',
    description: 'Build once, scale infinitely. Our architectures are designed to grow with your business needs.',
  },
  {
    icon: Zap,
    title: 'Modern Tech Stack',
    description: 'We use the latest technologies and frameworks to deliver fast, secure, and reliable solutions.',
  },
  {
    icon: TrendingUp,
    title: 'Business-Driven Results',
    description: 'Every decision we make is focused on delivering measurable business outcomes and ROI.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security protocols protect your data and your customers information.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock support ensures your systems are always running smoothly.',
  },
];

export default function WhyChoose() {
  return (
    <section id="why-us" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Why Partner With <span className="gradient-text">TECHWON</span>?
            </h2>
            <p className="text-foreground-secondary mb-8">
              We're not just another agency. We're your technology partner committed to driving real business transformation through innovation and excellence.
            </p>

            {/* Main CTA */}
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
                From development to deployment, AI enhances every step of our process, delivering smarter solutions faster.
              </p>
            </div>
          </motion.div>

          {/* Right Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card-hover p-5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-display font-semibold mb-2 text-sm">{feature.title}</h4>
                <p className="text-foreground-muted text-xs leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
