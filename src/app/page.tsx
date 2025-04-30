import { getCurrentUser, syncUser } from "@/actions/useractions";
import Hero from "./_components/hero";
import Navbar from "./_components/navbar";
import Overview from "./_components/overview";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  await syncUser();
  const user = await getCurrentUser();

  if (user) {
    return redirect("/home");
  }

  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <Overview />
    </div>
  );
}
