import React, { useEffect, useState, useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { sendMessage, subscribeToMessages } from "../../firebase/chatService";

export default function ChatScreen() {
  const { buyerId, sellerId } = useLocalSearchParams();
  const router = useRouter();
  const chatId = [buyerId, sellerId].sort().join("_"); // unique chat id
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("[ChatScreen] Mounted with params:", { buyerId, sellerId, chatId });

    if (!chatId || !buyerId || !sellerId) {
      console.error("[ChatScreen] Missing required params!");
      setError("Missing user information");
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToMessages(chatId, (msgs) => {
      console.log("[ChatScreen] Firebase callback received:", msgs.length, "messages");
      console.log("[ChatScreen] Raw messages from Firebase:", JSON.stringify(msgs, null, 2));

      if (!msgs || msgs.length === 0) {
        console.log("[ChatScreen] No messages found, setting empty state");
        setMessages([]);
        setLoading(false);
        return;
      }

      // Convert Firestore format → GiftedChat format
      const formatted = msgs.map((m) => {
        const timestamp = m.timestamp;
        console.log("[ChatScreen] Message timestamp type:", typeof timestamp, "value:", timestamp);

        let createdAt;
        if (timestamp && typeof timestamp.toDate === 'function') {
          createdAt = timestamp.toDate();
        } else if (timestamp instanceof Date) {
          createdAt = timestamp;
        } else {
          createdAt = new Date();
        }

        const formattedMsg = {
          _id: m.id,
          text: m.text || "",
          createdAt: createdAt,
          user: { _id: m.senderId },
        };
        console.log("[ChatScreen] Formatted message:", formattedMsg);
        return formattedMsg;
      });

      console.log("[ChatScreen] All formatted messages:", JSON.stringify(formatted, null, 2));
      setMessages(formatted);
      setLoading(false);
      setError(null);
    });

    return () => {
      console.log("[ChatScreen] Unsubscribing from messages");
      unsubscribe();
    };
  }, [chatId, buyerId, sellerId]);

  const onSend = useCallback((newMessages = []) => {
    console.log("[ChatScreen] onSend called with:", newMessages);

    const msg = newMessages[0];
    if (msg?.text) {
      // Properly format message for local state
      const formattedLocalMsg = {
        _id: msg._id || `${Date.now()}`,
        text: msg.text,
        createdAt: msg.createdAt || new Date(),
        user: { _id: buyerId },
      };

      console.log("[ChatScreen] Adding message to local state:", formattedLocalMsg);

      // Immediately add to local state for instant UI feedback
      setMessages((previousMessages) => {
        console.log("[ChatScreen] Previous messages count:", previousMessages.length);
        const updated = [formattedLocalMsg, ...previousMessages];
        console.log("[ChatScreen] Updated messages count:", updated.length);
        return updated;
      });

      // Send to Firebase
      console.log("[ChatScreen] Sending to Firebase:", { chatId, buyerId, sellerId, text: msg.text });
      sendMessage(chatId, buyerId, sellerId, msg.text);
    }
  }, [chatId, buyerId, sellerId]);

  return (
    <View className="flex-1 bg-campus-pearl">
      {/* HEADER */}
      <View className="bg-campus-forest px-6 py-4 pt-12 pb-6 flex-row items-center justify-between ">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-title-lg font-semibold">Chat</Text>
        </View>
      </View>

      {/* ERROR STATE */}
      {error && (
        <View className="bg-red-100 px-4 py-3 mx-4 mt-4 rounded-campus">
          <Text className="text-error text-body-md">{error}</Text>
        </View>
      )}

      {/* CHAT AREA */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-campus-slate">Loading messages...</Text>
        </View>
      ) : (
        <GiftedChat
          messages={messages}
          onSend={(msgs) => onSend(msgs)}
          user={{ _id: buyerId }}
          renderBubble={(props) => {
            const { wrapperStyle } = props;
            return (
              <View
                style={[
                  wrapperStyle,
                  {
                    marginBottom: 8,
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: props.position === "left" ? "#8EA77B" : "#2D473E",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    marginHorizontal: 8,
                  }}
                >
                  <Text
                    style={{
                      color: props.position === "left" ? "#2D473E" : "white",
                      fontSize: 14,
                    }}
                  >
                    {props.currentMessage?.text}
                  </Text>
                </View>
              </View>
            );
          }}
          textInputProps={{
            placeholder: "Type a message...",
            placeholderTextColor: "#788881",
            style: {
              color: "#2D473E",
              backgroundColor: "#F6F2EE",
              borderTopWidth: 1,
              borderTopColor: "#ABB2B0",
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginHorizontal: 8,
              marginVertical: 12,
              borderRadius: 12,
              fontSize: 14,
              flex: 1,
            },
          }}
        />
      )}
    </View>
  );
}
