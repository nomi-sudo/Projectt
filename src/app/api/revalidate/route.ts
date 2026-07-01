import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const tag = request.nextUrl.searchParams.get("tag");
  if (!tag) {
    return NextResponse.json({ error: "Missing tag" }, { status: 400 });
  }

  try {
    const { revalidateTag } = await import("next/cache");
    revalidateTag(tag, "max");
    return NextResponse.json({ revalidated: true, tag });
  } catch {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
