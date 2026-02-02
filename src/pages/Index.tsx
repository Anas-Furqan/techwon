import SmoothScrollProvider from '@/components/animations/SmoothScroll';
import Navbar from '@/components/Navbar';
import Hero from '@/components/HeroNew';
import Services from '@/components/ServicesNew';
import HowItWorks from '@/components/HowItWorksNew';
import WhyChoose from '@/components/WhyChooseNew';
import Team from '@/components/Team';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

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
