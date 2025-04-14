import ClientNavbar from "../_components/ClientNavbar";
import Link from "next/link";
import { UserSidebar } from "@/app/_components/UserSidebar";
import HomeClientContent from "@/app/_components/HomeClientContent";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <section className="flex flex-col flex-1">
        <header className="flex justify-between items-center p-4 h-25">
          <Link href="/">
            <img src="/logo.svg" alt="Logo" className="h-20 w-20 mt-1.35" />
          </Link>
          <ClientNavbar />
        </header>
        <div className="flex border-t border-border flex-1">
          <UserSidebar />
          <HomeClientContent />
        </div>
      </section>
    </div>
  );
}