// pages/api/notion-webhook.js
import axios from "axios";
import Error from "next/error";
import { NextRequest, NextResponse } from 'next/server';

// Webhooks | which directly shared the response to the server !
export async function POST(req:NextRequest) {
  try {
    // 2️⃣ Read Notion webhook payload
    const event = await req.json();
    console.log("🔔 Notion Webhook Received:", event.type);

    // 3️⃣ If a new Notion page (blog) is created
    if (event.type === "page.created") {
      console.log("📝 New Notion Page Created! Triggering redeploy...");

      // 4️⃣ Trigger your Vercel redeploy hook
      // ⚠️ Replace this with your real Vercel deploy hook URL
      await axios.post(process.env.NOTION_WEB_HOOKS!);
    }

    // 5️⃣ Respond back to Notion
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook Error:", Error.name);
    return NextResponse.json({ error: "Internal Server Error from the notion webhooks" }, { status: 500 });
  }
}
