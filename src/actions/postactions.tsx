"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Function to create a new post
export async function createPost(data: {
  studyGroupName: string;
  subjects: string[];
  when2MeetLink: string;
  image: string | null;
  studyDate: string;
  isPublic: boolean;
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

    console.log("Creating post with data:", data);

    const post = await prisma.post.create({
      data: {
        studyGroupName: data.studyGroupName,
        subjects: data.subjects.join(", "),
        when2MeetLink: data.when2MeetLink,
        image: data.image,
        studyDate: new Date(data.studyDate),
        isPublic: data.isPublic,
        authorId: user.id,
      },
    });

    console.log("Post created:", post);

    return { success: true, post };
  } catch (error) {
    console.error("Error in createPost:", error);
    return { success: false, message: "Failed to create post" };
  }
}

// Function to get all posts
export async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    console.log("Error in getAllPosts", error);
    return [];
  }
}

// Function to get a single post by ID
export async function getPostById(postId: string) {
  try {
    const post = await prisma.post.findUnique({
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
      },
    });

    if (!post) {
      return { success: false, message: "Post not found" };
    }

    return { success: true, post };
  } catch (error) {
    console.log("Error in getPostById", error);
    return { success: false, message: "Failed to fetch post" };
  }
}

// Function to delete a post by ID
export async function deletePost(postId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the post to ensure it belongs to the authenticated user
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        author: {
          clerkId: userId,
        },
      },
    });

    if (!post) {
      return { success: false, message: "Post not found or not authorized" };
    }

    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("Error in deletePost", error);
    return { success: false, message: "Failed to delete post" };
  }
}