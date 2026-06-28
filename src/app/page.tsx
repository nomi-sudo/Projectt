import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import StatsBar from "@/components/home/StatsBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoSection from "@/components/home/PromoSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <CategoryGrid />
      <PromoSection />
      <FeaturedProducts />
    </div>
  );
}
