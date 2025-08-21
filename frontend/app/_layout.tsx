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
    prefixes: ["recipebook://"], // 👈 matches your app.json scheme
    config: {
      screens: {
        index: "home",
        "recipe/[id]": "recipe/:id",
        "add-recipe": "add-recipe",
      },
    },
  };


  return (
    <ApolloProvider client={client}>
      <TamaguiProvider config={config}>
        <SafeAreaProvider>
          {/* Force react-navigation to light mode */}
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
              <Stack.Screen name="add" options={{headerShown: false}} />
              <Stack.Screen name="recipe/[id]" options={{ title: "Recipe Details" }} />
              <Stack.Screen name="profile" options={{ title: "Profile Details"}} />
              <Stack.Screen name="categories" options={{ title: "Recipe Categories "}} />
              <Stack.Screen
    name="CategoryRecipes"
    options={{ title: "Recipes by Category" }}
  />
              <Stack.Screen name="+not-found" />
            </Stack>
            {/* Force light status bar */}
            <StatusBar style="dark" />
          </ThemeProvider>
        </SafeAreaProvider>
      </TamaguiProvider>
 
    </ApolloProvider>
       );
}
