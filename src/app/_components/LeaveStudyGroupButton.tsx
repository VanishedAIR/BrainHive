"use client";

/**
 * LeaveStudyGroupButton Component
 *
 * This component renders a button that allows users to leave a study group. It includes a confirmation dialog to ensure the user confirms the action before proceeding.
 *
 * Props:
 * - `groupId` (string): The ID of the study group to leave.
 * - `onLeaveSuccess` (function, optional): A callback function triggered after successfully leaving the study group.
 *
 * State:
 * - `isLeaveDialogOpen` (boolean): Tracks whether the confirmation dialog is open.
 *
 * Functions:
 * - `handleLeaveGroup`: Opens the confirmation dialog.
 * - `confirmLeaveGroup`: Executes the action to leave the study group, triggers the success callback, and displays a toast notification.
 *
 * Components:
 * - `Button`: A styled button component for triggering the leave action.
 * - `AlertDialog`: A dialog component for confirming the leave action.
 * - `AlertDialogAction`: The button within the dialog to confirm leaving the group.
 * - `AlertDialogCancel`: The button within the dialog to cancel the action.
 * - `AlertDialogContent`: The wrapper for the dialog content.
 * - `AlertDialogDescription`: The description text within the dialog.
 * - `AlertDialogFooter`: The footer section of the dialog containing action buttons.
 * - `AlertDialogHeader`: The header section of the dialog.
 * - `AlertDialogTitle`: The title of the dialog.
 * - `BookX`: An icon used for the leave button.
 *
 * External Actions:
 * - `leaveStudyGroup`: Removes the user from the study group on the server.
 * - `toast`: Displays success or error notifications to the user.
 *
 * Accessibility:
 * - The dialog includes descriptive text to ensure accessibility for screen readers.
 *
 * Behavior:
 * - Displays a confirmation dialog before leaving the study group.
 * - Shows a success or error toast notification based on the result of the leave operation.
 * - Closes the dialog after the action is completed.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { leaveStudyGroup } from "@/actions/postactions";
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
import { BookX, Trash } from "lucide-react";

interface LeaveStudyGroupButtonProps {
  groupId: string;
  onLeaveSuccess?: () => void;
}

export default function LeaveStudyGroupButton({
  groupId,
  onLeaveSuccess,
}: LeaveStudyGroupButtonProps) {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const handleLeaveGroup = () => {
    setIsLeaveDialogOpen(true);
  };

  const confirmLeaveGroup = async () => {
    const result = await leaveStudyGroup(groupId);

    if (result.success) {
      toast({
        title: "Success",
        description: "Study group deleted successfully",
      });

      if (onLeaveSuccess) {
        onLeaveSuccess();
      }
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to delete study group",
        variant: "destructive",
      });
    }

    setIsLeaveDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={(e) => {
          e.stopPropagation();
          handleLeaveGroup();
        }}
      >
        <BookX className="w-4 h-4" />
      </Button>

      <AlertDialog
        open={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove you from the study
              group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeaveGroup}>
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
