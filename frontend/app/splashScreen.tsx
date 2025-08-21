// app/splashScreen.tsx
import React from "react";
import { ImageBackground } from "react-native";
import { useRouter, Stack } from "expo-router";
import { YStack, Text, Button, Image } from "tamagui";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../assets/images/splash-bg.png")}
        style={{ flex: 1, width: "100%", height: "100%" }}
        resizeMode="cover"
      >
        <YStack flex={1} backgroundColor="rgba(0,0,0,0.4)" padding={24}>

          {/* TOP ICON + TEXT */}
          <YStack alignItems="center" marginTop={60}>
            <Image
              source={require("../assets/images/splash-icon.png")}
              width={70}
              height={70}
              resizeMode="contain"
              style={{ marginBottom: 12 }}
            />
            <Text color="white" fontSize={16} fontWeight="500">
              100K+ Premium Recipe
            </Text>
          </YStack>

          {/* MIDDLE TITLE */}
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Text
              fontSize={40}
              fontWeight="700"
              color="white"
              textAlign="center"
              style={{ lineHeight: 50, marginBottom: 12 }}
            >
              Get{"\n"}Cooking
            </Text>
            <Text fontSize={16} color="white" opacity={0.8} textAlign="center">
              Simple way to find Tasty Recipe
            </Text>
          </YStack>

          {/* BOTTOM BUTTON */}
          <YStack alignItems="center" marginBottom={70}>
            <Button
              backgroundColor="#00B761"
              borderRadius={30}
              paddingHorizontal={60}
              paddingVertical={10}
              height={60}
              onPress={() => router.push("/login")}
            >
              <Text color="white" fontSize={18} fontWeight="600">
                Start Cooking →
              </Text>
            </Button>
          </YStack>
        </YStack>
      </ImageBackground>
    </>
  );
}
