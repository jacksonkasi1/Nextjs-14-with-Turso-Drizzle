import { db } from "@/db";
import { users, profile, Users, Profile } from "@/db/schema/users";

export async function POST(req: Request) {
  const body = await req.json(); // Assuming body is an array of user objects

  console.log(body);

  // Start a transaction
  const response = await db.transaction(async (trx) => {
    // Insert users in bulk and retrieve their IDs
    const insertedUsers = await trx
      .insert(users)
      .values(
        body.map((user: Users) => ({
          name: user.name,
          email: user.email,
        })),
      )
      .returning();

    if (!insertedUsers.length) {
      throw new Error("Bulk user creation failed");
    }

    // Prepare profile data with corresponding user IDs
    const profileData = body.map((user: Profile, index: number) => ({
      bio: user.bio,
      userId: insertedUsers[index].id, // Mapping user ID to profile
    }));

    // Insert profiles in bulk
    const insertedProfiles = await trx
      .insert(profile)
      .values(profileData)
      .returning();

    // Return the inserted data

    return { users: insertedUsers, profiles: insertedProfiles };
  });
  return new Response(JSON.stringify(response));
}
