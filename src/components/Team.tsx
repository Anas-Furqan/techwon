import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github } from 'lucide-react';

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Founder',
    bio: 'Visionary leader with 10+ years in tech innovation and AI development.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    socials: { linkedin: '#', twitter: '#', github: '#' },
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    bio: 'Expert in AI/ML systems and scalable architecture design.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    socials: { linkedin: '#', twitter: '#', github: '#' },
  },
  {
    name: 'Marcus Williams',
    role: 'Lead Developer',
    bio: 'Full-stack wizard specializing in modern web technologies.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    socials: { linkedin: '#', twitter: '#', github: '#' },
  },
];

export default function Team() {
  return (
    <section id="team" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />

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
            Our Team
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Meet The <span className="gradient-text">Experts</span>
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            A passionate team of innovators, designers, and developers dedicated to building the future.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card-hover p-6 text-center h-full">
                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-display text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-foreground-muted text-sm mb-6">{member.bio}</p>

                {/* Socials */}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={member.socials.linkedin}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-primary" />
                  </a>
                  <a
                    href={member.socials.twitter}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-primary" />
                  </a>
                  <a
                    href={member.socials.github}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Github className="w-4 h-4 text-primary" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
