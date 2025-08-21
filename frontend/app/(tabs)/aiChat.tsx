import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { YStack } from "tamagui";

const GEMINI_API_KEY = "AIzaSyCfpAgam0ZIE1GNZDJFFjC2rie-xKfatzk"; // ⚠️ replace with your key

export default function AiChatScreen() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userMessage.text }] }],
          }),
        }
      );

      const data = await res.json();
      console.log("Gemini response:", data);

      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Sorry, no response.";

      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Gemini error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Error talking to AI" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack flex={1} padding={16}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: item.role === "user" ? "#007AFF" : "#EEE",
              padding: 10,
              borderRadius: 10,
              marginVertical: 4,
              maxWidth: "80%",
            }}
          >
            <Text style={{ color: item.role === "user" ? "white" : "black" }}>
              {item.text}
            </Text>
          </View>
        )}
      />

      {loading && (
        <ActivityIndicator size="small" color="gray" style={{ marginVertical: 8 }} />
      )}

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 8,
            padding: 10,
          }}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </YStack>
  );
}
