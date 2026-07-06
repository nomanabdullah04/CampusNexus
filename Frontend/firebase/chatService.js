import { db } from "./firebase.config";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";

// Send a new message
export const sendMessage = async (chatId, senderId, receiverId, text) => {
  try {
    console.log("[Firebase] Attempting to send message:", { chatId, senderId, receiverId, text });
    const docRef = await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId,
      receiverId,
      text,
      timestamp: serverTimestamp(),
    });
    console.log("[Firebase] ✅ Message sent successfully! Doc ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[Firebase] ❌ Error sending message:", error.message);
    console.error("[Firebase] Error code:", error.code);
    console.error("[Firebase] Error details:", error);
    throw error;
  }
};

// Get all existing messages (for initial load)
export const getExistingMessages = async (chatId) => {
  try {
    console.log("[Firebase] Fetching existing messages for chatId:", chatId);
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("[Firebase] ✅ Fetched", messages.length, "existing messages");
    return messages;
  } catch (error) {
    console.error("[Firebase] ❌ Error fetching existing messages:", error.message);
    console.error("[Firebase] Error code:", error.code);
    return [];
  }
};

// Listen for new messages (real-time)
export const subscribeToMessages = (chatId, callback) => {
  console.log("[Firebase] Setting up real-time listener for chatId:", chatId);
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "desc") // newest first for proper chat order
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      console.log("[Firebase] ✅ Real-time update received:", snapshot.docs.length, "messages");
      const messages = snapshot.docs.map((doc) => {
        console.log("[Firebase] Message doc:", { id: doc.id, data: doc.data() });
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      callback(messages);
    },
    (error) => {
      console.error("[Firebase] ❌ Error in real-time listener:", error.message);
      console.error("[Firebase] Error code:", error.code);
      console.error("[Firebase] Error details:", error);
      // Call callback with empty array to avoid hanging
      callback([]);
    }
  );

  return unsubscribe;
};
