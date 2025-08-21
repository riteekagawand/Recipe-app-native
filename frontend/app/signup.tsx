import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { ScrollView, SafeAreaView } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Button,
  Image,
  Separator,
  Theme,
  Checkbox,
  Label,
} from "tamagui";
import { Check } from "@tamagui/lucide-icons";
import { gql, useMutation } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      name
      email
      token
    }
  }
`;

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async () => {
    try {
      const { data } = await signup({
        variables: {
          name,
          email,
          password,
        },
      });

      console.log("Signup success:", data);
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
            <YStack gap={16} justifyContent="center">
              {/* Heading */}
              <Text fontSize={22} fontWeight="700" marginTop={40} color="black">
                Create an account
              </Text>
              <Text fontSize={14} color="#666">
                Let’s help you set up your account, it won’t take long.
              </Text>

              {/* Name */}
              <Text fontSize={14} fontWeight="600" color="black">
                Name
              </Text>
              <TextInputField
                placeholder="Enter Name"
                value={name}
                onChangeText={setName}
              />

              {/* Email */}
              <Text fontSize={14} fontWeight="600" color="black">
                Email
              </Text>
              <TextInputField
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              {/* Password */}
              <Text fontSize={14} fontWeight="600" color="black">
                Password
              </Text>
              <TextInputField
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {/* Confirm Password */}
              <Text fontSize={14} fontWeight="600" color="black">
                Confirm Password
              </Text>
              <TextInputField
                placeholder="Retype Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              {/* Accept Terms */}
              <XStack alignItems="center" gap={8} marginTop={8}>
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(val) => setAcceptedTerms(val === true)}
                  borderColor="#ddd"
                  size="$4"
                >
                  <Checkbox.Indicator>
                    <Check size={16} color="white" />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label
                  htmlFor="terms"
                  fontSize={14}
                  color="#f59e0b"
                  fontWeight="600"
                >
                  Accept Terms & Conditions
                </Label>
              </XStack>

              {/* Sign Up Button */}
              <Button
                backgroundColor={acceptedTerms ? "#146c43" : "#9ca3af"}
                pressStyle={{
                  backgroundColor: acceptedTerms ? "#065f46" : "#9ca3af",
                }}
                borderRadius={12}
                onPress={handleSignup}
                height={54}
                disabled={!acceptedTerms || loading}
                justifyContent="center"
                alignItems="center"
                marginTop={12}
              >
                <Text color="white" fontSize={18} fontWeight="700">
                  {loading ? "Signing Up..." : "Sign Up"}
                </Text>
              </Button>

              {/* Divider */}
              <XStack alignItems="center" justifyContent="center" gap={8}>
                <Separator flex={1} borderColor="#ddd" />
                <Text color="#666" fontSize={14}>
                  Or Sign in With
                </Text>
                <Separator flex={1} borderColor="#ddd" />
              </XStack>

              {/* Social Buttons */}
              <XStack justifyContent="center" gap={16}>
                <SocialButton source={require("../assets/images/google.png")} />
                <SocialButton source={require("../assets/images/facebook.png")} />
              </XStack>

              {/* Already a member */}
              <XStack justifyContent="center" gap={4}>
                <Text fontSize={14}>Already a member? </Text>
                <Text
                  fontSize={14}
                  color="#f59e0b"
                  fontWeight="600"
                  onPress={() => router.push("/login")}
                >
                  Sign In
                </Text>
              </XStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </Theme>
    </>
  );
}

/* ----------------- Reusable Components ----------------- */

import { TextInput } from "react-native";

function TextInputField(props: any) {
  return (
    <TextInput
      {...props}
      style={{
        height: 48,
        borderRadius: 8,
        backgroundColor: "white",
        borderColor: "#ddd",
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 16,
      }}
    />
  );
}

function SocialButton({ source }: { source: any }) {
  return (
    <Button
      height={50}
      width={50}
      borderRadius={25}
      backgroundColor="#f9f9f9"
      shadowColor="rgba(0,0,0,0.1)"
      elevationAndroid={2}
      justifyContent="center"
      alignItems="center"
    >
      <Image source={source} width={28} height={28} resizeMode="contain" />
    </Button>
  );
}
