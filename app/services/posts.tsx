// This code fetches all posts from a Notion database using the Notion API !
import { Client } from "@notionhq/client";
import { Post } from "@/app/types/post";
import { getBlurImage } from "@/app/utils/get-blur-image";

const notion = new Client({
  auth:process.env.NOTION_AUTH_TOKEN,
});


export async function getAllPostsFromNotion(): Promise<Post[]> {
  try {
    // ✅ Query database
    const response = await notion.dataSources.query({
      data_source_id:"2890d6b8-5776-8032-9210-000bc651d6b0",
      filter: {
        property: "published",
        checkbox: {
          equals: true,
        },
      },
    });

    // ✅ Map through database results
    const allPost: Post[] = await Promise.all(
      response.results.map(async (page: any) => {
        const props = page.properties;
        // Extract title
        const title = props.title?.title?.[0]?.plain_text || "Untitled";
        // Extract slug which type is a text in notion db
        const slug = props.slug?.rich_text?.[0]?.plain_text || "";

        const categories = props.categories?.select?.name?[props.categories.select.name]: [];
        // Extract cover image - it's in files array
        const cover =
          props.cover?.files?.[0]?.external?.url ||
          props.cover?.files?.[0]?.file?.url ||"";
        // Extract published status
        const published = props.published?.checkbox || false;
        // Generate blur image if cover exists
        const blurData = cover ? await getBlurImage(cover) : { base64: "" };
        const desc = props.desc?.rich_text?.[0]?.plain_text || "untitled";

        return {
          id: page.id,
          title,
          slug,
          categories,
          cover,
          published,
          blurUrl: blurData.base64,
          desc,
        };
      })
    );
    
    return allPost;
  } catch (err) {
    console.error("❌ Error fetching posts from Notion:", err);
    throw err;
  }
}
