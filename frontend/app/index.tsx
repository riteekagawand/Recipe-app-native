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

        if (token) {
          router.replace("/(tabs)/home"); // Go to main app immediately
        } else {
          router.replace("/login"); // Go to login immediately
        }
      } catch (error) {
        console.error("Error checking token:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <Splash />; // Splash shows only while loading
  }

  return null;
}
