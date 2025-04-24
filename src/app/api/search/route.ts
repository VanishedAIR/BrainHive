import { NextResponse } from "next/server";
import { searchStudyGroups } from "@/actions/useractions";

export async function GET(req: Request) {
  console.log("📡 API route hit!"); // ✅ Log when this route is accessed

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json([], { status: 200 });

  const results = await searchStudyGroups(query);
  return NextResponse.json(results);
}
