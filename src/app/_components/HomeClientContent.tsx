"use client";
import StudygroupSidebar from "./StudygroupSidebar";
import Feed from "./feed";
import { useState, useCallback } from "react";
import type { StudyGroup } from "./feed";
import { Button } from "@/components/ui/button";
import { UserSidebar } from "./UserSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomeClientContent() {
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGroupSelect = (group: StudyGroup) => {
    setSelectedGroup(group);
  };

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="flex-1 pt-4 px-4">
      <div className="flex flex-col max-w-[1500px] mx-auto">
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

        <div className="flex flex-col lg:flex-row relative border-2 border-border rounded-xl overflow-hidden mb-8 md:mb-16">
          {/* Toggle Button - Always visible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`absolute left-[-0.5%] top-1/2 -translate-y-1/2 z-20 border-none transition-all duration-300 bg-gray-50/80 hover:bg-gray-100/90 dark:bg-muted/90 dark:hover:bg-muted/70 h-24 w-8 ${
              isSidebarOpen ? "translate-x-[17.5rem]" : "translate-x-0"
            }`}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5 stroke-[2.5] text-primary/90 hover:text-accent transition-colors duration-300 dark:text-accent dark:hover:text-primary" />
            ) : (
              <ChevronRight className="h-5 w-5 stroke-[2.5] text-primary/90 hover:text-accent transition-colors duration-300 dark:text-accent dark:hover:text-primary" />
            )}
          </Button>

          {/* Main Content Container */}
          <div
            className="flex transition-all duration-300 ease-in-out"
            style={{
              transform: isSidebarOpen ? "translateX(18rem)" : "translateX(0)",
              width: isSidebarOpen ? "calc(100% - 18rem)" : "100%",
            }}
          >
            <div className="flex-[2] p-8 border-r border-border overflow-y-auto h-[60vh] lg:h-[75vh]">
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

          {/* User Sidebar - Absolutely positioned */}
          <div
            className={`absolute left-[-18rem] top-0 h-full w-72 transition-transform duration-300 ease-in-out transform ${
              isSidebarOpen ? "translate-x-[18rem]" : "translate-x-0"
            } z-10 bg-background dark:bg-muted border-r border-border shadow-md`}
          >
            <UserSidebar
              refreshData={refreshData}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
