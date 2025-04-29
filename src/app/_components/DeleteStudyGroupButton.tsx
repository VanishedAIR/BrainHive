"use client";

/**
 * DeleteStudyGroupButton Component
 *
 * This component renders a button for deleting a study group. It includes a confirmation dialog to ensure the user confirms the action.
 *
 * Props:
 * - `groupId` (string): The ID of the study group to delete.
 * - `onDeleteSuccess` (function, optional): Callback triggered after successful deletion.
 *
 * State:
 * - `isDeleteDialogOpen` (boolean): Tracks whether the confirmation dialog is open.
 *
 * Functions:
 * - `handleDeleteGroup`: Opens the confirmation dialog.
 * - `confirmDeleteGroup`: Deletes the study group, triggers the success callback, and shows a toast notification.
 *
 * Components:
 * - `Button`: A styled button component.
 * - `AlertDialog`: A dialog for confirming the delete action.
 * - `Trash`: An icon used for the delete button.
 *
 * External Actions:
 * - `deletePost`: Deletes the study group from the server.
 * - `toast`: Displays success or error messages.
 *
 * Accessibility:
 * - The dialog includes descriptive text for screen readers.
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
