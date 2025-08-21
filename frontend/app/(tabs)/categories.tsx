import React, { useMemo } from "react";
import { ScrollView, Pressable } from "react-native";
import { YStack, Text, Card, Image } from "tamagui";
import { useQuery, gql } from "@apollo/client";
import { router } from "expo-router";

// GraphQL query
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
  const { loading, error, data } = useQuery(GET_RECIPES);

  // Group recipes by category
  const categories = useMemo(() => {
    if (!data?.recipes) return [];
    const map: Record<string, any[]> = {};
    data.recipes.forEach((recipe: any) => {
      if (recipe.category) {
        if (!map[recipe.category]) map[recipe.category] = [];
        map[recipe.category].push(recipe);
      }
    });
    return Object.entries(map).map(([name, recipes]) => ({
      name,
      count: recipes.length,
      thumbnail:
        recipes[recipes.length - 1]?.image ||
        "https://via.placeholder.com/150",
    }));
  }, [data]);

  if (loading) return <Text fontSize={16}>Loading...</Text>;
  if (error) return <Text fontSize={16} color="red">Error: {error.message}</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text fontSize={28} fontWeight="700" marginBottom={16}>
        Categories
      </Text>

      <YStack space={12}>
        {categories.map((category) => (
          <Pressable
            key={category.name}
            onPress={() =>
              router.push(
                `/category/${encodeURIComponent(
                  category.name.trim().toLowerCase()
                )}`
              )
            }
          >
            <Card
              elevation={3}
              bordered={true}
              borderRadius={8}
              overflow="hidden"
              marginBottom={12}
            >
              <Image
                source={{ uri: category.thumbnail }}
                height={120}
                width="100%"
                resizeMode="cover"
              />
              <YStack padding={12}>
                <Text fontSize={18} fontWeight="700">
                  {category.name}
                </Text>
                <Text fontSize={14} color="#666">
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
