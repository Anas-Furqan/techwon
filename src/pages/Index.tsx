import SmoothScrollProvider from '@/components/animations/SmoothScroll';
import Navbar from '@/components/NavbarNew';
import Hero from '@/components/HeroNew';
import Services from '@/components/ServicesNew';
import HowItWorks from '@/components/HowItWorksNew';
import WhyChoose from '@/components/WhyChooseNew';
import Team from '@/components/TeamNew';
import ContactForm from '@/components/ContactFormNew';
import Footer from '@/components/FooterNew';

/**
 * Index Page - Main landing page
 * Optimized: Removed CustomCursor (causes lag on some devices)
 * All sections use gsap.context() for clean memory management
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
