import SmoothScrollProvider from '@/components/animations/SmoothScroll';
import CustomCursor from '@/components/animations/CustomCursor';
import Navbar from '@/components/NavbarNew';
import Hero from '@/components/HeroNew';
import Services from '@/components/ServicesNew';
import HowItWorks from '@/components/HowItWorksNew';
import WhyChoose from '@/components/WhyChooseNew';
import Team from '@/components/TeamNew';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/FooterNew';

const Index = () => {
  return (
    <SmoothScrollProvider>
      {/* Custom Cursor (hidden on mobile) */}
      <CustomCursor />
      
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
