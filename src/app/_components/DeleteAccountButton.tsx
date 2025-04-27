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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signOut } = useClerk();

  const handleDeleteAccount = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      // First delete the user from the database
      const result = await deleteCurrentUser();

      if (result.success) {
        toast({
          title: "Success",
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

    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={handleDeleteAccount}
        className="w-full mt-4"
      >
        Delete Account
      </Button>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your study groups.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
