import { db } from "@/db";
import { categories, postCategories } from "@/db/schema/users";
import { desc, eq } from "drizzle-orm";

export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  const category = await db.insert(categories).values({
    name: body.name,
  });

  return new Response(JSON.stringify(category));
}

export async function PUT(req: Request) {
  const body = await req.json();

  const postCategory = await db.insert(postCategories).values({
    postId: body.postId,
    categoryId: body.categoryId,
  });

  return new Response(JSON.stringify(postCategory));
}

export async function GET() {
  const response = await db
    .select()
    .from(categories)
    .orderBy(desc(categories.id));

  return new Response(JSON.stringify(response));
}