import { motion } from 'framer-motion';
import { Globe, Bot, ShoppingCart, Megaphone, Lightbulb, Palette, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Custom, high-performance websites built with modern technologies. From landing pages to complex web applications.',
    color: 'from-primary to-accent',
  },
  {
    icon: Bot,
    title: 'AI Agents',
    description: 'Intelligent AI agents that automate workflows, handle customer support, and drive business efficiency.',
    color: 'from-secondary to-primary',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Automation',
    description: 'Streamline your online store with AI-powered inventory, pricing, and customer engagement solutions.',
    color: 'from-accent to-neon-cyan',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Data-driven marketing strategies powered by AI analytics to maximize your ROI and reach.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Lightbulb,
    title: 'Brand Strategies',
    description: 'Develop a powerful brand identity that resonates with your audience and stands out in the market.',
    color: 'from-neon-cyan to-accent',
  },
  {
    icon: Palette,
    title: 'Graphics Designing',
    description: 'Stunning visual designs that capture attention and communicate your brand message effectively.',
    color: 'from-secondary to-neon-cyan',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Services() {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What We <span className="gradient-text">Offer</span>
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            Comprehensive digital solutions designed to elevate your business with cutting-edge technology and creative excellence.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group glass-card-hover p-6 cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-6`}>
                <div className="w-full h-full rounded-xl bg-background-card flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-foreground-muted text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* CTA */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-primary text-sm font-medium group/link"
              >
                Buy Service
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
