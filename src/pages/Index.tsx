import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ContentGrid from "@/components/ContentGrid";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <AdPlacement position="homepage_top" className="container mx-auto px-4 py-4" />
      <Hero />
      <Categories />
      <AdPlacement position="homepage_middle" className="container mx-auto px-4 py-6" />
      <ContentGrid />
      <AdPlacement position="homepage_bottom" className="container mx-auto px-4 py-4" />
      <Footer />
    </main>
  );
};

export default Index;
