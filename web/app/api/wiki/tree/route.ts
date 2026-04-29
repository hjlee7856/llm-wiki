import { NextResponse } from "next/server";
import { buildRawTree, buildWikiTree } from "@/lib/wiki";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");
    const tree = scope === "raw" ? await buildRawTree() : await buildWikiTree();
    return NextResponse.json({ tree });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to build wiki tree.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
