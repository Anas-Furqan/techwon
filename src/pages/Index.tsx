import SmoothScrollProvider from '@/components/animations/SmoothScroll';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import HowItWorks from '@/components/HowItWorks';
import WhyChoose from '@/components/WhyChoose';
import Team from '@/components/Team';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

/**
 * Index Page - Production-Ready Landing Page
 * All components consolidated and optimized for 60fps
 * Mobile-first responsive design with gsap.matchMedia()
 */

const Index = () => {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <HowItWorks />
          <WhyChoose />
          <Team />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
};

export default Index;
