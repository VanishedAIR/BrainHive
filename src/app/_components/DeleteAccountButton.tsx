"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteCurrentUser } from "@/actions/useractions";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useClerk } from "@clerk/nextjs";

export default function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signOut } = useClerk();

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      // First delete the user from the database
      const result = await deleteCurrentUser();

      if (result.success) {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });

        // Then sign out from Clerk
        await signOut(() => {
          // Redirect to home page after sign out
          router.push("/");
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to delete account",
        });
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full mt-4">
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure twin?</AlertDialogTitle>
          <AlertDialogDescription>
            This action CANNOT be undone 😭✌️.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Deleting..." : "Yes, delete my account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
