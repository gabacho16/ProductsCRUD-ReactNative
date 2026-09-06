import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useProductStore } from "../store/productStore";

export default function CreateProductScreen() {
  const router = useRouter();

  const categories = useProductStore((state) => state.categories);
  const createProduct = useProductStore((state) => state.createProduct);
  const isCreating = useProductStore((state) => state.isCreating);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!title || !description || !price || !image || !categoryId) {
      Alert.alert("Faltan datos", "Completa todos los campos.");
      return;
    }

    if (Number.isNaN(Number(price))) {
      Alert.alert("Precio inválido", "Escribe un precio válido.");
      return;
    }

    try {
      await createProduct({
        title,
        description,
        price: Number(price),
        isAvailable: true,
        image,
        categoryId,
      });

      Alert.alert("Éxito", "Producto creado correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo crear el producto.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Regresar</Text>
        </Pressable>

        <Text style={styles.title}>Crear producto</Text>
        <Text style={styles.subtitle}>
          Agrega un nuevo producto al catálogo.
        </Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Audífonos"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción del producto"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 499.99"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>URL de imagen</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          value={image}
          onChangeText={setImage}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Categoría</Text>

        <View style={styles.categories}>
          {categories.map((category) => {
            const selected = categoryId === category.id;

            return (
              <Pressable
                key={category.id}
                onPress={() => setCategoryId(category.id)}
                style={[
                  styles.categoryButton,
                  selected && styles.selectedCategory,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleCreate}
          disabled={isCreating}
          style={[
            styles.createButton,
            isCreating && styles.disabledButton,
          ]}
        >
          <Text style={styles.createButtonText}>
            {isCreating ? "Creando..." : "Crear producto"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  back: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    color: "#0F766E",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 25,
    color: "#6B7280",
    fontSize: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 15,
    color: "#111827",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  selectedCategory: {
    backgroundColor: "#0F766E",
  },
  categoryText: {
    color: "#374151",
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  createButton: {
    marginTop: 30,
    backgroundColor: "#0F766E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});