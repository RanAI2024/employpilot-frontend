/**
 * EmployPilot - Firestore Seed Import Script
 * Usage:
 *   node upload.js employpilot-forum-seed-v3.json
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// ------------------------------
// 1️⃣ LOAD SERVICE ACCOUNT
// ------------------------------
const serviceAccount = require("./serviceAccountKey.json");

// ------------------------------
// 2️⃣ INIT FIREBASE ADMIN
// ------------------------------
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ------------------------------
// 3️⃣ LOAD SEED FILE
// ------------------------------
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("\n❌ ERROR: No seed file provided.\n");
  console.log("Usage example:");
  console.log("   node upload.js employpilot-forum-seed-v3.json\n");
  process.exit(1);
}

const seedFile = args[0];
const filePath = path.join(__dirname, seedFile);

if (!fs.existsSync(filePath)) {
  console.error(`❌ ERROR: File not found: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath);
let data;

try {
  data = JSON.parse(raw);
} catch (err) {
  console.error("❌ ERROR: Seed file is not valid JSON.");
  process.exit(1);
}

if (!data.community_posts || !Array.isArray(data.community_posts)) {
  console.error("❌ ERROR: Seed file missing 'community_posts' array.");
  process.exit(1);
}

// ------------------------------
// 4️⃣ IMPORT LOGIC
// ------------------------------
async function uploadSeed() {
  console.log("\n🔥 Starting EmployPilot Seed Import...");
  console.log(`📄 File: ${seedFile}`);
  console.log("⏳ Uploading posts...\n");

  const posts = data.community_posts;
  let count = 0;

  for (const post of posts) {
    try {
      await db.collection("community_posts").add(post);
      count++;
      console.log(`✔ Uploaded post ${count}/${posts.length}`);
    } catch (err) {
      console.error("❌ Failed to upload post:", err);
      process.exit(1);
    }
  }

  console.log("\n🎉 Seed import completed successfully!");
  console.log(`📌 Total posts uploaded: ${count}\n`);
  process.exit(0);
}

// Run the import
uploadSeed();
