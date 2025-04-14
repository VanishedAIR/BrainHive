import Navbar from "../_components/navbar";
import { UserSidebar } from "@/app/_components/UserSidebar";
import HomeClientContent from "@/app/_components/HomeClientContent";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <section className="flex flex-col flex-1">
          <Navbar />
        <div className="flex border-t border-border flex-1">
          <UserSidebar />
          <HomeClientContent />
        </div>
      </section>
    </div>
  );
}