"use server";

/**
 * User Actions Module
 *
 * This module contains server-side functions for managing user-related actions in the Study Group Finder application.
 * Functions include syncing user data, retrieving the current user, updating usernames, deleting accounts, and searching study groups.
 */

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Syncs the current user with the database.
 * If the user does not exist in the database, it creates a new user record.
 *
 * @returns {Promise<Object | undefined>} The user object if it exists or is created, otherwise undefined.
 */

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

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

/**
 * Retrieves the current user from the database.
 *
 * @returns {Promise<Object | null>} The current user object or null if not authenticated.
 */

export async function getCurrentUser() {
  try {
    const { userId } = await auth();

    if (!userId) return null;

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

/**
 * Updates the username of the current user.
 *
 * @param {string} newUsername - The new username to set.
 * @returns {Promise<Object>} The result of the update operation.
 */

export async function updateUsername(newUsername: string) {
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

    // If username hasn't changed, return success without doing anything
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

    // Also update the username in all StudyGroupMember records for this user
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

/**
 * Deletes the current user's account and all associated data.
 * 
 * @returns {Promise<Object>} The result of the delete operation.
 */

export async function deleteCurrentUser() {
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

    // First, delete all study groups authored by the user
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

    return { success: true };
  } catch (error) {
    console.log("Error in deleteCurrentUser", error);
    return { success: false, message: "Failed to delete account" };
  }
}

/**
 * Searches for study groups based on a query string.
 * 
 * @param {string} query - The search query string.
 * * @returns {Promise<Array>} An array of study groups matching the query.
 */

export async function searchStudyGroups(query: string) {
  console.log(" searchStudyGroups() called!");

  try {
    if (!query.trim()) return [];

    console.log("Search Query:", query);

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
