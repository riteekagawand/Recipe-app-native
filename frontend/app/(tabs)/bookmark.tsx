import { View, Text } from "react-native";
import { YStack } from "tamagui";

export default function HomeScreen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding={16}>
      <Text fontSize={24} fontWeight="700" color="black">
        Welcome to the Bookmark Screen!
      </Text>
    </YStack>
  );
}