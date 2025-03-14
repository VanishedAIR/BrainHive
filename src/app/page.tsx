"use client";
import Hero from "./hero";
import Navbar from "./navbar";

export default function Home() {
  return (
    <div className={`relative`}>
      <Navbar />
      <Hero />
    </div>
  );
}