/**
 * StudyGroupToggle Component
 *
 * This component provides functionality for users to join or leave a study group.
 * It also checks if the user is the owner of the study group and displays appropriate buttons based on the user's status.
 *
 * Props:
 * - `postId` (string): The ID of the study group post.
 * - `refreshTrigger` (number, optional): A number used to trigger data refreshes (default: 0).
 * - `refreshData` (function, optional): A callback function to refresh data in the parent component.
 *
 * State:
 * - `isLoading` (boolean): Indicates whether a join/leave action is in progress.
 * - `isMember` (boolean): Indicates whether the user is a member of the study group.
 * - `isOwner` (boolean): Indicates whether the user is the owner of the study group.
 * - `isCheckingStatus` (boolean): Indicates whether the membership/ownership status is being checked.
 *
 * Functions:
 * - `checkStatus`: Checks if the user is the owner or a member of the study group.
 * - `handleJoin`: Handles the action of joining the study group.
 * - `handleLeave`: Handles the action of leaving the study group.
 *
 * Effects:
 * - Checks membership and ownership status when the component mounts, `postId` changes, or `refreshTrigger` changes.
 *
 * Components Used:
 * - `Button`: A reusable button component styled for the application.
 *
 * External Actions:
 * - `checkMembership`: Checks if the user is a member of the study group.
 * - `joinStudyGroup`: Adds the user as a member of the study group.
 * - `leaveStudyGroup`: Removes the user from the study group.
 * - `getUserOwnedStudyGroups`: Retrieves the list of study groups owned by the user.
 *
 * Notifications:
 * - Uses the `toast` component to display success or error messages for join/leave actions.
 */


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
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check membership status and ownership when component loads, postId changes, or refreshTrigger changes
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsCheckingStatus(true);

        // Check if user is the owner
        const ownedGroups = await getUserOwnedStudyGroups();
        if (ownedGroups.success && ownedGroups.groups) {
          const isUserOwner = ownedGroups.groups.some(
            (group) => group.id === postId
          );
          setIsOwner(isUserOwner);

          // Only check membership if not the owner
          if (!isUserOwner) {
            // Check if user is a member
            const membershipCheck = await checkMembership(postId);
            setIsMember(membershipCheck.isMember);
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
      } finally {
        setIsCheckingStatus(false);
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

  // Show a loading state while checking status
  if (isCheckingStatus) {
    return (
      <div>
        <Button disabled>Loading...</Button>
      </div>
    );
  }

  // If user is the owner, show owner button
  if (isOwner) {
    return (
      <div>
        <Button disabled>You own this study group</Button>
      </div>
    );
  }

  // If user is a member but not the owner, show leave button
  if (isMember) {
    return (
      <div>
        <Button
          onClick={handleLeave}
          disabled={isLoading}
          variant="destructive"
        >
          {isLoading ? "Leaving..." : "Leave Group"}
        </Button>
      </div>
    );
  }

  // If user is neither owner nor member, show join button
  return (
    <div>
      <Button onClick={handleJoin} disabled={isLoading}>
        {isLoading ? "Joining..." : "Join Group"}
      </Button>
    </div>
  );
}

export default StudyGroupToggle;
