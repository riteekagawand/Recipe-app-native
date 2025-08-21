// app/index.tsx
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Splash from "./splashScreen";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        // Add a small delay so splash is visible
        setTimeout(() => {
          // Ensure router is ready
          if (!router) return;

          if (token) {
            router.replace("/(tabs)"); // Go to main app
          } else {
            router.replace("/login"); // Go to login
          }

          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error checking token:", error);
        if (router) router.replace("/login");
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <Splash />; // Show splash screen while checking
  }

  return null;
}
