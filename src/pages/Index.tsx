import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ContentGrid from "@/components/ContentGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Categories />
      <ContentGrid />
      <Footer />
    </main>
  );
};

export default Index;
