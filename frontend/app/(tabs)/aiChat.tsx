import React, { useState } from "react";
import { TextInput, Button, FlatList, ActivityIndicator } from "react-native";
import { YStack, XStack, View, Text } from "tamagui";
import { GEMINI_API_KEY } from "@env"; // ✅ load from .env

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
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Sorry, no response.";

      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Gemini error:", error);
      setMessages((prev) => [...prev, { role: "ai", text: "❌ Error talking to AI" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack flex={1} padding={16} backgroundColor="white">
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: item.role === "user" ? "#10B981" : "#E5E7EB",
              padding: 10,
              borderRadius: 12,
              marginVertical: 4,
              maxWidth: "80%",
            }}
          >
            <Text color={item.role === "user" ? "white" : "black"}>{item.text}</Text>
          </View>
        )}
      />

      {loading && (
        <ActivityIndicator size="small" color="gray" style={{ marginVertical: 8 }} />
      )}

      <XStack marginTop={10} alignItems="center">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 8,
            padding: 10,
            marginRight: 8,
          }}
        />
        <Button title="Send" onPress={sendMessage} />
      </XStack>
    </YStack>
  );
}
