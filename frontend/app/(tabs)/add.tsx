import React, { useState } from "react";
import { ScrollView, SafeAreaView, TextInput, Alert } from "react-native";
import { YStack, XStack, Text, Button, Image, Card, Theme } from "tamagui";
import { gql, useMutation } from "@apollo/client";
import * as ImagePicker from "expo-image-picker";
import { Plus, Camera, Utensils, FileText, List, Bookmark, StickyNote } from "@tamagui/lucide-icons";

// ================= GraphQL =================
const ADD_RECIPE = gql`
  mutation CreateRecipe(
    $title: String!
    $ingredients: [String!]!
    $instructions: String!
    $category: String
    $image: String
    $notes: [String]
  ) {
    createRecipe(
      title: $title
      ingredients: $ingredients
      instructions: $instructions
      category: $category
      image: $image
      notes: $notes
    ) {
      _id
      title
      user {
        _id
        name
      }
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
      borderColor={isFocused ? "#10B981" : "#E5E7EB"}
      borderRadius="$10"
      paddingHorizontal="$3"
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
        style={{ flex: 1, marginLeft: 10, fontSize: 16, color: "#111827", paddingVertical: multiline ? 10 : 0 }}
        placeholderTextColor="#9CA3AF"
        underlineColorAndroid="transparent"
        blurOnSubmit
      />
      {rightButton && <XStack marginLeft={8}>{rightButton}</XStack>}
    </XStack>
  );
}

// ================= Main Screen =================
export default function AddRecipeScreen() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [ingredientInput, setIngredientInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const [addRecipe, { loading }] = useMutation(ADD_RECIPE, {
    onCompleted: () => {
      Alert.alert("✅ Success", "Recipe added successfully!");
      resetForm();
    },
    onError: (err) => Alert.alert("❌ Error", err.message),
  });

  const resetForm = () => {
    setTitle("");
    setIngredients([]);
    setInstructions("");
    setCategory("");
    setNotes([]);
    setImage(null);
    setIngredientInput("");
    setNoteInput("");
  };

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

  const handleSubmit = async () => {
    if (!title || ingredients.length === 0 || !instructions) {
      Alert.alert("⚠️ Missing Fields", "Please fill all required fields");
      return;
    }

    try {
      await addRecipe({
        variables: {
          title,
          ingredients,
          instructions,
          ...(category ? { category } : {}),
          ...(notes.length ? { notes } : {}),
          ...(image ? { image } : {}),
        },
      });
    } catch (err: any) {
      console.error("❌ Mutation failed:", err.message);
      Alert.alert("❌ Error", err.message);
    }
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Card padding="$5" borderRadius="$8" backgroundColor="white" elevation={5}>
            <YStack space="$5" alignContent="center">
              {/* Image Picker */}
              <YStack alignItems="center" space="$2">
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
                  />
                ) : (
                  <YStack width={120} height={120} borderRadius={60} backgroundColor="#F3F4F6" justifyContent="center" alignItems="center">
                    <Plus size={32} color="#6B7280" />
                  </YStack>
                )}
                <Button size="$3" backgroundColor="#10B981" borderRadius={25} onPress={pickImage} icon={Camera}>
                  Upload Image
                </Button>
              </YStack>

              {/* Title */}
              <FormInput icon={<Utensils size={20} color="#6B7280" />} placeholder="Recipe Title" value={title} onChangeText={setTitle} />

              {/* Ingredients */}
              <YStack width="100%" space="$2">
                <Text fontWeight="600">Ingredients</Text>
                <XStack space="$2" flexWrap="wrap">
                  {ingredients.map((ing, i) => (
                    <Button key={i} size="$2" backgroundColor="$green6" borderRadius={20} onPress={() => removeChip("ingredient", i)}>
                      {ing} ✕
                    </Button>
                  ))}
                </XStack>
                <FormInput
                  icon={<List size={20} color="#6B7280" />}
                  placeholder="Add ingredient..."
                  value={ingredientInput}
                  onChangeText={setIngredientInput}
                  rightButton={
                    <Button size="$2" circular backgroundColor="#10B981" onPress={() => addChip("ingredient")}>
                      <Plus size={16} color="white" />
                    </Button>
                  }
                />
              </YStack>

              {/* Instructions */}
              <FormInput icon={<FileText size={20} color="#6B7280" />} placeholder="Instructions" value={instructions} onChangeText={setInstructions} multiline />

              {/* Category */}
              <FormInput icon={<Bookmark size={20} color="#6B7280" />} placeholder="Category (optional)" value={category} onChangeText={setCategory} />

              {/* Notes */}
              <YStack width="100%" space="$2">
                <Text fontWeight="600">Notes</Text>
                <XStack space="$2" flexWrap="wrap">
                  {notes.map((note, i) => (
                    <Button key={i} size="$2" backgroundColor="$blue6" borderRadius={20} onPress={() => removeChip("note", i)}>
                      {note} ✕
                    </Button>
                  ))}
                </XStack>
                <FormInput
                  icon={<StickyNote size={20} color="#6B7280" />}
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

              {/* Submit */}
              <Button
                height={55}
                width="100%"
                borderRadius={14}
                backgroundColor="#10B981"
                pressStyle={{ backgroundColor: "#059669" }}
                onPress={handleSubmit}
                disabled={loading}
                icon={Plus}
              >
                {loading ? "Adding..." : "Add Recipe"}
              </Button>
            </YStack>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
}
