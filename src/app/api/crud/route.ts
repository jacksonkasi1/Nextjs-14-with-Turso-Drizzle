import { db } from "@/db";
import { chats } from "@/db/schema/chats";

export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  const chat = await db.insert(chats).values({
    id: body.id,
    name: body.name,
    text: body.text,
  });

  return new Response(JSON.stringify(chat));
}

export async function GET() {
  const response: any = await db
    .select()
    .from(chats)

  return new Response(JSON.stringify(response));
}