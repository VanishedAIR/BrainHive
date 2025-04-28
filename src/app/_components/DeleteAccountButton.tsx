"use client";

/**
 * DeleteAccountButton Component
 *
 * This component renders a button that allows users to delete their account.
 * It includes a confirmation dialog to ensure the user wants to proceed with the deletion.
 *
 * State:
 * - `isDeleteDialogOpen` (boolean): Indicates whether the delete confirmation dialog is open.
 * - `isDeleting` (boolean): Indicates whether the account deletion process is in progress.
 *
 * Functions:
 * - `handleDeleteAccount`: Opens the delete confirmation dialog.
 * - `confirmDeleteAccount`: Confirms the deletion of the user's account, triggers the deletion process, and displays success or error messages.
 *
 * Components Used:
 * - `Button`: A reusable button component styled for the application.
 * - `AlertDialog`: A dialog component for confirming the delete action.
 * - `AlertDialogAction`: The action button within the dialog to confirm deletion.
 * - `AlertDialogCancel`: The cancel button within the dialog.
 * - `AlertDialogContent`: The content wrapper for the dialog.
 * - `AlertDialogDescription`: The description text within the dialog.
 * - `AlertDialogFooter`: The footer section of the dialog containing action buttons.
 * - `AlertDialogHeader`: The header section of the dialog.
 * - `AlertDialogTitle`: The title of the dialog.
 *
 * External Actions:
 * - `deleteCurrentUser`: Deletes the user's account from the server.
 * - `signOut`: Signs the user out using Clerk.
 * - `toast`: Displays success or error messages to the user.
 *
 * Accessibility:
 * - The dialog includes descriptive text to ensure accessibility for screen readers.
 *
 * Behavior:
 * - After successful account deletion, the user is signed out and redirected to the home page.
 * - Displays a loading state while the deletion process is in progress.
 */

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
