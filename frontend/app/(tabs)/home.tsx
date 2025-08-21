import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  YStack,
  XStack,
  Text,
  Input,
  Button,
  ScrollView,
  Card,
  Image,
  Avatar,
} from "tamagui";
import { Search, Filter, Clock } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      _id
      title
      ingredients
      instructions
      category
      image
      notes
      createdAt
      user {
        _id
        name
        email
      }
    }
  }
`;

export default function RecipeList() {
  const { loading, error, data } = useQuery(GET_RECIPES);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="$6" color="$gray10">Loading recipes...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="red">Error: {error.message}</Text>
      </YStack>
    );
  }

  // Extract unique categories dynamically
  const categories = ["All", ...Array.from(new Set(data.recipes.map((r: any) => r.category)))];

  // Filter recipes by category
  let filteredRecipes =
    activeCategory === "All"
      ? data.recipes
      : data.recipes.filter((r: any) => r.category === activeCategory);

  // Further filter by search term (case-insensitive)
  if (searchTerm.trim() !== "") {
    filteredRecipes = filteredRecipes.filter((r: any) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort by newest
  const sortedRecipes = [...filteredRecipes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const recentRecipes = sortedRecipes.slice(0, 3);
  const featuredRecipes = sortedRecipes.filter((r) => !recentRecipes.includes(r)).slice(0, 3);
  const displayFeatured = featuredRecipes.length > 0 ? featuredRecipes : sortedRecipes.slice(0, 3);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$5">
        <YStack>
          <Text fontSize="$8" fontWeight="800">Hello Jega</Text>
          <Text color="$gray10" fontSize="$4">What are you cooking today?</Text>
        </YStack>
        <Avatar circular size="$6" borderWidth={1} borderColor="$green10">
          <Avatar.Image src="https://i.pravatar.cc/150?img=32" />
          <Avatar.Fallback backgroundColor="gray" />
        </Avatar>
      </XStack>

      {/* Search */}
      <XStack alignItems="center" space="$2" marginBottom="$4">
        <Input
          flex={1}
          placeholder="Search recipes..."
          icon={<Search size={16} />}
          borderRadius="$8"
          paddingHorizontal="$3"
          backgroundColor="$gray2"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button icon={Filter} size="$3" theme="green" borderRadius="$8" />
      </XStack>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack space="$2" marginBottom="$6">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="$3"
              backgroundColor={activeCategory === cat ? "#10B980" : "#d4f7dc"} // active green, inactive light green
              color={activeCategory === cat ? "white" : "$gray10"}
              borderRadius="$8"
              onPress={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </XStack>
      </ScrollView>

      {/* Featured Recipes */}
      <Text fontSize="$6" fontWeight="700" marginBottom="$3">Featured Recipes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack space="$3">
          {displayFeatured.map((item: any) => (
            <Pressable
              key={item._id}
              onPress={() => router.push(`/recipe/${item._id}`)}
            >
              <Card width={200} elevate bordered borderRadius="$8" overflow="hidden">
                <Image source={{ uri: item.image }} height={120} width="100%" />
                <YStack padding="$3" space="$2">
                  <Text fontSize="$5" fontWeight="700" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <XStack alignItems="center" space="$2">
                    <Clock size={14} color="gray" />
                    <Text color="$gray10" fontSize="$3">15 mins</Text>
                  </XStack>
                </YStack>
              </Card>
            </Pressable>
          ))}
        </XStack>
      </ScrollView>

      {/* New Recipes */}
      <YStack marginTop="$7">
        <Text fontSize="$6" fontWeight="700" marginBottom="$3">New Recipes</Text>
        <XStack flexWrap="wrap" gap={12} justifyContent="flex-start">
          {recentRecipes.map((item: any) => (
            <Pressable
              key={item._id}
              onPress={() => router.push(`/recipe/${item._id}`)}
              style={{ width: "48%" }}
            >
              <Card elevate bordered borderRadius="$8" overflow="hidden" marginBottom="$4">
                <Image source={{ uri: item.image }} height={100} width="100%" />
                <YStack padding="$2" space="$1">
                  <Text fontSize="$5" fontWeight="600" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <XStack alignItems="center" space="$2">
                    <Avatar size="$2" circular>
                      <Avatar.Image src={`https://i.pravatar.cc/150?u=${item.user?._id}`} />
                      <Avatar.Fallback backgroundColor="gray" />
                    </Avatar>
                    <Text color="$gray10" fontSize="$3">
                      {item.user?.name || "Unknown"}
                    </Text>
                  </XStack>
                </YStack>
              </Card>
            </Pressable>
          ))}
        </XStack>
      </YStack>
    </ScrollView>
  );
}
