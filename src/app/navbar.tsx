import { ModeToggle } from "@/components/ui/toggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <section>
      <header className="flex justify-between items-center p-4 h-16">
        {/* logo on the left side of the navbar: */}
        <img src="/logo.svg" alt="Logo" className="h-20 w-20" />
        <div className="flex gap-4">
          <SignedOut>
            <ModeToggle />
            <SignInButton mode="modal" />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
    </section>
  );
}
