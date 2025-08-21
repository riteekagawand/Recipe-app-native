import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ApolloProvider } from "@apollo/client";

// Tamagui
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

// Safe area
import { SafeAreaProvider } from "react-native-safe-area-context";
import client from "@/apolloClient";

export default function RootLayout() {
  const linking = {
    prefixes: ["recipebook://"],
    config: {
      screens: {
        index: "home",
        "recipe/[id]": "recipe/:id",
        "add": "add-recipe",
        categories: "categories",
        "category/[category]": "category/:category", // ✅ deep link for category
        profile: "profile",
      },
    },
  };

  return (
    <ApolloProvider client={client}>
      <TamaguiProvider config={config}>
        <SafeAreaProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
              <Stack.Screen name="add" options={{ headerShown: false }} />
              <Stack.Screen name="recipe/[id]" options={{ title: "Recipe Details" }} />
              <Stack.Screen name="profile" options={{ title: "Profile Details" }} />
              <Stack.Screen name="categories" options={{ title: "Recipe Categories" }} />
              <Stack.Screen name="category/[category]" options={{ title: "Recipes by Category" }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="dark" />
          </ThemeProvider>
        </SafeAreaProvider>
      </TamaguiProvider>
    </ApolloProvider>
  );
}
