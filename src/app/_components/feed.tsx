"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/actions/postactions";
import { useIsMobile } from "@/hooks/use-mobile";

// define the interface for the post

interface StudyGroup {
  id: string;
  studyGroupName: string;
  studyGroupBio?: string | null;
  subjects: string[] | string;
  when2MeetLink?: string | null;
  studyDates: string[];
  studyTime: string;
  location: string | null;
  status: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    name: string | null;
  };
  members: Array<{
    id: string;
    userId: string;
    username: string;
    postId: string;
    joinedAt: Date;
  }>;
}

interface FeedProps {
  onGroupSelect: (group: StudyGroup) => void;
  refreshTrigger?: number;
}

export default function Feed({ onGroupSelect, refreshTrigger = 0 }: FeedProps) {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);

  // Function to get the closest upcoming date
  const getClosestDate = (dates: string[]): string | null => {
    if (!dates.length) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureOrTodayDates = dates
      .map((date) => new Date(date))
      .filter((date) => {
        const dateToCompare = new Date(date);
        dateToCompare.setHours(0, 0, 0, 0);
        return dateToCompare >= today;
      });

    if (futureOrTodayDates.length === 0) {
      // If no upcoming dates, return the most recent past date
      return dates.sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      )[0];
    }

    return futureOrTodayDates
      .sort((a, b) => a.getTime() - b.getTime())[0]
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    let mounted = true;

    async function fetchStudyGroups() {
      const groups = await getAllPosts();
      if (mounted) {
        setStudyGroups(groups);
        if (groups.length > 0 && !selectedGroupId) {
          setSelectedGroupId(groups[0].id);
          onGroupSelect(groups[0]);
        }
      }
    }

    fetchStudyGroups();

    return () => {
      mounted = false;
    };
  }, [selectedGroupId, onGroupSelect, refreshTrigger]);

  const handleGroupClick = (group: StudyGroup) => {
    if (selectedGroupId !== group.id) {
      setSelectedGroupId(group.id);
      onGroupSelect(group);
      if (isMobile) {
        setShowAll(false); // Collapse back to 3 items after selection on mobile
      }
    }
  };

  const displayedGroups =
    isMobile && !showAll ? studyGroups.slice(0, 3) : studyGroups;

  return (
    <div className="w-full space-y-3 md:space-y-4">
      {displayedGroups.map((group) => (
        <button
          key={group.id}
          onClick={() => handleGroupClick(group)}
          className={`study-group-button w-full text-left p-3 md:p-4 rounded-lg transition-all duration-200 border-2 shadow-sm hover:border-primary dark:hover:border-[#3f557a] hover:shadow-md ${
            selectedGroupId === group.id
              ? "border-primary bg-primary/5 dark:border-[#3f557a] dark:bg-[rgba(41,68,110,0.7)]/50"
              : ""
          }`}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {group.studyGroupName[0].toUpperCase()}
            </div>
            <h3 className="text-xl font-semibold text-primary">
              {group.studyGroupName}
            </h3>
          </div>
          <p className="text-gray-500 mt-2">
            Subjects:{" "}
            {Array.isArray(group.subjects)
              ? group.subjects.join(", ")
              : group.subjects}
          </p>
          <p className="text-sm text-gray-400">
            Created by: {group.author.username}
          </p>
          <p className="text-sm text-gray-400">
            Members: {group.members.length}
          </p>
          <div className="text-sm text-gray-400">
            Next Session:{" "}
            {getClosestDate(group.studyDates) && (
              <span>
                {new Date(
                  getClosestDate(group.studyDates)!
                ).toLocaleDateString()}{" "}
                at {group.studyTime}
                {group.studyDates.length > 1
                  ? ` (+${group.studyDates.length - 1} more sessions)`
                  : ""}
              </span>
            )}
          </div>
        </button>
      ))}

      {/* Show more/less button on mobile */}
      {isMobile && studyGroups.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center py-2 text-white hover:text-accent dark:text-white dark:hover:text-primary transition-colors"
        >
          {showAll ? "Show Less" : `Show ${studyGroups.length - 3} More`}
        </button>
      )}
    </div>
  );
}

export type { StudyGroup };
