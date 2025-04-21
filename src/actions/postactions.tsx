/**
 * Contains actions related to posts in the Study Group Finder application.
 *
 * Functions:
 * - `fetchPosts`: Fetches all posts from the server.
 * - `createPost`: Creates a new post with the provided data.
 * - `deletePost`: Deletes a post by its ID.
 */

"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

// Function to create a new study group
export async function createPost(data: {
  studyGroupName: string;
  studyGroupBio?: string | null;  //optional = nullable
  subjects: string[];
  when2MeetLink?: string | null;  //optional = nullable
  image: string | null;
  studyDates: string[];
  studyTime: string;
  location: string;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("User not authenticated");
      return { success: false, message: "Not authenticated" };
    }

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      console.log("User not found");
      return { success: false, message: "User not found" };
    }

    console.log("Creating study group with data:", data);

    const formattedStudyTime = new Date(
      `1970-01-01T${data.studyTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const studyGroup = await prisma.studyGroup.create({
      data: {
        studyGroupName: data.studyGroupName,
        studyGroupBio: data.studyGroupBio || "",  // Provide default empty string
        subjects: data.subjects,
        when2MeetLink: data.when2MeetLink || "",  // Provide default empty string
        image: data.image,
        studyDates: data.studyDates,
        studyTime: formattedStudyTime,
        location: data.location,
        authorId: user.id,
        status: "active",
        members: {
          create: {
            userId: user.id,
            username: user.username,
          },
        },
      },
      include: {
        members: true,
      },
    });

    console.log("Study group created:", studyGroup);

    return { success: true, post: studyGroup };
  } catch (error) {
    console.error("Error in createPost:", error);
    return { success: false, message: "Failed to create study group" };
  }
}

// Function to get all study groups
export async function getAllPosts() {
  try {
    const studyGroups = await prisma.studyGroup.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        members: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return studyGroups;
  } catch (error) {
    console.log("Error in getAllPosts", error);
    return [];
  }
}

// Function to get a single study group by ID
export async function getPostById(postId: string) {
  try {
    const studyGroup = await prisma.studyGroup.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        members: true,
      },
    });

    if (!studyGroup) {
      return { success: false, message: "Study group not found" };
    }

    return { success: true, post: studyGroup };
  } catch (error) {
    console.log("Error in getPostById", error);
    return { success: false, message: "Failed to fetch study group" };
  }
}

// Function to delete a study group by ID
export async function deletePost(postId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the study group to ensure it belongs to the authenticated user
    const studyGroup = await prisma.studyGroup.findFirst({
      where: {
        id: postId,
        author: {
          clerkId: userId,
        },
      },
    });

    if (!studyGroup) {
      return {
        success: false,
        message: "Study group not found or not authorized",
      };
    }

    // Delete the study group
    await prisma.studyGroup.delete({
      where: {
        id: postId,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("Error in deletePost", error);
    return { success: false, message: "Failed to delete study group" };
  }
}

// Function to join a study group
export async function joinStudyGroup(postId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check if user is already a member
    const existingMembership = await prisma.studyGroupMember.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    if (existingMembership) {
      return {
        success: false,
        message: "Already a member of this study group",
      };
    }

    // Add user as a member
    await prisma.studyGroupMember.create({
      data: {
        userId: user.id,
        postId: postId,
        username: user.username,
      },
    });

    return {
      success: true,
      message: "Successfully joined study group",
    };
  } catch (error) {
    console.error("Error joining study group:", error);
    return {
      success: false,
      message: "Failed to join study group",
    };
  }
}

// Function to leave a study group
export async function leaveStudyGroup(postId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Remove membership
    await prisma.studyGroupMember.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    return { success: true, message: "Successfully left study group" };
  } catch (error) {
    console.error("Error leaving study group:", error);
    return { success: false, message: "Failed to leave study group" };
  }
}

// Check if a user is a member of a study group
export async function checkMembership(postId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        isMember: false,
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return {
        isMember: false,
      };
    }

    const membership = await prisma.studyGroupMember.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    return {
      isMember: !!membership,
    };
  } catch (error) {
    console.error("Error checking membership:", error);
    return {
      isMember: false,
    };
  }
}

// Get all study groups a user is a member of
export async function getUserStudyGroups() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Not authenticated", groups: [] };
    }

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return { success: false, message: "User not found", groups: [] };
    }

    // Find all study groups where the user is a member
    const studyGroups = await prisma.studyGroup.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        members: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, groups: studyGroups };
  } catch (error) {
    console.error("Error fetching user study groups:", error);
    return {
      success: false,
      message: "Failed to fetch study groups",
      groups: [],
    };
  }
}

// Get all study groups a user has created (is the author of)
export async function getUserOwnedStudyGroups() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Not authenticated", groups: [] };
    }

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return { success: false, message: "User not found", groups: [] };
    }

    // Find all study groups where the user is the author
    const ownedStudyGroups = await prisma.studyGroup.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        members: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, groups: ownedStudyGroups };
  } catch (error) {
    console.error("Error fetching user owned study groups:", error);
    return {
      success: false,
      message: "Failed to fetch owned study groups",
      groups: [],
    };
  }
}
