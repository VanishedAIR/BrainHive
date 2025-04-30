"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createPost(data: {
  studyGroupName: string;
  studyGroupBio?: string | null; //optional = nullable
  subjects: string[];
  when2MeetLink?: string | null; //optional = nullable
  studyDates: string[];
  studyTime: string;
  location: string;
}) {
  /*
   Creates a new study group post.
   
   Args:
     data: Object containing study group details:
       - studyGroupName: Name of the study group
       - studyGroupBio: Optional description of the study group
       - subjects: Array of subjects for the study group
       - when2MeetLink: Optional link to When2Meet scheduling tool
       - studyDates: Array of dates for study sessions
       - studyTime: Time for study sessions
       - location: Location for study sessions
   
   Returns:
     Object with success status and the created study group if successful.
  */
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

    // Format the study time to be in the format of "HH:MM AM/PM"
    const formattedStudyTime = new Date(
      `1970-01-01T${data.studyTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Create the study group
    const studyGroup = await prisma.studyGroup.create({
      data: {
        studyGroupName: data.studyGroupName,
        studyGroupBio: data.studyGroupBio || "", // Provide default empty string
        subjects: data.subjects,
        when2MeetLink: data.when2MeetLink || "", // Provide default empty string
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

export async function getAllPosts() {
  /*
   Retrieves all study groups.
   
   Args:
     None
   
   Returns:
     Array of study group objects.
  */
  try {
    const studyGroups = await prisma.studyGroup.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
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

export async function getPostById(postId: string) {
  /*
   Retrieves a specific study group by its ID.
   
   Args:
     postId (string): The ID of the study group to retrieve
   
   Returns:
     Object with success status and the study group if found.
  */
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

export async function deletePost(postId: string) {
  /*
   Deletes a study group by its ID.
   
   Args:
     postId (string): The ID of the study group to delete
   
   Returns:
     Object with success status and message.
  */
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the study group to make sure it belongs to the user
    const studyGroup = await prisma.studyGroup.findFirst({
      where: {
        id: postId,
        author: {
          clerkId: userId,
        },
      },
    });

    // If the study group is not found, return an error
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
  /*
   Adds the current user as a member of a study group.
   
   Args:
     postId (string): The ID of the study group to join
   
   Returns:
     Object with success status and message.
  */
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

    // If the user is already a member, return an error
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
  /*
   Removes the current user from a study group.
   
   Args:
     postId (string): The ID of the study group to leave
   
   Returns:
     Object with success status and message.
  */
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

    // Check if user is a member
    const membership = await prisma.studyGroupMember.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    if (!membership) {
      return { success: false, message: "Not a member of this study group" };
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

export async function checkMembership(postId: string) {
  /*
   Checks if the current user is a member of a specific study group.
   
   Args:
     postId (string): The ID of the study group to check
   
   Returns:
     Object with isMember boolean status.
  */
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

    // Check if the user is a member of the study group
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

export async function getUserStudyGroups() {
  /*
   Retrieves all study groups the current user is a member of.
   
   Args:
     None
   
   Returns:
     Object with success status, message, and array of study group objects.
  */
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

export async function getUserOwnedStudyGroups() {
  /*
   Retrieves all study groups created by the current user.
   
   Args:
     None
   
   Returns:
     Object with success status, message, and array of study group objects.
  */
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
