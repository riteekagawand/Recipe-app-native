import React, { useState, useEffect } from "react";
import { ScrollView, SafeAreaView, TextInput, Alert } from "react-native";
import { YStack, XStack, Text, Button, Image, Card, Theme } from "tamagui";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Plus, Camera, Utensils, FileText, List, Bookmark, StickyNote } from "@tamagui/lucide-icons";

// ================= GraphQL =================
const GET_RECIPE_BY_ID = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      _id
      title
      ingredients
      instructions
      category
      image
      notes
    }
  }
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe(
    $id: ID!
    $title: String!
    $ingredients: [String!]!
    $instructions: String!
    $category: String
    $image: String
    $notes: [String]
  ) {
    updateRecipe(
      id: $id
      title: $title
      ingredients: $ingredients
      instructions: $instructions
      category: $category
      image: $image
      notes: $notes
    ) {
      _id
      title
    }
  }
`;

// ================= Reusable Input Component =================
function FormInput({ icon, placeholder, value, onChangeText, multiline = false, rightButton }: any) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <XStack
      alignItems="center"
      borderWidth={2}
      borderColor={isFocused ? "#34D399" : "#E5E7EB"}
      borderRadius={12}
      paddingHorizontal={12}
      backgroundColor="white"
      shadowColor="black"
      shadowOpacity={isFocused ? 0.15 : 0.05}
      shadowRadius={isFocused ? 6 : 4}
      minHeight={50}
      width="100%"
    >
      {icon}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          flex: 1,
          marginLeft: 10,
          fontSize: 16,
          color: "#111827",
          paddingVertical: multiline ? 12 : 0,
        }}
        placeholderTextColor="#9CA3AF"
        underlineColorAndroid="transparent"
        blurOnSubmit
      />
      {rightButton && <XStack marginLeft={8}>{rightButton}</XStack>}
    </XStack>
  );
}

// ================= Main Edit Screen =================
export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RECIPE_BY_ID, { variables: { id } });
  const [updateRecipe, { loading: updating }] = useMutation(UPDATE_RECIPE);

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [ingredientInput, setIngredientInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    if (data?.recipe) {
      const r = data.recipe;
      setTitle(r.title || "");
      setIngredients(r.ingredients || []);
      setInstructions(r.instructions || "");
      setCategory(r.category || "");
      setNotes(r.notes || []);
      setImage(r.image || null);
    }
  }, [data]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const addChip = (type: "ingredient" | "note") => {
    if (type === "ingredient" && ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
    if (type === "note" && noteInput.trim()) {
      setNotes([...notes, noteInput.trim()]);
      setNoteInput("");
    }
  };

  const removeChip = (type: "ingredient" | "note", index: number) => {
    if (type === "ingredient") setIngredients(ingredients.filter((_, i) => i !== index));
    if (type === "note") setNotes(notes.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!title || ingredients.length === 0 || !instructions) {
      Alert.alert("⚠️ Missing Fields", "Please fill all required fields");
      return;
    }

    try {
      await updateRecipe({
        variables: { id, title, ingredients, instructions, category, image, notes },
      });
      Alert.alert("✅ Success", "Recipe updated successfully!");
      router.push("/profile");
    } catch (err: any) {
      Alert.alert("❌ Error", err.message);
    }
  };

  if (loading)
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize={18}>Loading recipe...</Text>
      </YStack>
    );

  if (error)
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize={18} color="red">Error loading recipe: {error.message}</Text>
      </YStack>
    );

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Card padding="$6" borderRadius="$12" backgroundColor="white" elevation={6}>
            <YStack space="$6" alignContent="center">
              {/* Image Picker */}
              <YStack alignItems="center" space="$3">
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 140, height: 140, borderRadius: 70, marginBottom: 8 }}
                  />
                ) : (
                  <YStack
                    width={140}
                    height={140}
                    borderRadius={70}
                    backgroundColor="#E5E7EB"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Plus size={36} color="#9CA3AF" />
                  </YStack>
                )}
                <Button
                  size="$4"
                  backgroundColor="#34D399"
                  borderRadius={28}
                  onPress={pickImage}
                  icon={Camera}
                  pressStyle={{ backgroundColor: "#059669" }}
                >
                  Change Image
                </Button>
              </YStack>

              {/* Title */}
              <FormInput
                icon={<Utensils size={22} color="#6B7280" />}
                placeholder="Recipe Title"
                value={title}
                onChangeText={setTitle}
              />

              {/* Ingredients */}
              <YStack width="100%" space="$3">
                <Text fontWeight="700" fontSize={16} color="#111827">Ingredients</Text>
                <XStack space="$2" flexWrap="wrap">
                  {ingredients.map((ing, i) => (
                    <Button
                      key={i}
                      size="$2"
                      backgroundColor="#D1FAE5"
                      borderRadius={20}
                      onPress={() => removeChip("ingredient", i)}
                      pressStyle={{ backgroundColor: "#10B981" }}
                    >
                      {ing} ✕
                    </Button>
                  ))}
                </XStack>
                <FormInput
                  icon={<List size={22} color="#6B7280" />}
                  placeholder="Add ingredient..."
                  value={ingredientInput}
                  onChangeText={setIngredientInput}
                  rightButton={
                    <Button size="$2" circular backgroundColor="#34D399" onPress={() => addChip("ingredient")}>
                      <Plus size={16} color="white" />
                    </Button>
                  }
                />
              </YStack>

              {/* Instructions */}
              <FormInput
                icon={<FileText size={22} color="#6B7280" />}
                placeholder="Instructions"
                value={instructions}
                onChangeText={setInstructions}
                multiline
              />

              {/* Category */}
              <FormInput
                icon={<Bookmark size={22} color="#6B7280" />}
                placeholder="Category (optional)"
                value={category}
                onChangeText={setCategory}
              />

              {/* Notes */}
              <YStack width="100%" space="$3">
                <Text fontWeight="700" fontSize={16} color="#111827">Notes</Text>
                <XStack space="$2" flexWrap="wrap">
                  {notes.map((note, i) => (
                    <Button
                      key={i}
                      size="$2"
                      backgroundColor="#DBEAFE"
                      borderRadius={20}
                      onPress={() => removeChip("note", i)}
                      pressStyle={{ backgroundColor: "#3B82F6" }}
                    >
                      {note} ✕
                    </Button>
                  ))}
                </XStack>
                <FormInput
                  icon={<StickyNote size={22} color="#6B7280" />}
                  placeholder="Add note..."
                  value={noteInput}
                  onChangeText={setNoteInput}
                  rightButton={
                    <Button size="$2" circular backgroundColor="#3B82F6" onPress={() => addChip("note")}>
                      <Plus size={16} color="white" />
                    </Button>
                  }
                />
              </YStack>

              {/* Update Button */}
              <Button
                height={56}
                width="100%"
                borderRadius={16}
                backgroundColor="#34D399"
                pressStyle={{ backgroundColor: "#059669" }}
                onPress={handleUpdate}
                disabled={updating}
                icon={Plus}
                fontWeight="700"
                fontSize={16}
              >
                {updating ? "Updating..." : "Update Recipe"}
              </Button>
            </YStack>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
}