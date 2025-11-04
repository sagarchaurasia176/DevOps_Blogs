// pages/api/notion-webhook.js
// app/api/notion-webhook/route.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // ✅ Handle Notion verification
  if (body?.challenge) {
    console.log("✅ Verification challenge received");
    return NextResponse.json({ challenge: body.challenge });
  }

  // ✅ Handle webhook event
  console.log("🔔 Webhook Event:", body.type);

  if (body.type === "page.created") {
    await axios.post(process.env.NOTION_WEB_HOOKS!);
  }
  return NextResponse.json({ received: true, message: body });
}
