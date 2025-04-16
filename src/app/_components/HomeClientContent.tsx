"use client";
import StudygroupSidebar from "./StudygroupSidebar";
import Feed from "./feed";
import { useState, useCallback } from "react";
import type { StudyGroup } from "./feed";
import { Button } from "@/components/ui/button";
import { UserSidebar } from "./UserSidebar";

export default function HomeClientContent() {
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGroupSelect = (group: StudyGroup) => {
    setSelectedGroup(group);
  };

  // Function to trigger a refresh of the data
  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="flex-1 pt-4 px-4">
      <div className="flex flex-col max-w-[1400px] mx-auto">
        <div className="w-full md:w-[60%] lg:w-[50%] p-4 mb-8 md:mb-16 mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pr-10 py-6 px-4 h-12 rounded-md border-2 border-black dark:border-white outline-none"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <img src="/search.svg" alt="Search" className="w-6 h-6" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 border-2 border-border rounded-xl mb-8 md:mb-16">
          <div className="flex border-t border-border flex-1">
            <UserSidebar
              refreshData={refreshData}
              refreshTrigger={refreshTrigger}
            />
          </div>
          <div className="flex-1 p-4 border-r border-border overflow-y-auto h-[60vh] lg:h-[75vh]">
            <Feed
              onGroupSelect={handleGroupSelect}
              refreshTrigger={refreshTrigger}
            />
          </div>
          <div className="flex-1 p-4 overflow-y-auto h-[60vh] lg:h-[75vh]">
            <StudygroupSidebar
              selectedGroup={selectedGroup}
              refreshData={refreshData}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
