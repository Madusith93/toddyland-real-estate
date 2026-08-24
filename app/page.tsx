
import HeroSection from "./components/HeroSection";
import FindPropertiesByProvince from '@/components/FindPropertiesByProvince';
import AllPropertiesMap from "./components/AllPropertiesMap";
import WelcomeSection from "./components/WelcomeSection";
import FindPropertiesByLocation from "./components/FindPropertiesByLocation";
import ServicesSection from "./components/ServicesSection";
import MostRecommendedProperties from "./components/MostRecommendedProperties";
import PropertyTypes from "./components/PropertyTypes";
import SriLankaOverview from "./components/SriLankaOverview";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header Navigation */}
      

      {/* 2. Hero Section (with Navbar Padding Top) */}
      <div className="pt-20">
        <HeroSection />
        <FindPropertiesByProvince />
        <AllPropertiesMap />
        <WelcomeSection />
        <FindPropertiesByLocation />
        <ServicesSection />
        <MostRecommendedProperties />
        <PropertyTypes />
        <SriLankaOverview />
      </div>
    </main>
  );
}