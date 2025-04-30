/**
 * StudyGroupToggle Component
 *
 * This component provides functionality for users to join or leave a study group. It also checks if the user is the owner of the study group and adjusts the UI accordingly.
 *
 * Props:
 * - `postId` (string): The ID of the study group.
 * - `refreshTrigger` (number, optional): A value to trigger data refreshes (default: 0).
 * - `refreshData` (function, optional): A callback function to refresh the study group data.
 *
 * State:
 * - `isLoading` (boolean): Indicates whether a join or leave action is in progress.
 * - `isMember` (boolean): Tracks whether the user is a member of the study group.
 * - `isOwner` (boolean): Tracks whether the user is the owner of the study group.
 * - `isCheckingStatus` (boolean): Indicates whether the component is checking the user's membership and ownership status.
 *
 * Functions:
 * - `checkStatus`: Checks if the user is the owner or a member of the study group.
 * - `handleJoin`: Handles the action for joining the study group.
 * - `handleLeave`: Handles the action for leaving the study group.
 *
 * Components:
 * - `Button`: A styled button component for actions like joining or leaving the study group.
 *
 * Behavior:
 * - Displays a loading state while checking the user's membership and ownership status.
 * - Shows a disabled button if the user is the owner of the study group.
 * - Displays a "Join Group" button if the user is not a member or owner.
 * - Displays a "Leave Group" button if the user is a member but not the owner.
 * - Refreshes the study group data after a successful join or leave action if `refreshData` is provided.
 *
 * External Actions:
 * - `checkMembership`: Checks if the user is a member of the study group.
 * - `joinStudyGroup`: Adds the user to the study group.
 * - `leaveStudyGroup`: Removes the user from the study group.
 * - `getUserOwnedStudyGroups`: Retrieves the list of study groups owned by the user.
 * - `toast`: Displays success or error notifications to the user.
 *
 * Styling:
 * - Uses Tailwind CSS for consistent styling and responsive design.
 *
 * Accessibility:
 * - Buttons include proper labels and states for screen readers.
 * - Ensures proper feedback for loading and error states.
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
