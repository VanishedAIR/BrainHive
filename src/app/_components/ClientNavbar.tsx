"use client";

import { ModeToggle } from "@/components/ui/toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function ClientNavbar() {
  return (
    <div className="flex gap-4 flex-row items-center">
      <SignedOut>
        <ModeToggle />
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
