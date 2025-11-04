// app/api/notion-webhook/route.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  const body = await req.json();

  // ✅ Handle Notion verification
  if (body?.challenge) {
    console.log("✅ Verification challenge received");
    return NextResponse.json({ challenge: body.challenge });
  }

  // 🧩 Handle both possible payload shapes
  const eventType =
    body.type ||
    body?.event?.type ||
    (body?.events?.[0] ? body.events[0].type : undefined);

  console.log("🔔 Webhook Event:", eventType);

  // ✅ Handle webhook event
  if (eventType === "page.created") {
    console.log("📝 New Notion Page Created! Triggering deploy...");
    await axios.post(process.env.NOTION_WEB_HOOKS!);
  }

  return NextResponse.json({ received: true });
}
