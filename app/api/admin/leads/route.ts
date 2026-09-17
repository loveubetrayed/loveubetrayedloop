import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await getLeads();
  return NextResponse.json({ leads });
}
