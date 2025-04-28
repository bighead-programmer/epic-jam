const { execSync } = require("child_process")

try {
  console.log("Running Prisma Generate...")
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("Prisma Generate completed successfully!")
} catch (error) {
  console.error("Error running Prisma Generate:", error)
  process.exit(1)
}
