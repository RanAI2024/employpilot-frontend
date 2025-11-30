/**
 * Safe Reaction Booster - Single Post Only
 *
 * Boosts reactions for ONE specific post only.
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 👇 ONLY THIS POST WILL BE BOOSTED
const TARGET_POST_ID = "6lD0qRUWdyLxt7YrIOhH";

async function boostSinglePost() {
  console.log("\n🔥 Boosting reactions for Welcome Post...\n");

  const postRef = db.collection("community_posts").doc(TARGET_POST_ID);

  const reactions = {
    like: 31,
    celebrate: 8,
    insightful: 5,
    support: 6,
    funny: 1,
  };

  try {
    await postRef.update({
      reactions,
      updatedAt: Date.now(),
    });

    console.log("✔ Boost successful!");
    console.log("📌 Updated reactions:", reactions);
  } catch (err) {
    console.error("❌ Error boosting post:", err);
  }

  process.exit(0);
}

boostSinglePost();
