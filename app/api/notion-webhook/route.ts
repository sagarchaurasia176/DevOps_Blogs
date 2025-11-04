// app/api/notion-webhook/route.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: any = {};

  // 🧩 Safely parse JSON (avoid "Unexpected end of JSON input")
  try {
    body = await req.json();
  } catch (err) {
    console.warn("⚠️ No or invalid JSON body received");
    return NextResponse.json(
      { error: "Invalid or empty body" },
      { status: 400 }
    );
  }

  // ✅ Handle Notion verification
  if (body?.challenge) {
    console.log("✅ Verification challenge received");
    return NextResponse.json({ challenge: body.challenge });
  }

  // 🧩 Detect event type safely
  const eventType =
    body.type ||
    body?.event?.type ||
    (body?.events?.[0] ? body.events[0].type : undefined);

  console.log("🔔 Webhook Event:", eventType || "Unknown event");

  // ✅ Handle actual events
  if (eventType === "page.created") {
    console.log("📝 New Notion Page Created! Triggering deploy...");
    try {
      await axios.post(process.env.NOTION_WEB_HOOKS!);
    } catch (err) {
      console.error("❌ Failed to trigger deploy:", err);
    }
  }

  return NextResponse.json({ received: true });
}
