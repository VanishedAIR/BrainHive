import type { StudyGroup } from "./feed";
import { Button } from "@/components/ui/button";
import StudyGroupToggle from "./StudyGroupToggle";
import { useEffect, useState } from "react";
import { getPostById } from "@/actions/postactions";

interface StudygroupSidebarProps {
  selectedGroup: StudyGroup | null;
  refreshTrigger?: number;
  refreshData?: () => void;
}

export default function StudygroupSidebar({
  selectedGroup,
  refreshTrigger = 0,
  refreshData,
}: StudygroupSidebarProps) {
  const [currentGroup, setCurrentGroup] = useState<StudyGroup | null>(
    selectedGroup
  );

  // Update currentGroup when selectedGroup changes
  useEffect(() => {
    setCurrentGroup(selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    if (!currentGroup?.id) return;

    let timeoutId: NodeJS.Timeout | undefined;
    const lastUpdate = Date.now();

    // Skip if last update was less than 1 second ago
    if (Date.now() - lastUpdate < 1000) {
      return;
    }

    timeoutId = setTimeout(async () => {
      try {
        const response = await getPostById(currentGroup.id);
        if (response.success && response.post) {
          setCurrentGroup(response.post as unknown as StudyGroup);
        }
      } catch (error) {
        console.error("Error refreshing study group data:", error);
      }
    }, 500);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [refreshTrigger, currentGroup?.id]);

  if (!currentGroup) {
    return (
      <div className="flex-1 p-4 mx-auto my-auto text-center">
        <p className="text-gray-500">Select a study group to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-6 md:space-y-8">
      <div className="flex items-center justify-center mt-2 md:mt-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary text-center">
          {currentGroup.studyGroupName}
        </h2>
      </div>

      {currentGroup.studyGroupBio && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">About</h3>
          <p className="text-gray-600">{currentGroup.studyGroupBio}</p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Subjects</h3>
        <p className="text-gray-600">
          {Array.isArray(currentGroup.subjects)
            ? currentGroup.subjects.join(", ")
            : currentGroup.subjects}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Study Sessions</h3>
        <div className="text-gray-600">
          {currentGroup.studyDates.map((date, index) => (
            <div key={index} className="mb-1">
              {new Date(date).toLocaleDateString()} at {currentGroup.studyTime}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Created</h3>
        <p className="text-gray-600">
          {new Date(currentGroup.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Created by</h3>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            {currentGroup.author.username[0].toUpperCase()}
          </div>
          <span className="text-gray-600">@{currentGroup.author.username}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Members ({currentGroup.members.length})
        </h3>
        <div className="space-y-1">
          {currentGroup.members.map((member) => (
            <div key={member.id} className="text-gray-600">
              @{member.username}
            </div>
          ))}
        </div>
      </div>

      {currentGroup.when2MeetLink && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">When2Meet Link</h3>
          <Button variant="outline" asChild className="w-full">
            <a
              href={currentGroup.when2MeetLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Schedule
            </a>
          </Button>
        </div>
      )}

      {currentGroup.location && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Location</h3>
          <p className="text-gray-600">
            {currentGroup.location.match(/^https?:\/\//) ? (
              <a
                href={currentGroup.location}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Online Meeting Link
              </a>
            ) : (
              currentGroup.location
            )}
          </p>
        </div>
      )}

      <div className="relative bottom-[-3%] left-[50%] translate-x-[-50%] w-fit">
        <StudyGroupToggle
          postId={currentGroup.id}
          refreshTrigger={refreshTrigger}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
}
