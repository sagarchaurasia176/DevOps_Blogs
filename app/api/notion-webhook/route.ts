// pages/api/notion-webhook.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Handle only POST requests
    if (req.method !== "POST") {
      return NextResponse.json({ error: "post not created" }, { status: 500 });
    }

    // 2️⃣ Parse the body
    const body = await req.json();

    // 3️⃣ Handle Notion's verification challenge
    if (body?.challenge) {
      console.log("🧩 Notion verification challenge received");
      return NextResponse.json({ challenge: body.challenge });
    }

    // 4️⃣ Handle real webhook events
    console.log("🔔 Notion Webhook Event:", body.type);

    if (body.type === "page.created") {
      console.log("📝 New Notion Page Created! Triggering Vercel Deploy...");

      // Replace this URL with your actual Vercel deploy hook
      await axios.post(process.env.NOTION_WEB_HOOKS!);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
