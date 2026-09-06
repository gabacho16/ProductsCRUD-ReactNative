import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { Category } from "../interfaces/category";

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
    >
      <Pressable
  accessibilityRole="button"
  accessibilityState={{ selected: selectedCategoryId === null }}
  style={({ pressed }) => [
    styles.button,
    selectedCategoryId === null && styles.selectedButton,
    pressed && styles.pressedButton,
  ]}
  onPress={() => onSelectCategory(null)}
>
  <Text
    style={[
      styles.buttonText,
      selectedCategoryId === null && styles.selectedButtonText,
    ]}
  >
    Todos
  </Text>
</Pressable>
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.button,
              isSelected && styles.selectedButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Text
              style={[
                styles.buttonText,
                isSelected && styles.selectedButtonText,
              ]}
            >
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffffff",
    borderColor: "#D0D5DD",
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: 17,
    paddingVertical: 9,
  },
  buttonText: {
    color: "#475467",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedButton: {
    backgroundColor: "#0f766e",
    borderColor: "#0f766e",
  },
  selectedButtonText: {
    color: "#ffffff",
  },
  pressedButton: {
    opacity: 0.78,
  },
  list: {
    gap: 9,
    paddingBottom: 24,
    paddingRight: 18,
  },
});
