"use client";

/**
 * DeleteStudyGroupButton Component
 *
 * This component renders a button to delete a study group. It includes a confirmation dialog to ensure the user confirms the action before proceeding.
 *
 * Props:
 * - `groupId` (string): The ID of the study group to be deleted.
 * - `onDeleteSuccess` (function, optional): A callback function triggered after the study group is successfully deleted.
 *
 * State:
 * - `isDeleteDialogOpen` (boolean): Tracks whether the confirmation dialog is open.
 *
 * Functions:
 * - `handleDeleteGroup`: Opens the confirmation dialog.
 * - `confirmDeleteGroup`: Deletes the study group, triggers the success callback, and displays a toast notification.
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
 * - `Trash`: An icon used for the delete button.
 *
 * External Actions:
 * - `deletePost`: Deletes the study group from the server.
 * - `toast`: Displays success or error notifications to the user.
 *
 * Accessibility:
 * - The dialog includes descriptive text to ensure accessibility for screen readers.
 *
 * Behavior:
 * - Displays a confirmation dialog before deleting the study group.
 * - Shows a success or error toast notification based on the result of the delete operation.
 * - Closes the dialog after the action is completed.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/actions/postactions";
import { toast } from "@/components/ui/use-toast";
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
import { Trash } from "lucide-react";

interface DeleteStudyGroupButtonProps {
  groupId: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteStudyGroupButton({
  groupId,
  onDeleteSuccess,
}: DeleteStudyGroupButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteGroup = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = async () => {
    const result = await deletePost(groupId);

    if (result.success) {
      toast({
        title: "Success",
        description: "Study group deleted successfully",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to delete study group",
        variant: "destructive",
      });
    }

    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteGroup();
        }}
      >
        <Trash className="w-4 h-4" />
      </Button>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              study group and remove all members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGroup}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
