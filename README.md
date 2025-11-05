# 🧠 Notion + Vercel Integration

A lightweight setup that connects your Notion database as a backend with Vercel for deployment. Perfect for content-driven apps like blogs, portfolios, or dashboards — where all your data is managed directly in Notion.

## 🚀 Features

- **Notion as Backend** – Use Notion databases to store and manage content
- **Serverless API Routes** – Built with Next.js/Node.js for optimal performance
- **Auto-Deploy** – Push to GitHub and deploy automatically on Vercel
- **Live Updates** – Optional webhook integration for real-time content sync
- **Minimal Setup** – No complex backend infrastructure required

## 🛠️ Tech Stack

- **Next.js / Node.js** – API routes & serverless functions
- **Notion API** – Data fetching and integration
- **Vercel** – Hosting and continuous deployment

## ⚙️ Setup Guide

### 1. Create a Notion Integration

1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Click **New Integration**
3. Give it a name and select associated workspace
4. Copy the **Internal Integration Token**

### 2. Connect Integration to Your Database

1. Open your Notion database
2. Click **Share** in the top right
3. Click **Invite** and select your integration
4. Grant access to the database

### 3. Get Database ID

Find your database ID in the URL:

```
https://www.notion.so/yourworkspace/Your-Database-Name-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                    This is your Database ID
```

Copy the string after the last `/` (before any `?` parameters).

### 4. Add Environment Variables

Create a `.env.local` file in your project root:

```env
NOTION_TOKEN=your_secret_token
NOTION_DATABASE_ID=your_database_id
```

For production, add these in your **Vercel Dashboard** under Settings → Environment Variables.

### 5. Install Dependencies

```bash
npm install @notionhq/client
```

### 6. Create API Route

Create `app/api/notion/route.js` (App Router) or `pages/api/notion.js` (Pages Router):

**App Router Example:**

```javascript
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET() {
  try {
    const data = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    return Response.json(data.results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

**Pages Router Example:**

```javascript
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  try {
    const data = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    res.status(200).json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 7. Deploy on Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in the deployment settings
4. Deploy!

Your API will be available at: `https://your-app.vercel.app/api/notion`

## 🔁 Optional: Auto-Redeploy on Content Changes

Set up webhooks to automatically redeploy when you update Notion content:

### Using Vercel Deploy Hooks

1. Go to your Vercel project → **Settings** → **Git**
2. Create a **Deploy Hook** and copy the URL
3. Use [Pipedream](https://pipedream.com) or [Make](https://www.make.com) to watch for Notion changes
4. Trigger the deploy hook URL when changes are detected

### Using Pipedream (Recommended)

1. Create a new workflow on [Pipedream](https://pipedream.com)
2. Add **Notion - New Database Item** as trigger
3. Add **HTTP Request** action with your Vercel deploy hook URL
4. Save and activate the workflow

## 📦 Example Response

```json
[
  {
    "object": "page",
    "id": "xxxx-xxxx-xxxx",
    "properties": {
      "Name": { 
        "title": [{ 
          "text": { "content": "My First Blog" } 
        }] 
      },
      "Tags": { 
        "multi_select": [{ "name": "Web Dev" }] 
      },
      "Status": {
        "select": { "name": "Published" }
      }
    }
  }
]
```

## 🎯 Use Cases

- **Blog** – Write posts in Notion, display on your Next.js site
- **Portfolio** – Manage projects and case studies
- **Documentation** – Keep docs in Notion, serve via API
- **Dashboard** – Track tasks, metrics, or analytics
- **Landing Pages** – Update content without redeploying

## 📚 Resources

- [Notion API Documentation](https://developers.notion.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [@notionhq/client NPM Package](https://www.npmjs.com/package/@notionhq/client)

## 🧑‍💻 Author

**Sagar Chaurasia**  
💼 Full-Stack Developer | 🚀 Building modern web experiences

- 📎 [LinkedIn](https://linkedin.com/in/sagarchaurasia)
- 🌐 [Portfolio](https://your-portfolio.com)

## 🏷️ License

This project is open-source under the [MIT License](LICENSE).

---

⭐ **Star this repo** if you found it helpful!  
🐛 **Issues and PRs** are welcome!
