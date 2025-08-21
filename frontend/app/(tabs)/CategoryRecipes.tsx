import React from "react";
import { ScrollView, Pressable } from "react-native";
import { YStack, Text, Card, Image, XStack } from "tamagui";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, gql } from "@apollo/client";
import { Clock } from "@tamagui/lucide-icons";

// GraphQL query to fetch all recipes
const GET_RECIPES_BY_CATEGORY = gql`
  query GetRecipes {
    recipes {
      _id
      title
      image
      category
      createdAt
      user {
        _id
        name
      }
    }
  }
`;

export default function CategoryRecipesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params as { category: string };
  const { loading, error, data } = useQuery(GET_RECIPES_BY_CATEGORY);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  // Filter recipes by selected category
  const recipes = data.recipes.filter((r: any) => r.category === category);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text fontSize={28} fontWeight="700" marginBottom={16}>
        Recipes in {category}
      </Text>

      <YStack space="$3">
        {recipes.map((recipe: any) => (
          <Pressable
            key={recipe._id}
            onPress={() =>
              navigation.navigate("recipe/[id]", { id: recipe._id })
            }
          >
            <Card elevation={3} bordered borderRadius="$8" overflow="hidden">
              <Image
                source={{ uri: recipe.image || "https://via.placeholder.com/150" }}
                height={120}
                width="100%"
              />
              <YStack padding="$3" space="$2">
                <Text fontSize="$5" fontWeight="700">
                  {recipe.title}
                </Text>
                <XStack alignItems="center" space="$2">
                  <Clock size={14} color="gray" />
                  <Text color="$gray10" fontSize="$3">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </Text>
                </XStack>
              </YStack>
            </Card>
          </Pressable>
        ))}
      </YStack>
    </ScrollView>
  );
}
