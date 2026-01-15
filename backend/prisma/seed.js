const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Check if data already exists
  const existingLabels = await prisma.label.count();
  const existingMembers = await prisma.member.count();
  const existingBoards = await prisma.board.count();

  if (existingLabels > 0 || existingMembers > 0 || existingBoards > 0) {
    console.log("✅ Database already seeded. Skipping seed.");
    return;
  }

  console.log("🌱 Starting database seed...");

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({ data: { name: "Frontend", color: "#61bd4f" } }),
    prisma.label.create({ data: { name: "Backend", color: "#f2d600" } }),
    prisma.label.create({ data: { name: "Bug", color: "#eb5a46" } }),
    prisma.label.create({ data: { name: "Feature", color: "#c377e0" } }),
    prisma.label.create({ data: { name: "Urgent", color: "#ff9f1a" } }),
  ]);

  // Create members
  const members = await Promise.all([
    prisma.member.create({
      data: {
        name: "Adarsh Rai",
        email: "adarsh@example.com",
        avatar: "https://ui-avatars.com/api/?name=Adarsh+Rai&background=0079bf&color=fff",
      },
    }),
    prisma.member.create({
      data: {
        name: "Ram Kumar",
        email: "ram@example.com",
        avatar: "https://ui-avatars.com/api/?name=Ram+Kumar&background=eb5a46&color=fff",
      },
    }),
    prisma.member.create({
      data: {
        name: "Priya Sharma",
        email: "priya@example.com",
        avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=61bd4f&color=fff",
      },
    }),
  ]);

  // Create board with lists and cards
  const board = await prisma.board.create({
    data: {
      title: "Sample Board",
      lists: {
        create: [
          {
            title: "Todo",
            position: 1,
            cards: {
              create: [
                {
                  title: "Setup project",
                  description: "Initialize the project structure",
                  position: 1,
                  dueDate: new Date("2024-02-01"),
                  labels: {
                    create: [{ labelId: labels[1].id }], // Backend
                  },
                  cardMembers: {
                    create: [{ memberId: members[0].id }], // Adarsh
                  },
                  checklistItems: {
                    create: [
                      { title: "Create repository", completed: true, position: 1 },
                      { title: "Setup dependencies", completed: false, position: 2 },
                    ],
                  },
                },
                {
                  title: "Design database",
                  description: "Create database schema",
                  position: 2,
                  labels: {
                    create: [{ labelId: labels[1].id }], // Backend
                  },
                },
              ],
            },
          },
          {
            title: "In Progress",
            position: 2,
            cards: {
              create: [
                {
                  title: "Build backend",
                  description: "Implement API endpoints",
                  position: 1,
                  dueDate: new Date("2024-02-15"),
                  labels: {
                    create: [
                      { labelId: labels[1].id }, // Backend
                      { labelId: labels[3].id }, // Feature
                    ],
                  },
                  cardMembers: {
                    create: [{ memberId: members[1].id }], // Ram
                  },
                },
              ],
            },
          },
          {
            title: "Done",
            position: 3,
            cards: {
              create: [
                {
                  title: "Initialize repo",
                  description: "Setup Git repository",
                  position: 1,
                  labels: {
                    create: [{ labelId: labels[0].id }], // Frontend
                  },
                  checklistItems: {
                    create: [
                      { title: "Create README", completed: true, position: 1 },
                      { title: "Add .gitignore", completed: true, position: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeded board:", board.id);
  console.log("✅ Created", labels.length, "labels");
  console.log("✅ Created", members.length, "members");
  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
