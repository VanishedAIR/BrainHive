"use client";

import { getCurrentUser, updateUsername } from "@/actions/useractions";
import {
  getUserStudyGroups,
  getUserOwnedStudyGroups,
} from "@/actions/postactions";
import DeleteAccountButton from "./DeleteAccountButton";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StudyGroup {
  id: string;
  studyGroupName: string;
  subjects: string;
  image: string | null;
  author?: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
}

export function UserSidebar() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [ownedStudyGroups, setOwnedStudyGroups] = useState<StudyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }

    async function loadStudyGroups() {
      setIsLoading(true);

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

      setIsLoading(false);
    }

    loadUser();
    loadStudyGroups();
  }, []);

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
    } else {
      setError(result.message || "Failed to update username");
    }
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
        {isLoading ? (
          <p>Loading study groups...</p>
        ) : ownedStudyGroups.length > 0 ? (
          <ul>
            {ownedStudyGroups.map((group) => (
              <li
                key={group.id}
                onClick={() => router.push(`/studygroup/${group.id}`)}
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
          <p>You haven't created any study groups yet.</p>
        )}
      </div>

        
    </div>
  );
}
