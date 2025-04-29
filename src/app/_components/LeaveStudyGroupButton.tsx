"use client";

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
