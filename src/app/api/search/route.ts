import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const includeSubjects = searchParams.get("includeSubjects") === "true";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const studyGroupsByNameOrBio = await prisma.studyGroup.findMany({
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

    if (!includeSubjects) {
      return NextResponse.json(studyGroupsByNameOrBio);
    }

    const allStudyGroups = await prisma.studyGroup.findMany({
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

    const studyGroupsBySubject = allStudyGroups.filter(group => {
      if (!Array.isArray(group.subjects)) return false;
      
      return group.subjects.some(subject => 
        subject.toLowerCase().includes(query.toLowerCase())
      );
    });

    const allResults = [...studyGroupsByNameOrBio, ...studyGroupsBySubject];
    const uniqueResults = Array.from(
      new Map(allResults.map(group => [group.id, group])).values()
    );

    uniqueResults.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(uniqueResults);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
