/// <reference types="@testing-library/jest-dom" />
import {
  updateUsername,
  getCurrentUser,
  syncUser,
  deleteCurrentUser,
  searchStudyGroups,
} from "@/actions/useractions";

// Mock the auth and currentUser functions from Clerk
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    studyGroupMember: {
      updateMany: jest.fn(),
    },
    studyGroup: {
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Import the mocked modules
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const mockedAuth = auth as unknown as jest.Mock;
const mockedCurrentUser = currentUser as unknown as jest.Mock;

describe("User Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrentUser", () => {
    it("returns null when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await getCurrentUser();
      expect(result).toBeNull();
    });

    it("returns user when authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/image.jpg",
        createdAt: new Date(),
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await getCurrentUser();
      expect(result).toEqual(mockUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { clerkId: "test-clerk-id" },
        select: expect.objectContaining({
          id: true,
          clerkId: true,
          username: true,
        }),
      });
    });
  });

  describe("updateUsername", () => {
    it("returns error when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await updateUsername("newusername");
      expect(result).toEqual({ success: false, message: "Not authenticated" });
    });

    it("returns error when username exceeds maximum length", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const longUsername = "a".repeat(17);
      const result = await updateUsername(longUsername);
      expect(result).toEqual({
        success: false,
        message: "Username cannot exceed 16 characters",
      });
    });

    it("returns success when username is updated", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "oldusername",
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // No existing user with the new username
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        username: "newusername",
      });

      const result = await updateUsername("newusername");
      expect(result).toEqual({ success: true });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { clerkId: "test-clerk-id" },
        data: { username: "newusername" },
      });
    });

    it("returns error when username is already taken", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "oldusername",
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      // Mock an existing user with the requested username
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        username: "newusername",
      });

      const result = await updateUsername("newusername");
      expect(result).toEqual({
        success: false,
        message: "Username already taken",
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("syncUser", () => {
    it("returns undefined when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });
      mockedCurrentUser.mockResolvedValue(null);

      const result = await syncUser();
      expect(result).toBeUndefined();
    });

    it("returns existing user when already synced", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });
      mockedCurrentUser.mockResolvedValue({
        id: "test-clerk-id",
        firstName: "Test",
        lastName: "User",
      });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/image.jpg",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await syncUser();
      expect(result).toEqual(mockUser);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("creates new user when not synced before", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });
      mockedCurrentUser.mockResolvedValue({
        id: "test-clerk-id",
        firstName: "Test",
        lastName: "User",
        emailAddresses: [{ emailAddress: "test@example.com" }],
        imageUrl: "https://example.com/image.jpg",
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const mockCreatedUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "test",
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/image.jpg",
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await syncUser();
      expect(result).toEqual(mockCreatedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          clerkId: "test-clerk-id",
          name: "Test User",
          username: "test",
          email: "test@example.com",
          image: "https://example.com/image.jpg",
        },
      });
    });
  });

  describe("deleteCurrentUser", () => {
    it("returns error when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await deleteCurrentUser();
      expect(result).toEqual({ success: false, message: "Not authenticated" });
    });

    it("returns error when user not found", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await deleteCurrentUser();
      expect(result).toEqual({ success: false, message: "User not found" });
    });

    it("successfully deletes user and their study groups", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (prisma.studyGroup.deleteMany as jest.Mock).mockResolvedValue({
        count: 2,
      });
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await deleteCurrentUser();
      expect(result).toEqual({ success: true });

      expect(prisma.studyGroup.deleteMany).toHaveBeenCalledWith({
        where: { authorId: 1 },
      });

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe("searchStudyGroups", () => {
    it("returns empty array for empty query", async () => {
      const result = await searchStudyGroups("  ");
      expect(result).toEqual([]);
      expect(prisma.studyGroup.findMany).not.toHaveBeenCalled();
    });

    it("searches study groups with provided query", async () => {
      const mockQuery = "study";
      const mockResults = [
        {
          id: 1,
          studyGroupName: "Study Group 1",
          studyGroupBio: "This is a study group",
          author: {
            id: 1,
            name: "Test User",
            username: "testuser",
            image: "https://example.com/image.jpg",
          },
          members: [],
          createdAt: new Date(),
        },
      ];

      (prisma.studyGroup.findMany as jest.Mock).mockResolvedValue(mockResults);

      const result = await searchStudyGroups(mockQuery);
      expect(result).toEqual(mockResults);
      expect(prisma.studyGroup.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              studyGroupName: {
                contains: mockQuery,
                mode: "insensitive",
              },
            },
            {
              studyGroupBio: {
                contains: mockQuery,
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
    });

    it("returns empty array on error", async () => {
      (prisma.studyGroup.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const result = await searchStudyGroups("query");
      expect(result).toEqual([]);
    });
  });
});
