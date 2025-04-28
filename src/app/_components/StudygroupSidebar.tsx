/**
 * StudygroupSidebar Component
 *
 * This component displays detailed information about a selected study group, including its name, bio, subjects, 
 * study sessions, creator, members, and additional links like When2Meet or location.
 * It also allows users to join or leave the study group using the `StudyGroupToggle` component.
 *
 * Props:
 * - `selectedGroup` (StudyGroup | null): The currently selected study group or `null` if no group is selected.
 * - `refreshTrigger` (number, optional): A number used to trigger data refreshes (default: 0).
 * - `refreshData` (function, optional): A callback function to refresh data in the parent component.
 *
 * State:
 * - `currentGroup` (StudyGroup | null): The current study group being displayed.
 * - `showAllMembers` (boolean): Indicates whether all members of the study group are displayed.
 *
 * Functions:
 * - `updateGroup`: Fetches the latest details of the selected study group and updates the `currentGroup` state.
 *
 * Effects:
 * - Updates the `currentGroup` state when the `selectedGroup` or `refreshTrigger` changes.
 *
 * Components Used:
 * - `Button`: A reusable button component styled for the application.
 * - `StudyGroupToggle`: A component that allows users to join or leave the study group.
 *
 * External Actions:
 * - `getPostById`: Fetches the details of a study group by its ID.
 *
 * Conditional Rendering:
 * - Displays a placeholder message if no study group is selected.
 * - Displays truncated or full member lists based on the `showAllMembers` state.
 *
 * Links:
 * - Renders clickable links for When2Meet and location if provided.
 */

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
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Update currentGroup when selectedGroup changes or when refreshTrigger changes
  useEffect(() => {
    const updateGroup = async () => {
      if (selectedGroup?.id) {
        const response = await getPostById(selectedGroup.id);
        if (response.success && response.post) {
          setCurrentGroup(response.post as unknown as StudyGroup);
        }
      } else {
        setCurrentGroup(selectedGroup);
      }
    };
    updateGroup();
  }, [selectedGroup, refreshTrigger]);

  const displayedMembers = showAllMembers
    ? currentGroup?.members
    : currentGroup?.members.slice(0, 5);

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
          {displayedMembers?.map((member) => (
            <div key={member.id} className="text-gray-600">
              @{member.username}
            </div>
          ))}
          {currentGroup.members.length > 5 && !showAllMembers && (
            <button
              onClick={() => setShowAllMembers(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              + {currentGroup.members.length - 5} more members
            </button>
          )}
          {showAllMembers && (
            <button
              onClick={() => setShowAllMembers(false)}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Show less
            </button>
          )}
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
