/**
 * HomePage Component
 *
 * This component renders the home page of the Study Group Finder application.
 * It includes a navigation bar, a button to create a new study group post, and the main content area.
 *
 * Structure:
 * - A `Navbar` component at the top for navigation.
 * - A floating button that links to the "Create Post" page.
 * - A `HomeClientContent` component that displays the main content of the home page.
 *
 * Components Used:
 * - `Navbar`: Displays the navigation bar for the application.
 * - `Button`: A reusable button component styled for the application.
 * - `PlusSquareIcon`: An icon from the `lucide-react` library used in the "Create Post" button.
 * - `HomeClientContent`: Displays the main content of the home page.
 *
 * Styling:
 * - Uses Tailwind CSS for layout and styling.
 * - Includes a floating button positioned at the top-right corner of the page.
 *
 * Behavior:
 * - Clicking the "Create Post" button navigates the user to the post creation page.
 */

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
