// src/createUserDoc.js
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function createUserDocument(user) {
  if (!user) return;

  const uid = user.uid;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Create new user record
    await setDoc(ref, {
      email: user.email,
      created_at: serverTimestamp(),
      last_login: serverTimestamp(),

      // SaaS-specific fields
      subscription_active: false,
      is_pro: false,
      plan: null,
      subscription_expire: null,

      // Free plan benefit
      resume_credits: 1  
    });

    console.log("🔥 Firestore user CREATED:", uid);
  } else {
    // Update existing user with login timestamp
    await updateDoc(ref, {
      last_login: serverTimestamp()
    });

    console.log("🔄 Firestore user UPDATED:", uid);
  }
}
