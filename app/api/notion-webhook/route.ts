// app/api/notion-webhook/route.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: any = {};

  // 🧩 Safely parse JSON (avoid "Unexpected end of JSON input")
  try {
    body = await req.json();
    console.log("✅ JSON body received:", body);
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
      let NOTION_WEB_HOOK = await axios.get(process.env.NOTION_WEB_HOOKS!);
      if (!NOTION_WEB_HOOK) {
        throw new Error("❌ Failed to trigger deploy");
      }
    } catch (err) {
      console.error("❌ Failed to trigger deploy:", err);
    }
  }

  return NextResponse.json({ received: true });
}
