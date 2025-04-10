"use client";

import { getCurrentUser, updateUsername } from "@/actions/useractions";
import DeleteAccountButton from "./DeleteAccountButton";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function UserSidebar() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }

    loadUser();
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
      <div className="border-r border-border p-4">
        <h2 className="font-bold mb-2">User Information</h2>
        <p>Please sign in to view your information</p>
      </div>
    );
  }

  return (
    <div className="border-r border-border p-4">
      <h2 className="font-bold mb-2">Profile</h2>

      {/* User profile */}
      <div className="mb-4">
        <div className="mb-2">
          {user.image ? (
            <img
              src={user.image}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span>{user.username.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        <h3 className="font-semibold">{user.name || user.username}</h3>

        {/* Username edit section */}
        {isEditing ? (
          <div className="mt-1">
            <div className="flex items-center">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border p-1 text-sm w-full"
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
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center">
            <p className="text-sm text-gray-500">@{user.username}</p>
            <Button variant="outline" onClick={handleEditUsername}>
              <Pencil size={12} />
            </Button>
          </div>
        )}
      </div>

      {/* Account Management */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Account Management</h4>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
