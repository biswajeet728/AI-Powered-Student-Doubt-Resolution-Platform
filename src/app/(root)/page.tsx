import Footer from "@/components/footer";
import HomeHeader from "@/components/header";

import Features from "@/views/home/_features";
import Hero from "@/views/home/_hero";

// openclaude --resume 31d3c14f-e26a-4d4c-afbd-b6bded6ae0f8
// openclaude --resume 31d3c14f-e26a-4d4c-afbd-b6bded6ae0f8

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
