/// <reference types="@testing-library/jest-dom" />
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  joinStudyGroup,
  leaveStudyGroup,
  checkMembership,
  getUserStudyGroups,
  getUserOwnedStudyGroups,
} from "@/actions/postactions";

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
    },
    studyGroup: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    studyGroupMember: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Import the mocked modules
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const mockedAuth = auth as unknown as jest.Mock;

describe("Post Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    //describe the createPost function
    it("returns error when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await createPost({
        studyGroupName: "Test Group",
        subjects: ["Math", "Science"],
        studyDates: ["2023-05-01"],
        studyTime: "14:00",
        location: "Library",
      });

      expect(result).toEqual({
        success: false,
        message: "Not authenticated",
      });
    });

    it("creates a study group successfully", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const mockStudyGroup = {
        id: "sg123",
        studyGroupName: "Test Group",
        studyGroupBio: "Test bio",
        subjects: ["Math", "Science"],
        when2MeetLink: "https://when2meet.com/link",
        studyDates: ["2023-05-01"],
        studyTime: "2:00 PM",
        location: "Library",
        authorId: 1,
        status: "active",
        members: [
          {
            userId: 1,
            username: "testuser",
            postId: "sg123",
          },
        ],
      };
      (prisma.studyGroup.create as jest.Mock).mockResolvedValue(mockStudyGroup);

      const result = await createPost({
        studyGroupName: "Test Group",
        studyGroupBio: "Test bio",
        subjects: ["Math", "Science"],
        when2MeetLink: "https://when2meet.com/link",
        studyDates: ["2023-05-01"],
        studyTime: "14:00",
        location: "Library",
      });

      expect(result).toEqual({
        success: true,
        post: mockStudyGroup,
      });

      expect(prisma.studyGroup.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            studyGroupName: "Test Group",
            subjects: ["Math", "Science"],
            authorId: 1,
          }),
        })
      );
    });
  });

  describe("getPostById", () => {
    it("returns the study group when it exists", async () => {
      const mockStudyGroup = {
        id: "sg123",
        studyGroupName: "Test Group",
        author: {
          id: 1,
          username: "testuser",
          name: "Test User",
        },
        members: [],
      };

      (prisma.studyGroup.findUnique as jest.Mock).mockResolvedValue(
        mockStudyGroup
      );

      const result = await getPostById("sg123");

      expect(result).toEqual({
        success: true,
        post: mockStudyGroup,
      });

      expect(prisma.studyGroup.findUnique).toHaveBeenCalledWith({
        where: { id: "sg123" },
        include: expect.objectContaining({
          author: expect.any(Object),
          members: true,
        }),
      });
    });

    it("returns error when study group doesn't exist", async () => {
      (prisma.studyGroup.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getPostById("nonexistent");

      expect(result).toEqual({
        success: false,
        message: "Study group not found",
      });
    });
  });

  describe("deletePost", () => {
    it("returns error when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await deletePost("sg123");

      expect(result).toEqual({
        success: false,
        message: "Not authenticated",
      });
    });

    it("deletes the study group when authorized", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockStudyGroup = {
        id: "sg123",
        studyGroupName: "Test Group",
      };
      (prisma.studyGroup.findFirst as jest.Mock).mockResolvedValue(
        mockStudyGroup
      );

      (prisma.studyGroup.delete as jest.Mock).mockResolvedValue({});

      const result = await deletePost("sg123");

      expect(result).toEqual({ success: true });
      expect(prisma.studyGroup.delete).toHaveBeenCalledWith({
        where: { id: "sg123" },
      });
    });

    it("returns error when not authorized", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      (prisma.studyGroup.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await deletePost("sg123");

      expect(result).toEqual({
        success: false,
        message: "Study group not found or not authorized",
      });
      expect(prisma.studyGroup.delete).not.toHaveBeenCalled();
    });
  });

  describe("joinStudyGroup", () => {
    it("returns error when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await joinStudyGroup("sg123");

      expect(result).toEqual({
        success: false,
        message: "Not authenticated",
      });
    });

    it("joins the study group successfully", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      (prisma.studyGroupMember.findUnique as jest.Mock).mockResolvedValue(null);

      // Mock creating the membership
      (prisma.studyGroupMember.create as jest.Mock).mockResolvedValue({
        userId: 1,
        postId: "sg123",
        username: "testuser",
      });

      const result = await joinStudyGroup("sg123");

      expect(result).toEqual({
        success: true,
        message: "Successfully joined study group",
      });

      expect(prisma.studyGroupMember.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          postId: "sg123",
          username: "testuser",
        },
      });
    });

    it("returns error when already a member", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      (prisma.studyGroupMember.findUnique as jest.Mock).mockResolvedValue({
        userId: 1,
        postId: "sg123",
        username: "testuser",
      });

      const result = await joinStudyGroup("sg123");

      expect(result).toEqual({
        success: false,
        message: "Already a member of this study group",
      });

      expect(prisma.studyGroupMember.create).not.toHaveBeenCalled();
    });
  });

  describe("leaveStudyGroup", () => {
    it("returns error when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await leaveStudyGroup("sg123");

      expect(result).toEqual({
        success: false,
        message: "Not authenticated",
      });
    });

    it("leaves the study group successfully", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const mockMembership = {
        userId: 1,
        postId: "sg123",
        username: "testuser",
      };
      (prisma.studyGroupMember.findUnique as jest.Mock).mockResolvedValue(
        mockMembership
      );

      (prisma.studyGroupMember.delete as jest.Mock).mockResolvedValue(
        mockMembership
      );

      const result = await leaveStudyGroup("sg123");

      expect(result).toEqual({
        success: true,
        message: "Successfully left study group",
      });

      expect(prisma.studyGroupMember.delete).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: 1,
            postId: "sg123",
          },
        },
      });
    });

    it("returns error when not a member", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      (prisma.studyGroupMember.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await leaveStudyGroup("sg123");

      expect(result).toEqual({
        success: false,
        message: "Not a member of this study group",
      });

      expect(prisma.studyGroupMember.delete).not.toHaveBeenCalled();
    });
  });

  describe("getAllPosts", () => {
    it("returns all study groups", async () => {
      const mockStudyGroups = [
        {
          id: "sg123",
          studyGroupName: "Test Group 1",
          author: {
            id: 1,
            username: "testuser",
            name: "Test User",
          },
          members: [],
        },
        {
          id: "sg456",
          studyGroupName: "Test Group 2",
          author: {
            id: 2,
            username: "user2",
            name: "User Two",
          },
          members: [],
        },
      ];

      (prisma.studyGroup.findMany as jest.Mock).mockResolvedValue(
        mockStudyGroups
      );

      const result = await getAllPosts();

      expect(result).toEqual(mockStudyGroups);
      expect(prisma.studyGroup.findMany).toHaveBeenCalledWith({
        include: expect.objectContaining({
          author: expect.any(Object),
          members: true,
        }),
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("returns empty array on error", async () => {
      (prisma.studyGroup.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getAllPosts();

      expect(result).toEqual([]);
    });
  });

  describe("checkMembership", () => {
    it("returns false when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await checkMembership("sg123");

      expect(result).toEqual({ isMember: false });
    });

    it("returns true when user is a member", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const mockMembership = {
        userId: 1,
        postId: "sg123",
        username: "testuser",
      };
      (prisma.studyGroupMember.findUnique as jest.Mock).mockResolvedValue(
        mockMembership
      );

      const result = await checkMembership("sg123");

      expect(result).toEqual({ isMember: true });
      expect(prisma.studyGroupMember.findUnique).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: 1,
            postId: "sg123",
          },
        },
      });
    });

    it("returns false when user is not a member", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      (prisma.studyGroupMember.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await checkMembership("sg123");

      expect(result).toEqual({ isMember: false });
    });
  });

  describe("getUserStudyGroups", () => {
    it("returns error when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await getUserStudyGroups();

      expect(result).toEqual({
        success: false,
        message: "Not authenticated",
        groups: [],
      });
    });

    it("returns the user's study groups", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const mockStudyGroups = [
        {
          id: "sg123",
          studyGroupName: "Test Group 1",
          author: {
            id: 2,
            username: "otheruser",
            name: "Other User",
          },
          members: [
            { userId: 1, username: "testuser", postId: "sg123" },
            { userId: 2, username: "otheruser", postId: "sg123" },
          ],
        },
      ];
      (prisma.studyGroup.findMany as jest.Mock).mockResolvedValue(
        mockStudyGroups
      );

      const result = await getUserStudyGroups();

      expect(result).toEqual({
        success: true,
        groups: mockStudyGroups,
      });

      expect(prisma.studyGroup.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            members: {
              some: {
                userId: 1,
              },
            },
          },
        })
      );
    });
  });

  describe("getUserOwnedStudyGroups", () => {
    it("returns error when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null });

      const result = await getUserOwnedStudyGroups();

      expect(result).toEqual({
        success: false,
        message: "Not authenticated",
        groups: [],
      });
    });

    it("returns the study groups owned by the user", async () => {
      mockedAuth.mockResolvedValue({ userId: "test-clerk-id" });

      const mockUser = {
        id: 1,
        clerkId: "test-clerk-id",
        username: "testuser",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const mockOwnedGroups = [
        {
          id: "sg123",
          studyGroupName: "Test Group 1",
          authorId: 1,
          author: {
            id: 1,
            username: "testuser",
            name: "Test User",
          },
          members: [
            { userId: 1, username: "testuser", postId: "sg123" },
            { userId: 2, username: "otheruser", postId: "sg123" },
          ],
        },
      ];
      (prisma.studyGroup.findMany as jest.Mock).mockResolvedValue(
        mockOwnedGroups
      );

      const result = await getUserOwnedStudyGroups();

      expect(result).toEqual({
        success: true,
        groups: mockOwnedGroups,
      });

      expect(prisma.studyGroup.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            authorId: 1,
          },
        })
      );
    });
  });
});
