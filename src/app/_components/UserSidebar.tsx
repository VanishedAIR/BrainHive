"use client";

/**
 * UserSidebar Component
 *
 * Displays the user sidebar in the Study Group Finder application.
 * Allows users to manage their profile, edit their username, and navigate between study groups.
 *
 * Props:
 * - `refreshData`: A callback function to refresh data in the parent component.
 * - `refreshTrigger`: A number that triggers a refresh when updated (default: 0).
 *
 * State:
 * - `user`: Stores the current user's information.
 * - `isEditing`: Boolean to track if the username is being edited.
 * - `newUsername`: Stores the new username input value.
 * - `error`: Stores error messages related to username updates.
 * - `studyGroups`: Stores the list of study groups the user has joined.
 * - `ownedStudyGroups`: Stores the list of study groups the user owns.
 * - `filteredJoinedGroups`: Stores the list of joined study groups excluding owned groups.
 *
 * Functions:
 * - `loadUserData`: Fetches and sets the current user's data.
 * - `loadStudyGroups`: Fetches and sets the user's joined and owned study groups.
 * - `handleEditUsername`: Enables editing of the username.
 * - `handleCancelEdit`: Cancels the username editing process.
 * - `handleSaveUsername`: Saves the updated username and refreshes data.
 * - `handleDeleteSuccess`: Refreshes study groups and parent data after a successful deletion.
 *
 * Effects:
 * - Loads user data and study groups on component mount or when `refreshTrigger` changes.
 * - Filters joined study groups to exclude owned groups when `studyGroups` or `ownedStudyGroups` change.
 */

import { getCurrentUser, updateUsername } from "@/actions/useractions";
import {
  getUserStudyGroups,
  getUserOwnedStudyGroups,
} from "@/actions/postactions";
import DeleteAccountButton from "./DeleteAccountButton";
import DeleteStudyGroupButton from "./DeleteStudyGroupButton";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

interface UserSidebarProps {
  refreshData: () => void;
  refreshTrigger?: number;
}

export function UserSidebar({
  refreshData,
  refreshTrigger = 0,
}: UserSidebarProps) {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [ownedStudyGroups, setOwnedStudyGroups] = useState<StudyGroup[]>([]);
  const [filteredJoinedGroups, setFilteredJoinedGroups] = useState<
    StudyGroup[]
  >([]);
  const router = useRouter();

  // Function to load user data
  const loadUserData = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };

  // Function to load study groups
  const loadStudyGroups = async () => {
    // Get joined study groups
    const result = await getUserStudyGroups();
    if (result.success) {
      setStudyGroups(result.groups);
    }

    // Get owned study groups
    const ownedResult = await getUserOwnedStudyGroups();
    if (ownedResult.success) {
      setOwnedStudyGroups(ownedResult.groups);
    }
  };

  // Load data initially and when refreshTrigger changes
  useEffect(() => {
    loadUserData();
    loadStudyGroups();
  }, [refreshTrigger]); // Add refreshTrigger to dependency array

  // Filter out owned study groups from joined study groups
  useEffect(() => {
    if (studyGroups.length > 0 && ownedStudyGroups.length > 0) {
      const ownedGroupIds = new Set(ownedStudyGroups.map((group) => group.id));

      const filteredGroups = studyGroups.filter(
        (group) => !ownedGroupIds.has(group.id)
      );
      setFilteredJoinedGroups(filteredGroups);
    } else {
      setFilteredJoinedGroups(studyGroups);
    }
  }, [studyGroups, ownedStudyGroups]);

  const handleEditUsername = () => {
    setNewUsername(user.username);
    setIsEditing(true);
    setError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    const result = await updateUsername(newUsername);

    if (result.success) {
      setUser({ ...user, username: newUsername });
      setIsEditing(false);
      router.refresh();
      refreshData(); // Call refreshData to trigger a refresh in the parent component
    } else {
      setError(result.message || "Failed to update username");
    }
  };

  const handleDeleteSuccess = () => {
    loadStudyGroups();
    refreshData();
  };

  if (!user) {
    return (
      <div className="h-full p-4">
        <h2 className="text-foreground/80">User Information</h2>
        <p className="text-muted-foreground">
          Please sign in to view your information
        </p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary dark:text-accent">
          Profile
        </h2>

        {/* User profile */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.username}
                className="w-10 h-10 rounded-full ring-2 ring-primary/20 dark:ring-accent/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center text-primary dark:text-accent font-semibold ring-2 ring-primary/20 dark:ring-accent/20">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="font-semibold text-foreground/90 dark:text-foreground/90">
              {user.name || user.username}
            </h3>
          </div>

          {/* Username edit section */}
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="New username"
                    className="flex-1 min-w-[110px] px-2 py-1 text-sm border rounded bg-background dark:bg-muted focus:border-primary dark:focus:border-accent outline-none"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveUsername}
                    className="hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary dark:hover:text-accent"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEditUsername}
                  className="hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary dark:hover:text-accent"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Account Management */}
        <div className="space-y-2">
          <h4 className="font-semibold text-primary/90 dark:text-accent/90">
            Account Management
          </h4>
          <DeleteAccountButton />
        </div>

        {/* Owner's Study Groups */}
        <div className="space-y-3">
          <h4 className="font-semibold text-primary/90 dark:text-accent/90">
            Your Hives
          </h4>
          {ownedStudyGroups.length > 0 ? (
            <ul className="space-y-3">
              {ownedStudyGroups.map((group) => (
                <li
                  key={group.id}
                  className="space-y-3 bg-primary/5 dark:bg-accent/5 p-4 rounded-lg border border-primary/10 dark:border-accent/10 hover:border-primary/20 dark:hover:border-accent/20 transition-colors duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-base text-foreground/90">
                        {group.studyGroupName}
                      </strong>
                      <DeleteStudyGroupButton
                        groupId={group.id}
                        onDeleteSuccess={handleDeleteSuccess}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Subjects:</span>{" "}
                        {Array.isArray(group.subjects)
                          ? group.subjects.join(", ")
                          : group.subjects}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Time:</span>{" "}
                        {group.studyTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Dates:</span>{" "}
                        {group.studyDates.join(", ")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven't created any study groups yet.
            </p>
          )}
        </div>

        {/* Joined Study Groups */}
        <div className="space-y-3">
          <h4 className="font-semibold text-primary dark:text-accent">
            Joined Hives
          </h4>
          {filteredJoinedGroups.length > 0 ? (
            <ul className="space-y-3">
              {filteredJoinedGroups.map((group) => (
                <li
                  key={group.id}
                  className="space-y-3 bg-primary/5 dark:bg-accent/5 p-4 rounded-lg border border-primary/10 dark:border-accent/10 hover:border-primary/20 dark:hover:border-accent/20 transition-colors duration-200"
                >
                  <div className="space-y-2">
                    <strong className="text-base text-foreground/90">
                      {group.studyGroupName}
                    </strong>
                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Subjects:</span>{" "}
                        {Array.isArray(group.subjects)
                          ? group.subjects.join(", ")
                          : group.subjects}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Time:</span>{" "}
                        {group.studyTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Dates:</span>{" "}
                        {group.studyDates.join(", ")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven't joined any study groups yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
