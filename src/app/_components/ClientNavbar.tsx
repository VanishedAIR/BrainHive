"use client";

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
