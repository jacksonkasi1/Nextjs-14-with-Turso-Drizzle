import { db } from "@/db";
import { categories, postCategories, posts, users } from "@/db/schema/users";
import { desc, eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET() {
  const response = await db.query.posts.findMany({
    columns: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });

  const response2 = await db
    .select()
    .from(posts)
    .limit(10)
    .orderBy(desc(posts.id))
    .leftJoin(users, eq(users.id, posts.authorId))
    .leftJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(categories.id, postCategories.categoryId))
    .groupBy(posts.id)
    .execute();

  return new Response(JSON.stringify(response));
}
