import { prisma } from "@/lib/db/prisma";
async function main() {
  // Create a new user with a post
  const user = await prisma.profile.create({
    data: {
      display_name: "Alice",
      username: "alice",
      avatar_url: "https://example.com/avatar.png",
      avatar_path: "https://example.com/avatar.png",
      user_id: "123",
    },
    select: {
      display_name: true,
      username: true,
      avatar_url: true,
      avatar_path: true,
      user_id: true,
    },
  });
  console.log("Created user:", user);
  // Fetch all users with their posts
  const allUsers = await prisma.profile.findMany({
    select: {
      display_name: true,
      username: true,
      avatar_url: true,
      avatar_path: true,
      user_id: true,
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });