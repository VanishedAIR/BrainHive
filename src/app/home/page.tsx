import Navbar from "../_components/navbar";
import { UserSidebar } from "@/app/_components/UserSidebar";
import HomeClientContent from "@/app/_components/HomeClientContent";
import { PlusSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <section className="flex flex-col flex-1">
          <Navbar />
          <div className="absolute top-8 right-40 z-50">
            <a href = "./post">
            <Button className="bg-transparent hover:bg-[#d97706] transition-colors group">
              <PlusSquareIcon className="size-full text-black dark:text-white group-hover:text-white" />
            </Button>
            </a>
          </div>
        <div className="flex border-t border-border flex-1">
          <UserSidebar />
          <HomeClientContent />
        </div>
      </section>
    </div>
  );
}