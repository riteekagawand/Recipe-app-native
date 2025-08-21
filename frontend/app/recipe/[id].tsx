import { useLocalSearchParams } from "expo-router";
import { useQuery, gql } from "@apollo/client";
import { YStack, XStack, Text, Image, ScrollView, Card, Button } from "tamagui";
import { Bookmark, Star, Clock } from "@tamagui/lucide-icons";
import { useState } from "react";

const GET_RECIPE_BY_ID = gql`
  query GetRecipeById($id: ID!) {
    recipe(id: $id) {
      _id
      title
      image
      ingredients
      instructions
      category
      notes
      user {
        name
      }
    }
  }
`;

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const { loading, error, data } = useQuery(GET_RECIPE_BY_ID, {
    variables: { id },
  });

  const [tab, setTab] = useState<"ingredients" | "procedure">("ingredients");

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const recipe = data.recipe;

  return (
    <ScrollView backgroundColor="$background">
      {/* Hero Image */}
      <Card borderRadius="$6" margin="$4" overflow="hidden" elevate>
        <Image source={{ uri: recipe.image }} height={220} width="100%" />
        {/* Overlays */}
        <XStack justifyContent="space-between" position="absolute" top={10} left={10} right={10}>
          {/* Rating */}
          <XStack backgroundColor="rgba(0,0,0,0.6)" padding="$2" borderRadius="$4" alignItems="center">
            <Star size={16} color="yellow" />
            <Text color="white" marginLeft="$1">4.8</Text>
          </XStack>
          {/* Time + Bookmark */}
          <XStack space="$2">
            <XStack backgroundColor="rgba(0,0,0,0.6)" padding="$2" borderRadius="$4" alignItems="center">
              <Clock size={16} color="white" />
              <Text color="white" marginLeft="$1">20 min</Text>
            </XStack>
            <Card backgroundColor="white" padding="$2" borderRadius="$4">
              <Bookmark size={18} color="#333" />
            </Card>
          </XStack>
        </XStack>
      </Card>

      {/* Title + Author */}
      <YStack paddingHorizontal="$4" marginBottom="$4">
        <Text fontSize="$8" fontWeight="800" marginBottom="$1">
          {recipe.title}
        </Text>
        <Text fontSize="$4" color="$gray10" marginBottom="$2">
          (13k Reviews)
        </Text>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" space="$2">
            <Card width={36} height={36} borderRadius={18} backgroundColor="$gray3" />
            <YStack>
              <Text fontSize="$5" fontWeight="600">{recipe.user?.name}</Text>
              <Text fontSize="$3" color="$gray10">Location</Text>
            </YStack>
          </XStack>
        </XStack>
      </YStack>

      {/* Tabs */}
      <XStack justifyContent="center" space="$4" marginBottom="$4">
        <Button
          backgroundColor={tab === "ingredients" ? "#10B980" : "transparent"}
          color={tab === "ingredients" ? "white" : "$color"}
          borderRadius="$6"
          onPress={() => setTab("ingredients")}
        >
          Ingredients
        </Button>
        <Button
          backgroundColor={tab === "procedure" ? "#10B980" : "transparent"}
          color={tab === "procedure" ? "white" : "$color"}
          borderRadius="$6"
          onPress={() => setTab("procedure")}
        >
          Procedure
        </Button>
      </XStack>

      {/* Tab Content */}
      {tab === "ingredients" ? (
        <YStack space="$3" paddingHorizontal="$4" marginBottom="$6">
          {Array.isArray(recipe.ingredients)
            ? recipe.ingredients.map((item: string, i: number) => (
                <Card
                  key={i}
                  backgroundColor="#d4f7dc" // light green
                  borderRadius="$5"
                  padding="$3"
                  elevate
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$5">{item}</Text>
                    <Text fontSize="$4" color="$gray10">300g</Text>
                  </XStack>
                </Card>
              ))
            : <Text>{recipe.ingredients}</Text>}
        </YStack>
      ) : (
        <Card
          padding="$4"
          borderRadius="$5"
          marginHorizontal="$4"
          marginBottom="$6"
          backgroundColor="#d4f7dc" // light green
        >
          <Text fontSize="$5" lineHeight={22}>{recipe.instructions}</Text>
        </Card>
      )}
    </ScrollView>
  );
}