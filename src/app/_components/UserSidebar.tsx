"use client";

import { getCurrentUser, updateUsername } from "@/actions/useractions";
import {
  getUserStudyGroups,
  getUserOwnedStudyGroups,
  deletePost,
} from "@/actions/postactions";
import DeleteAccountButton from "./DeleteAccountButton";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StudyGroup {
  id: string;
  studyGroupName: string;
  subjects: string | string[];
  image: string | null;

  author?: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
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
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleGroupClick = (groupId: string) => {
    router.push(`/studygroup/${groupId}`);
  };

  const handleDeleteGroup = async (groupId: string) => {
    setDeletingGroupId(groupId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (!deletingGroupId) return;

    const result = await deletePost(deletingGroupId);

    if (result.success) {
      toast({
        title: "Success",
        description: "Study group deleted successfully",
      });

      // Refresh the list of owned study groups
      loadStudyGroups();
      refreshData();
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to delete study group",
        variant: "destructive",
      });
    }

    setIsDeleteDialogOpen(false);
    setDeletingGroupId(null);
  };

  if (!user) {
    return (
      <div className="border-r p-4">
        <h2>User Information</h2>
        <p>Please sign in to view your information</p>
      </div>
    );
  }

  return (
    <div className="border-r p-4">
      <h2>Profile</h2>

      {/* User profile */}
      <div>
        {user.image ? (
          <img src={user.image} alt={user.username} width={40} height={40} />
        ) : (
          <div>{user.username.charAt(0).toUpperCase()}</div>
        )}
        <h3>{user.name || user.username}</h3>

        {/* Username edit section */}
        {isEditing ? (
          <div>
            <div>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New username"
                autoFocus
              />
              <Button variant="outline" onClick={handleSaveUsername}>
                <Check size={16} />
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X size={16} />
              </Button>
            </div>
            {error && <p>{error}</p>}
          </div>
        ) : (
          <div>
            <p>@{user.username}</p>
            <Button variant="outline" onClick={handleEditUsername}>
              <Pencil size={12} />
            </Button>
          </div>
        )}
      </div>

      {/* Account Management */}
      <div>
        <h4>Account Management</h4>
        <DeleteAccountButton />
      </div>

      {/* Owner's Study Groups */}
      <div>
        <h4>Your Study Groups</h4>
        {ownedStudyGroups.length > 0 ? (
          <ul>
            {ownedStudyGroups.map((group) => (
              <li
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <strong>{group.studyGroupName}</strong>
                  <p>{group.subjects}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group.id);
                  }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't created any study groups yet.</p>
        )}
      </div>

      {/* Joined Study Groups */}
      <div>
        <h4>Joined Study Groups</h4>
        {filteredJoinedGroups.length > 0 ? (
          <ul>
            {filteredJoinedGroups.map((group) => (
              <li
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <strong>{group.studyGroupName}</strong>
                  <p>{group.subjects}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't joined any study groups yet.</p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              study group and remove all members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGroup}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
