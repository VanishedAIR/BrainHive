"use client";

/**
 * ClientNavbar Component
 *
 * This component renders the navigation bar for the Study Group Finder application.
 * It displays a "Sign In" button for users who are logged out and a user profile button for logged-in users.
 *
 * Features:
 * - Displays a "Sign In" button that opens a modal for authentication.
 * - Shows a user profile button when the user is signed in.
 *
 * Components:
 * - `SignedIn`: Renders its children only when the user is signed in.
 * - `SignedOut`: Renders its children only when the user is signed out.
 * - `SignInButton`: A button that triggers the sign-in modal.
 * - `UserButton`: Displays the user's profile and account options.
 * - `Button`: A reusable styled button component.
 *
 * Styling:
 * - The "Sign In" button includes hover effects and supports light and dark themes.
 *
 * Props:
 * - None.
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
