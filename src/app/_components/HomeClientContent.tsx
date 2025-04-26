"use client";

import StudygroupSidebar from "./StudygroupSidebar";
import Feed from "./feed";
import { useState, useCallback, useEffect } from "react";
import type { StudyGroup } from "./feed";
import { Button } from "@/components/ui/button";
import { UserSidebar } from "./UserSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HomeClientContent() {
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<StudyGroup[] | null>(null);
  const isMobile = useIsMobile();

  const handleGroupSelect = (group: StudyGroup) => {
    setSelectedGroup(group);
  };

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Debounced search function
  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults(null);
        return;
      }

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchTerm)}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search request failed:", error);
        setSearchResults(null);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <div className="flex-1 pt-4 px-4">
      <div className="flex flex-col max-w-[1500px] mx-auto">
        {/* Search section */}
        <div className="w-full md:w-[60%] lg:w-[50%] p-4 mb-8 md:mb-16 mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pr-10 py-6 px-4 h-12 rounded-md border-2 border-black dark:border-white outline-none"
            />
            <Button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <img src="/search.svg" alt="Search" className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="relative border-2 border-border rounded-xl overflow-hidden mb-8 md:mb-16">
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`absolute left-[-0.5%] top-1/2 -translate-y-1/2 z-20 border-none transition-all duration-300 bg-gray-50/80 hover:bg-gray-100/90 dark:bg-muted/90 dark:hover:bg-muted/70 h-24 w-8 hidden md:flex ${
                isSidebarOpen ? "translate-x-[17.5rem]" : "translate-x-0"
              }`}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-5 w-5 stroke-[2.5] text-primary/90 hover:text-accent transition-colors duration-300 dark:text-accent dark:hover:text-primary" />
              ) : (
                <ChevronRight className="h-5 w-5 stroke-[2.5] text-primary/90 hover:text-accent transition-colors duration-300 dark:text-accent dark:hover:text-primary" />
              )}
            </Button>
          )}

          {!isMobile && (
            <div
              className={`absolute left-[-18rem] top-0 h-full w-72 transition-transform duration-300 ease-in-out transform ${
                isSidebarOpen ? "translate-x-[18rem]" : "translate-x-0"
              } z-10 bg-background dark:bg-muted border-r border-border shadow-md hidden md:block`}
            >
              <UserSidebar
                refreshData={refreshData}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}

          <div
            className={`flex flex-col md:flex-row transition-all duration-300 ease-in-out ${
              isSidebarOpen && !isMobile
                ? "md:translate-x-[18rem]"
                : "translate-x-0"
            }`}
            style={{
              width: isSidebarOpen && !isMobile ? "calc(100% - 18rem)" : "100%",
            }}
          >
            <div className="flex-1 md:flex-[2] p-8 md:border-r border-border overflow-y-auto h-[60vh] md:h-[75vh]">
              {searchResults ? (
                searchResults.length > 0 ? (
                  searchResults.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => handleGroupSelect(group)}
                      className={`study-group-button w-full text-left p-3 md:p-4 rounded-lg transition-all duration-200 border-2 shadow-sm hover:border-primary dark:hover:border-[#3f557a] hover:shadow-md mb-4 ${
                        selectedGroup?.id === group.id
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
                        {group.studyDates?.[0] && (
                          <span>
                            {new Date(group.studyDates[0]).toLocaleDateString()}{" "}
                            at {group.studyTime}
                            {group.studyDates.length > 1
                              ? ` (+${
                                  group.studyDates.length - 1
                                } more sessions)`
                              : ""}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">
                    No results found.
                  </p>
                )
              ) : (
                <Feed
                  onGroupSelect={handleGroupSelect}
                  refreshTrigger={refreshTrigger}
                />
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto h-[60vh] md:h-[75vh]">
              <StudygroupSidebar
                selectedGroup={selectedGroup}
                refreshData={refreshData}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
