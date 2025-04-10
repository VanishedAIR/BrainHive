"use client";
import StudygroupSidebar from "./StudygroupSidebar";
import Feed from "./feed";
import { useState } from "react";
import type { StudyGroup } from "./feed";

export default function HomeClientContent() {
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  const handleGroupSelect = (group: StudyGroup) => {
    setSelectedGroup(group);
  };

  return (
    <div className="flex-1 pt-4">
      <div className="flex w-[75%] flex-col mx-auto">
        <div className="w-[50%] p-4 mb-16 mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pr-10 py-6 px-4 h-12 rounded-md border-2 border-black dark:border-white outline-none"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <img src="/search.svg" alt="Search" className="w-full h-full" />
            </button>
          </div>
        </div>
        <div className="flex gap-4 border-2 border-border rounded-xl">
          <div className="flex-1 p-4 border-r border-border">
            <Feed onGroupSelect={handleGroupSelect} />
          </div>
          <StudygroupSidebar selectedGroup={selectedGroup} />
        </div>
      </div>
    </div>
  );
}
