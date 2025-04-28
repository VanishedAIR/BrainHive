"use client";

/**
 * DeleteStudyGroupButton Component
 *
 * This component renders a button that allows users to delete a study group.
 * It includes a confirmation dialog to ensure the user wants to proceed with the deletion.
 *
 * Props:
 * - `groupId` (string): The ID of the study group to be deleted.
 * - `onDeleteSuccess` (function, optional): A callback function triggered after a successful deletion.
 *
 * State:
 * - `isDeleteDialogOpen` (boolean): Indicates whether the delete confirmation dialog is open.
 *
 * Functions:
 * - `handleDeleteGroup`: Opens the delete confirmation dialog.
 * - `confirmDeleteGroup`: Confirms the deletion of the study group, triggers the `onDeleteSuccess` callback, and displays a success or error toast.
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
 * - `Trash`: An icon from the `lucide-react` library used for the delete button.
 *
 * External Actions:
 * - `deletePost`: Deletes the study group from the server.
 * - `toast`: Displays success or error messages to the user.
 *
 * Accessibility:
 * - The dialog includes descriptive text to ensure accessibility for screen readers.
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
