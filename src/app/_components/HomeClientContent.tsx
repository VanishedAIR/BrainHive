"use client";

import StudygroupSidebar from "./StudygroupSidebar";
import Feed from "./feed";
import { useState, useCallback } from "react";
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(null); // reset to full feed
      return;
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
    const data = await res.json();
    setSearchResults(data);
  };

  return (
    <div className="flex-1 pt-4 px-4">
      <div className="flex flex-col max-w-[1500px] mx-auto">
        {/* Search section */}
        <div className="w-full md:w-[60%] lg:w-[50%] p-4 mb-8 md:mb-16 mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pr-10 py-6 px-4 h-12 rounded-md border-2 border-black dark:border-white outline-none"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <img src="/search.svg" alt="Search" className="w-6 h-6" />
            </Button>
          </form>
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
                    <div
                      key={group.id}
                      className="mb-6 p-4 rounded-lg border border-yellow-400 bg-yellow-50 cursor-pointer"
                      onClick={() => handleGroupSelect(group)}
                    >
                      <h2 className="font-bold text-lg text-yellow-800">
                        {group.studyGroupName}
                      </h2>
                      <p className="text-sm">
                        Subjects:{" "}
                        {Array.isArray(group.subjects)
                          ? group.subjects.join(", ")
                          : group.subjects}
                      </p>
                      <p className="text-sm">Created by: {group.author.username}</p>
                      <p className="text-sm">Members: {group.members.length}</p>
                      <p className="text-sm">
                        Study Sessions: {group.studyDates?.[0]} at {group.studyTime}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No results found.</p>
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
        </div>
      </div>
    </div>
  );
}

