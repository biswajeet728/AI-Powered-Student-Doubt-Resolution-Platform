import Footer from "@/components/footer";
import HomeHeader from "@/components/header";

import Features from "@/views/home/_features";
import Hero from "@/views/home/_hero";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
