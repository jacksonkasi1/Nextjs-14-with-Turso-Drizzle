import { db } from "@/db";
import { posts, users } from "@/db/schema/users";
import { desc, eq } from "drizzle-orm";

export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  // check author exist

  const author = await db
    .select()
    .from(users)
    .where(eq(users.id, body.authorId));

  if (!author.length) {
    return new Response(JSON.stringify({ error: "Author not found" }));
  }

  const post = await db.insert(posts).values({
    title: body.title,
    content: body.content,
    authorId: body.authorId,
  });

  return new Response(JSON.stringify(post));
}

export async function GET() {
  const response: any = await db.query.posts.findMany({
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });
  
  return new Response(JSON.stringify(response));
}
