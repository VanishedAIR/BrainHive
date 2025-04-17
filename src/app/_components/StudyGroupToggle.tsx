import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  checkMembership,
  joinStudyGroup,
  leaveStudyGroup,
  getUserOwnedStudyGroups,
  getPostById,
} from "@/actions/postactions";
import { toast } from "@/components/ui/use-toast";

interface StudyGroupToggleProps {
  postId: string;
  refreshTrigger?: number;
  refreshData?: () => void;
}

function StudyGroupToggle({
  postId,
  refreshTrigger = 0,
  refreshData,
}: StudyGroupToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Check membership status and ownership when component loads, postId changes, or refreshTrigger changes
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check if user is a member
        const membershipCheck = await checkMembership(postId);
        setIsMember(membershipCheck.isMember);

        // Check if user is the owner
        const ownedGroups = await getUserOwnedStudyGroups();
        if (ownedGroups.success && ownedGroups.groups) {
          const isUserOwner = ownedGroups.groups.some(
            (group) => group.id === postId
          );
          setIsOwner(isUserOwner);
        }
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    checkStatus();
  }, [postId, refreshTrigger]); // Added refreshTrigger to dependency array

  const handleJoin = async () => {
    try {
      setIsLoading(true);

      // Try to join
      const result = await joinStudyGroup(postId);

      if (result.success) {
        toast({
          title: "Success",
          description: "You've joined the study group!",
        });
        setIsMember(true);
        // Refresh data if available
        if (refreshData) refreshData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to join study group",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLoading(true);

      // Try to leave
      const result = await leaveStudyGroup(postId);

      if (result.success) {
        toast({
          title: "Success",
          description: "You've left the study group",
        });
        setIsMember(false);
        // Refresh data if available
        if (refreshData) refreshData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to leave study group",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is the owner, don't show any toggle button
  if (isOwner) {
    return (
      <div>
        <Button disabled>You own this study group</Button>
      </div>
    );
  }

  return (
    <div>
      {isMember ? (
        <Button
          onClick={handleLeave}
          disabled={isLoading}
          variant="destructive"
        >
          {isLoading ? "Leaving..." : "Leave Group"}
        </Button>
      ) : (
        <Button onClick={handleJoin} disabled={isLoading}>
          {isLoading ? "Joining..." : "Join Group"}
        </Button>
      )}
    </div>
  );
}

export default StudyGroupToggle;
