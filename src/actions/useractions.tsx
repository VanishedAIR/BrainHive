"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

export async function syncUser() {
  /*
   Synchronizes the Clerk user with the database.
   
   Args:
     null
   
   Returns:
     User object if successful, undefined otherwise.
   */
  try {
    const { userId } = await auth();
    const user = await currentUser();

    // If the user is not authenticated or doesn't exist, return
    if (!userId || !user) return;

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    // Create a new user in the database
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: (
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
        ).substring(0, 16),
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

export async function getCurrentUser() {
  /*
   Gets the current user from the database.
   
   Args:
     null
   
   Returns:
     User object if found, null otherwise.
   */
  try {
    const { userId } = await auth();

    if (!userId) return null;

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        clerkId: true,
        username: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.log("Error in getCurrentUser", error);
    return null;
  }
}

export async function updateUsername(newUsername: string) {
  /*
   Updates the username for the current user.
   
   Args:
     newUsername (string): The new username to set
   
   Returns:
     Object with success status and message.
   */
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    // Validate username length
    if (newUsername.length > 16) {
      return {
        success: false,
        message: "Username cannot exceed 16 characters",
      };
    }

    // Get the current user from database
    const currentUserDb = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!currentUserDb) {
      return { success: false, message: "User not found" };
    }

    // If username hasn't changed, return without doing anything
    if (currentUserDb.username === newUsername) {
      return { success: true };
    }

    // Check if username already exists for another user
    const existingUser = await prisma.user.findUnique({
      where: {
        username: newUsername,
      },
    });

    if (existingUser) {
      return { success: false, message: "Username already taken" };
    }

    // Update the username in the User table
    await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        username: newUsername,
      },
    });

    // Update the username in all StudyGroupMember records for this user
    await prisma.studyGroupMember.updateMany({
      where: {
        userId: currentUserDb.id,
      },
      data: {
        username: newUsername,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("Error in updateUsername", error);
    return { success: false, message: "Failed to update username" };
  }
}

export async function deleteCurrentUser() {
  /*
   Deletes the current user account.
   
   Args:
     null
   
   Returns:
     Object with success status and message.
   */
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the user to get their database ID
    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Delete all study groups authored by the user
    await prisma.studyGroup.deleteMany({
      where: {
        authorId: user.id,
      },
    });

    // Delete the user from the database
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    // Delete the user from Clerk's system
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return { success: true };
  } catch (error) {
    console.log("Error in deleteCurrentUser", error);
    return { success: false, message: "Failed to delete account" };
  }
}

export async function searchStudyGroups(query: string) {
  /*
   Searches for study groups based on a text query.
   
   Args:
     query (string): The search term to look for
   
   Returns:
     Array of study group objects matching the query.
   */
  console.log(" searchStudyGroups() called!");

  try {
    // If the query is empty, return an empty Array
    if (!query.trim()) return [];

    console.log("Search Query:", query);

    // Find all study groups that match the query
    const results = await prisma.studyGroup.findMany({
      where: {
        OR: [
          {
            studyGroupName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            studyGroupBio: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        members: true,
      },
    });

    console.log("Results:", results);
    return results;
  } catch (error) {
    console.error(" Error in searchStudyGroups", error);
    return [];
  }
}
