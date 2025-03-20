import Hero from "./_components/hero";
import Navbar from "./_components/navbar";

export default async function Home() {
  return (
    <div className={`relative`}>
      <Navbar />
      <Hero />
    </div>
  );
}
