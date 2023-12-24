import { db } from "@/db";
import { users, profile } from "@/db/schema/users";

export const runtime = "edge";

export async function GET() {
  const response: any = await db.query.users.findMany({
    with: {
      profile: true,
    },
  });

  console.log(response);

  return new Response(JSON.stringify(response));
}

export async function POST(req: Request) {
  const body = await req.json();

  // Start a transaction
  const response = await db.transaction(async (trx) => {
    // Insert user data
    const user = await trx
      .insert(users)
      .values({
        name: body.name,
        email: body.email,
      })
      .returning()

    console.log(user);

    // Check if user was successfully created
    if (!user.length) {
      throw new Error("User creation failed");
    }

    // Insert profile data
    const userProfile = await trx
      .insert(profile)
      .values({
        bio: body.bio,
        userId: user[0].id, // Assuming 'id' is the primary key in the users table
      })
      .returning();

    // Return combined user and profile data
    return { user, userProfile };
  })

  return new Response(JSON.stringify(response));
}
