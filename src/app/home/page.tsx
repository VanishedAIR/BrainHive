import ClientNavbar from "../_components/ClientNavbar";
import Link from "next/link";
import { UserSidebar } from "@/app/_components/UserSidebar";
import HomeClientContent from "@/app/_components/HomeClientContent";

export default function HomePage() {
  return (
    <div className="relative">
      <section>
        <header className="flex justify-between items-center p-4 h-25">
          <Link href="/">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-20 w-20 mt-[1.35rem]"
            />
          </Link>
          <ClientNavbar />
        </header>
      </section>
      <div className="flex">
        {/* User Sidebar */}
        <UserSidebar />

        {/* Main Content */}
        <HomeClientContent />
      </div>
    </div>
  );
}
