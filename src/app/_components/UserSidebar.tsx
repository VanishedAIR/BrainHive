import { getCurrentUser } from "@/actions/useractions";
import DeleteAccountButton from "./DeleteAccountButton";

export async function UserSidebar() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="w-[300px] min-h-screen border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">User Information</h2>
        <p className="text-gray-500">Please sign in to view your information</p>
      </div>
    );
  }

  return (
    <div className="w-[300px] min-h-screen border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>
      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 mb-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.username}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-lg font-medium">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold">
            {user.name || user.username}
          </h3>
        </div>
        <div className="space-y-2 text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium">ID:</span> {user.id}
          </p>
          <p>
            <span className="font-medium">Clerk ID:</span> {user.clerkId}
          </p>
          <p>
            <span className="font-medium">Username:</span> {user.username}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          {user.location && (
            <p>
              <span className="font-medium">Location:</span> {user.location}
            </p>
          )}
          {user.bio && (
            <p>
              <span className="font-medium">Bio:</span> {user.bio}
            </p>
          )}
          {user.website && (
            <p>
              <span className="font-medium">Website:</span> {user.website}
            </p>
          )}
          <p>
            <span className="font-medium">Joined:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Account Management */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium mb-3">Account Management</h4>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
