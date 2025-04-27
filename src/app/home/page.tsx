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
          <a href="./post">
            <Button>
              <PlusSquareIcon size={24} />
            </Button>
          </a>
        </div>
        <div className="flex border-t border-border flex-1">
          <HomeClientContent />
        </div>
      </section>
    </div>
  );
}
