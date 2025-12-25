import { PrismaClient } from "@prisma/client";
import { fakerEN as faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const NUM_USERS = 10;
const MAX_POSTS_PER_USER = 10;
const MAX_COMMENTS_PER_POST = 15;
const MAX_LIKES_PER_POST = 15;
const SALT_ROUNDS = 10;

async function main() {
  console.log("Seeding started...");

  const usersData = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const plainPassword = "password123";
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    usersData.push({
      firstName: firstName,
      lastName: lastName,

      username: faker.internet
        .email({ firstName: firstName, lastName: lastName })
        .split("@")[0],

      email: faker.internet
        .email({ firstName: firstName, lastName: lastName })
        .toLowerCase(),
      password: hashedPassword,
    });
  }

  const createdUsers = await prisma.user.createManyAndReturn({
    data: usersData,
  });
  console.log(`${createdUsers.length} Users created.`);

  const postsData = [];
  createdUsers.forEach((user) => {
    const numPosts = faker.number.int({ min: 1, max: MAX_POSTS_PER_USER });
    for (let j = 0; j < numPosts; j++) {
      postsData.push({
        user_id: user.id,
        title: faker.lorem.sentence({ min: 5, max: 10 }),
        content: faker.lorem.paragraphs({ min: 3, max: 8 }),
      });
    }
  });

  const createdPosts = await prisma.post.createManyAndReturn({
    data: postsData,
  });
  console.log(`${createdPosts.length} Posts created.`);

  for (const post of createdPosts) {
    const numComments = faker.number.int({
      min: 0,
      max: MAX_COMMENTS_PER_POST,
    });
    const commenters = faker.helpers.arrayElements(createdUsers, numComments);

    for (const commenter of commenters) {
      await prisma.comment.create({
        data: {
          post_id: post.id,
          user_id: commenter.id,
          text: faker.lorem.sentence({ min: 5, max: 15 }),
        },
      });
    }

    const numLikes = faker.number.int({ min: 0, max: MAX_LIKES_PER_POST });
    const likers = faker.helpers.arrayElements(createdUsers, numLikes);

    for (const liker of likers) {
      try {
        await prisma.like.create({
          data: {
            post_id: post.id,
            user_id: liker.id,
          },
        });
      } catch (e) {
        if (e.code === "P2002") {
          continue;
        }
        throw e;
      }
    }
  }

  console.log(`Comments and Likes successfully created for all posts.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Seeding finished.");
  });
