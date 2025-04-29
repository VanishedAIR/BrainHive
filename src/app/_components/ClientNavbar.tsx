"use client";

/**
 * ClientNavbar Component
 *
 * This component renders the navigation bar for the Study Group Finder application.
 * It displays a "Sign In" button for users who are logged out and a user profile button for logged-in users.
 *
 * Components:
 * - `SignedIn`: Renders its children only when the user is signed in.
 * - `SignedOut`: Renders its children only when the user is signed out.
 * - `SignInButton`: A button that opens a sign-in modal for users.
 * - `UserButton`: A button that shows the user's profile and account options.
 * - `Button`: A reusable button component styled for the application.
 *
 * Styling:
 * - The "Sign In" button features custom hover effects and styling for both light and dark themes.
 *
 * Props:
 * - None (this component does not take any props).
 */

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function ClientNavbar() {
  return (
    <div className="flex gap-4 flex-row items-center">
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="default" className="bg-transparent hover:bg-[#d97706] border-2 border-primary hover:border-[#d97706] text-primary font-bold dark:text-white hover:text-white">Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
