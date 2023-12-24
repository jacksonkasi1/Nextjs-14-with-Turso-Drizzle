import { db } from "@/db";
import { chats } from "@/db/schema/chats";
import {
  gte,
  lt,
  inArray,
  notInArray,
  between,
  asc,
  desc,
  ilike,
  and,
  or,
  like,
  lte,
} from "drizzle-orm";

export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  const chat = await db.insert(chats).values({
    // id: body.id,
    name: body.name,
    text: body.text,
    type: "private",
  });

  return new Response(JSON.stringify(chat));
}

export async function GET() {
  const response: any = await db
    .select()
    .from(chats)
    .where(and(like(chats.name, "%ja%"), or(gte(chats.id, 10), lte(chats.id, 0))))
    .orderBy(desc(chats.id));

  return new Response(JSON.stringify(response));
}
