import ExpertRepairServices from "@/components/home/ExpertRepairServices";
import FeaturedGadgets from "@/components/home/FeaturedGadgets";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import PromoBanner from "@/components/home/PromoBanner";
import ShopbyCategory from "@/components/home/ShopbyCategory";

export default function Home() {

  return (
    <main className="flex flex-col min-h-screen w-full overflow-hidden">
      <Hero />
      <PromoBanner />
      <FeaturedGadgets />
      <ShopbyCategory />
      <ExpertRepairServices />
      <Features />
    </main>
  );
}
