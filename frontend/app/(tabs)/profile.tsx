import React, { useEffect, useState } from "react";
import { ScrollView, Pressable } from "react-native";
import { YStack, Text, Card, Image, XStack, Button } from "tamagui";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "expo-router";
import { Clock } from "@tamagui/lucide-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ================= GraphQL =================
const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      _id
      title
      image
      createdAt
      user {
        _id
        name
      }
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id) {
      _id
    }
  }
`;

export default function ProfileScreen() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { loading, error, data } = useQuery(GET_RECIPES);

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    update: (cache, { data }) => {
      if (!data) return;
      const deletedId = data.deleteRecipe._id;
      const existing: any = cache.readQuery({ query: GET_RECIPES });
      if (!existing) return;
      const newRecipes = existing.recipes.filter((r: any) => r._id !== deletedId);
      cache.writeQuery({
        query: GET_RECIPES,
        data: { recipes: newRecipes },
      });
    },
  });

  // Get user ID from token
  useEffect(() => {
    const getUserIdFromToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          setCurrentUserId(decoded.id);
        } catch (err) {
          console.error("Failed to decode token:", err);
        }
      }
    };
    getUserIdFromToken();
  }, []);

  const handleDelete = (id: string) => {
    try {
      deleteRecipe({ variables: { id } });
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  if (!currentUserId) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding={16}>
        <Text fontSize="$5" color="$gray10">
          Please log in to see your recipes.
        </Text>
      </YStack>
    );
  }

  if (loading)
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </YStack>
    );

  if (error)
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Error fetching recipes: {error.message}</Text>
      </YStack>
    );

  const myRecipes = data.recipes.filter(
    (recipe: any) => recipe.user?._id?.toString() === currentUserId
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text fontSize="$8" fontWeight="700" marginBottom="$4">
        My Recipes
      </Text>

      {myRecipes.length === 0 && (
        <YStack justifyContent="center" alignItems="center" padding={16}>
          <Text fontSize="$5" color="$gray10">
            You haven't posted any recipes yet.
          </Text>
        </YStack>
      )}

      <YStack space="$3">
        {myRecipes.map((recipe: any) => (
          <Card
            key={recipe._id}
            elevation={3}
            bordered
            borderRadius="$8"
            overflow="hidden"
          >
            <Pressable onPress={() => router.push(`/recipe/${recipe._id}`)}>
              <Image
                source={{ uri: recipe.image || "https://via.placeholder.com/150" }}
                height={120}
                width="100%"
              />
              <YStack padding="$3" space="$2">
                <Text fontSize="$5" fontWeight="700" numberOfLines={1}>
                  {recipe.title}
                </Text>
                <XStack alignItems="center" space="$2">
                  <Clock size={14} color="gray" />
                  <Text color="$gray10" fontSize="$3">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </Text>
                </XStack>
              </YStack>
            </Pressable>

            {/* Edit & Delete Buttons */}
            <XStack padding="$3" space="$2">
              <Button
                size="$3"
                onPress={() => router.push(`/recipe/edit/${recipe._id}`)}
              >
                Edit
              </Button>
              <Button size="$3" theme="red" onPress={() => handleDelete(recipe._id)}>
                Delete
              </Button>
            </XStack>
          </Card>
        ))}
      </YStack>
    </ScrollView>
  );
}
