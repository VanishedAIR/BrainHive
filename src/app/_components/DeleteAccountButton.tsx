"use client";

/**
 * DeleteAccountButton Component
 *
 * This component renders a button that allows users to delete their account. It includes a confirmation dialog to ensure the user confirms the action before proceeding.
 *
 * Props:
 * - None.
 *
 * State:
 * - `isDeleteDialogOpen` (boolean): Tracks whether the confirmation dialog is open.
 * - `isDeleting` (boolean): Indicates whether the account deletion process is in progress.
 *
 * Functions:
 * - `handleDeleteAccount`: Opens the confirmation dialog.
 * - `confirmDeleteAccount`: Deletes the user's account, signs them out, and displays success or error notifications.
 *
 * Components:
 * - `Button`: A styled button component for triggering the delete action.
 * - `AlertDialog`: A dialog component for confirming the delete action.
 * - `AlertDialogAction`: The button within the dialog to confirm deletion.
 * - `AlertDialogCancel`: The button within the dialog to cancel the action.
 * - `AlertDialogContent`: The wrapper for the dialog content.
 * - `AlertDialogDescription`: The description text within the dialog.
 * - `AlertDialogFooter`: The footer section of the dialog containing action buttons.
 * - `AlertDialogHeader`: The header section of the dialog.
 * - `AlertDialogTitle`: The title of the dialog.
 *
 * External Actions:
 * - `deleteCurrentUser`: Deletes the user's account from the database.
 * - `signOut`: Logs the user out using Clerk.
 * - `toast`: Displays success or error notifications to the user.
 * - `router.push`: Redirects the user to the home page after account deletion.
 *
 * Accessibility:
 * - The dialog includes descriptive text to ensure accessibility for screen readers.
 *
 * Behavior:
 * - Displays a confirmation dialog before deleting the account.
 * - Shows a success or error toast notification based on the result of the delete operation.
 * - Signs the user out and redirects them to the home page after successful deletion.
 * - Handles unexpected errors gracefully with error notifications.
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
