import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  checkMembership,
  joinStudyGroup,
  leaveStudyGroup,
} from "@/actions/postactions";
import { toast } from "@/components/ui/use-toast";

interface StudyGroupToggleProps {
  postId: string;
}

function StudyGroupToggle({ postId }: StudyGroupToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);

  // Check membership status when component loads
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const membershipCheck = await checkMembership(postId);
        setIsMember(membershipCheck.isMember);
      } catch (error) {
        console.error("Error checking membership status:", error);
      }
    };

    checkStatus();
  }, [postId]);

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
