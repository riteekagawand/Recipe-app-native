import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, SafeAreaView, TextInput, Alert } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Button,
  Separator,
  Image,
  Theme,
} from "tamagui";
import { ArrowRight } from "@tamagui/lucide-icons";
import { gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
      token
    }
  }
`;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      try {
        const token = data?.login?.token;
        if (token) {
          await AsyncStorage.setItem("token", token); // ✅ save token
        }
        Alert.alert("Success", "Logged in successfully!");
        router.push("/(tabs)/home"); // redirect after login
      } catch (err) {
        console.error("Token storage error:", err);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      Alert.alert("Error", error.message);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    loginUser({ variables: { email, password } });
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          <YStack gap={24} justifyContent="flex-start">
            {/* Header */}
            <YStack gap={4} marginTop={32}>
              <Text fontSize={28} fontWeight="700" marginTop={30} color="black">
                Hello,
              </Text>
              <Text fontSize={18} color="black">
                Welcome Back!
              </Text>
            </YStack>

            {/* Form */}
            <YStack gap={16}>
              <Text fontSize={14} fontWeight="600" marginTop={30} color="black">
                Email
              </Text>
              <TextInput
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={{
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: "white",
                  borderColor: "#D1D5DB",
                  borderWidth: 1,
                  paddingHorizontal: 12,
                }}
              />

              <Text fontSize={14} fontWeight="600" color="black">
                Enter Password
              </Text>
              <TextInput
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: "white",
                  borderColor: "#D1D5DB",
                  borderWidth: 1,
                  paddingHorizontal: 12,
                }}
              />

              <Text
                alignSelf="flex-end"
                color="#F59E0B"
                fontSize={13}
                onPress={() => {}}
              >
                Forgot Password?
              </Text>

              {/* Sign In Button */}
              <Button
                height={54}
                borderRadius={10}
                backgroundColor="#047857"
                pressStyle={{ backgroundColor: "#065F46" }}
                marginTop={16}
                justifyContent="center"
                alignItems="center"
                flexDirection="row"
                onPress={handleLogin}
                disabled={loading}
              >
                <Text
                  color="white"
                  fontSize={16}
                  fontWeight="700"
                  marginRight={8}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
                <ArrowRight size={18} color="white" />
              </Button>

              {/* Divider */}
              <XStack
                alignItems="center"
                justifyContent="center"
                gap={8}
                marginTop={24}
              >
                <Separator flex={1} borderColor="#E5E7EB" />
                <Text color="#6B7280" fontSize={13}>
                  Or Sign In With
                </Text>
                <Separator flex={1} borderColor="#E5E7EB" />
              </XStack>

              {/* Social buttons */}
              <XStack justifyContent="center" gap={16} marginTop={16}>
                <Button
                  height={50}
                  width={50}
                  borderRadius={10}
                  borderColor="#E5E7EB"
                  borderWidth={1}
                  backgroundColor="white"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image
                    source={require("../assets/images/google.png")}
                    width={28}
                    height={28}
                    resizeMode="contain"
                  />
                </Button>
                <Button
                  height={50}
                  width={50}
                  borderRadius={10}
                  borderColor="#E5E7EB"
                  borderWidth={1}
                  backgroundColor="white"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image
                    source={require("../assets/images/facebook.png")}
                    width={28}
                    height={28}
                    resizeMode="contain"
                  />
                </Button>
              </XStack>

              {/* Signup row */}
              <XStack justifyContent="center" marginTop={24}>
                <Text fontSize={13} color="black">
                  Don’t have an account?{" "}
                </Text>
                <Text
                  fontSize={13}
                  color="#F59E0B"
                  fontWeight="700"
                  onPress={() => router.push("/signup")}
                >
                  Sign up
                </Text>
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
}
