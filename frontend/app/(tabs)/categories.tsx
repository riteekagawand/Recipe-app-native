import React, { useMemo } from "react";
import { ScrollView, Pressable } from "react-native";
import { YStack, XStack, Text, Card, Image } from "tamagui";
import { useQuery, gql } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

// GraphQL query to get all recipes
const GET_RECIPES = gql`
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

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_RECIPES);

  // Generate categories dynamically from recipes
  const categories = useMemo(() => {
    if (!data?.recipes) return [];
    const map: Record<string, any[]> = {};
    data.recipes.forEach((recipe: any) => {
      if (recipe.category) {
        if (!map[recipe.category]) map[recipe.category] = [];
        map[recipe.category].push(recipe);
      }
    });
    // Convert to array of objects with count and thumbnail
    return Object.entries(map).map(([name, recipes]) => ({
      name,
      count: recipes.length,
      thumbnail: recipes[recipes.length - 1]?.image || "https://via.placeholder.com/150",
    }));
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text fontSize={28} fontWeight="700" marginBottom={16}>
        Categories
      </Text>

      <YStack space="$3">
        {categories.map((category) => (
          <Pressable
            key={category.name}
            onPress={() =>
              navigation.navigate("CategoryRecipes", { category: category.name })
            }
          >
            <Card elevation={3} bordered borderRadius="$8" overflow="hidden">
              <Image
                source={{ uri: category.thumbnail }}
                height={120}
                width="100%"
              />
              <YStack padding="$3">
                <Text fontSize="$5" fontWeight="700">
                  {category.name}
                </Text>
                <Text fontSize="$3" color="$gray10">
                  {category.count} recipe{category.count > 1 ? "s" : ""}
                </Text>
              </YStack>
            </Card>
          </Pressable>
        ))}
      </YStack>
    </ScrollView>
  );
}
