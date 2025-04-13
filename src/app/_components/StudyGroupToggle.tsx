import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { joinStudyGroup } from "@/actions/postactions";
import { useToast } from "@/components/ui/use-toast";

interface StudyGroupToggleProps {
  postId: string;
}

function StudyGroupToggle({ postId }: StudyGroupToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      const result = await joinStudyGroup(postId);

      if (result.success) {
        toast({
          title: "Success",
          description: "You've joined the study group!",
        });
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

  return (
    <div>
      <Button onClick={handleJoin} disabled={isLoading}>
        {isLoading ? "Joining..." : "Join"}
      </Button>
    </div>
  );
}

export default StudyGroupToggle;
