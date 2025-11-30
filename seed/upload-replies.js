/**
 * EmployPilot - Reply Seed Import Script
 * Usage:
 *   node upload-replies.js employpilot-replies-seed-v1.json
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
  console.log("   node upload-replies.js employpilot-replies-seed-v1.json\n");
  process.exit(1);
}

const seedFile = args[0];
const filePath = path.join(__dirname, seedFile);

if (!fs.existsSync(filePath)) {
  console.error(`❌ ERROR: File not found: ${filePath}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(filePath));
} catch (err) {
  console.error("❌ ERROR: Seed file is not valid JSON.");
  process.exit(1);
}

// Validate structure
if (!data.community_posts || typeof data.community_posts !== "object") {
  console.error("❌ ERROR: Seed file missing 'community_posts' object.");
  process.exit(1);
}

// ------------------------------
// 4️⃣ UPLOAD LOGIC
// ------------------------------
async function uploadReplies() {
  console.log("\n🔥 Starting EmployPilot Reply Seed Import...");
  console.log(`📄 File: ${seedFile}`);

  const posts = data.community_posts;
  const postIds = Object.keys(posts);

  console.log(`📌 Total posts with replies: ${postIds.length}\n`);

  let totalReplies = 0;

  for (const postId of postIds) {
    const replyList = posts[postId].replies || [];

    console.log(`➡ Uploading ${replyList.length} replies for post: ${postId}`);

    for (const reply of replyList) {
      try {
        await db
          .collection("community_posts")
          .doc(postId)
          .collection("replies")
          .add(reply);

        totalReplies++;
      } catch (err) {
        console.error(`❌ Error uploading reply for post ${postId}:`, err);
      }
    }
  }

  console.log("\n🎉 Reply import completed successfully!");
  console.log(`🧩 Total replies uploaded: ${totalReplies}\n`);

  process.exit(0);
}

// Execute import
uploadReplies();
