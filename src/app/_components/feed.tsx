"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/actions/postactions";

// define the interface for the post

interface StudyGroup {
  id: string;
  studyGroupName: string;
  subjects: string;
  when2MeetLink: string;
  image: string | null;
  studyDate: Date;
  isPublic: boolean;
  status: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
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
}

export default function Feed({ onGroupSelect }: FeedProps) {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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
  }, []); // Remove onGroupSelect from dependencies

  const handleGroupClick = (group: StudyGroup) => {
    if (selectedGroupId !== group.id) {
      setSelectedGroupId(group.id);
      onGroupSelect(group);
    }
  };

  return (
    <div className="w-full space-y-4">
      {studyGroups.map((group) => (
        <button
          key={group.id}
          onClick={() => handleGroupClick(group)}
          className={`study-group-button w-full text-left p-4 rounded-lg transition-all duration-200 border-2 shadow-sm hover:border-primary dark:hover:border-[#3f557a] hover:shadow-md ${
            selectedGroupId === group.id
              ? "border-primary bg-primary/5 dark:border-[#3f557a] dark:bg-[rgba(41,68,110,0.7)]/50"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            {group.image ? (
              <img
                src={group.image}
                alt={group.studyGroupName}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {group.studyGroupName[0].toUpperCase()}
              </div>
            )}
            <h3 className="text-xl font-semibold text-primary">
              {group.studyGroupName}
            </h3>
          </div>
          <p className="text-gray-500 mt-2">Subjects: {group.subjects}</p>
          <p className="text-sm text-gray-400">
            Created by: {group.author.username}
          </p>
          <p className="text-sm text-gray-400">
            Members: {group.members.length}
          </p>
          <p className="text-sm text-gray-400">
            Study Date(s): {new Date(group.studyDate).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  );
}

export type { StudyGroup };
