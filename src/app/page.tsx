"use client";
import Hero from "./_components/hero";
import Navbar from "./_components/navbar";

export default function Home() {
  return (
    <div className={`relative`}>
      <Navbar />
      <Hero />
    </div>
  );
}