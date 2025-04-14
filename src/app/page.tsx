import Hero from "./_components/hero";
import Navbar from "./_components/navbar";
import Overview from "./_components/overview";

export default async function LandingPage() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <Overview />
    </div>
  );
}
