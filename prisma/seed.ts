import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create some games
  const games = [
    {
      name: "Call of Duty: Mobile",
      platform: "Mobile",
      apiEndpoint: "https://api.codm.example.com",
      isActive: true,
    },
    {
      name: "PUBG Mobile",
      platform: "Mobile",
      apiEndpoint: "https://api.pubgm.example.com",
      isActive: true,
    },
    {
      name: "FIFA 24",
      platform: "Console",
      apiEndpoint: "https://api.fifa24.example.com",
      isActive: true,
    },
    {
      name: "Fortnite",
      platform: "Cross-platform",
      apiEndpoint: "https://api.fortnite.example.com",
      isActive: true,
    },
    {
      name: "Apex Legends",
      platform: "Cross-platform",
      apiEndpoint: "https://api.apex.example.com",
      isActive: true,
    },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { name: game.name },
      update: game,
      create: game,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
