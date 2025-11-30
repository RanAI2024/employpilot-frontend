/**
 * CLEAN COMMUNITY v2 — Effective & Safe
 * Keeps:
 *  - Your welcome post
 *  - 30 most recent posts
 *  - Posts with 5+ reactions
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 🔒 Protect your main welcome post
const WELCOME_POST_ID = "6lD0qRUWdyLxt7YrIOhH";

async function cleanCommunity() {
  console.log("\n🧹 Starting Community Cleanup v2...");

  const postsRef = db.collection("community_posts");
  const snap = await postsRef.get();

  // Sort newest -> oldest
  const sorted = snap.docs.sort(
    (a, b) => b.data().createdAt - a.data().createdAt
  );

  // ⭐ KEEP last 30 newest posts
  const safeRecent = sorted.slice(0, 30).map((d) => d.id);

  let deleteCount = 0;

  for (const doc of sorted) {
    const id = doc.id;
    const data = doc.data();

    // ✔ Keep welcome post
    if (id === WELCOME_POST_ID) continue;

    // ✔ Keep newest 30
    if (safeRecent.includes(id)) continue;

    // ✔ Keep posts with meaningful reactions
    const reactions = data.reactions || {};
    const totalReactions = Object.values(reactions)
      .reduce((a, b) => a + (b || 0), 0);

    if (totalReactions >= 5) continue;

    // ❌ Delete everything else
    console.log(`🗑 Deleting post: ${id} — ${data.title}`);
    await doc.ref.delete();
    deleteCount++;
  }

  console.log(`\n✨ Cleanup Complete! Deleted: ${deleteCount} posts\n`);
  process.exit(0);
}

cleanCommunity();
