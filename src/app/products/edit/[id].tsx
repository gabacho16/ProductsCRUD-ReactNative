import { useEffect, useRef, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProductStore } from "../../store/productStore";

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const product = useProductStore((state) => state.selectedProduct);
  const categories = useProductStore((state) => state.categories);
  const getProductById = useProductStore((state) => state.getProductById);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const isUpdating = useProductStore((state) => state.isUpdating);

  // Estado de todo el formulario
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    categoryId: null as number | null,
    isAvailable: true,
  });

  // Nos permite inicializar el formulario una sola vez
  const initialized = useRef(false);

  // Obtener el producto desde la API
  useEffect(() => {
    if (id) {
      initialized.current = false;
      getProductById(Number(id));
    }
  }, [id, getProductById]);

  // Cargar los datos del producto en el formulario
  useEffect(() => {
    if (product && !initialized.current) {
      setForm({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        categoryId: product.categoryId,
        isAvailable: product.isAvailable,
      });

      initialized.current = true;
    }
  }, [product]);

  // Cambiar un campo del formulario
  const updateForm = <K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  // Actualizar producto
  const handleUpdate = async () => {
    // Validamos todos los campos
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.price.trim() ||
      !form.image.trim() ||
      form.categoryId === null
    ) {
      Alert.alert(
        "Faltan datos",
        "Completa todos los campos.",
      );
      return;
    }

    // Validar precio
    if (Number.isNaN(Number(form.price))) {
      Alert.alert(
        "Precio inválido",
        "Escribe un precio válido.",
      );
      return;
    }

    try {
      await updateProduct(Number(id), {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        categoryId: form.categoryId,
        isAvailable: form.isAvailable,
      });

      Alert.alert(
        "Éxito",
        "Producto actualizado correctamente.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch {
      Alert.alert(
        "Error",
        "No se pudo actualizar el producto.",
      );
    }
  };

  // Estado de carga
  if (isLoading || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <Text>Cargando producto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Regresar */}
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Regresar</Text>
        </Pressable>

        {/* Título */}
        <Text style={styles.title}>
          Editar producto
        </Text>

        <Text style={styles.subtitle}>
          Modifica la información del producto.
        </Text>

        {/* Nombre */}
        <Text style={styles.label}>
          Nombre
        </Text>

        <TextInput
          style={styles.input}
          value={form.title}
          onChangeText={(value) =>
            updateForm("title", value)
          }
        />

        {/* Descripción */}
        <Text style={styles.label}>
          Descripción
        </Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={(value) =>
            updateForm("description", value)
          }
          multiline
        />

        {/* Precio */}
        <Text style={styles.label}>
          Precio
        </Text>

        <TextInput
          style={styles.input}
          value={form.price}
          onChangeText={(value) =>
            updateForm("price", value)
          }
          keyboardType="decimal-pad"
        />

        {/* Imagen */}
        <Text style={styles.label}>
          URL de imagen
        </Text>

        <TextInput
          style={styles.input}
          value={form.image}
          onChangeText={(value) =>
            updateForm("image", value)
          }
          autoCapitalize="none"
        />

        {/* Categoría */}
        <Text style={styles.label}>
          Categoría
        </Text>

        <View style={styles.categories}>
          {categories.map((category) => {
            const selected =
              form.categoryId === category.id;

            return (
              <Pressable
                key={category.id}
                onPress={() =>
                  updateForm(
                    "categoryId",
                    category.id,
                  )
                }
                style={[
                  styles.categoryButton,
                  selected &&
                    styles.selectedCategory,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Disponibilidad */}
        <Text style={styles.label}>
          Disponibilidad
        </Text>

        <View style={styles.availabilityContainer}>
          <Pressable
            onPress={() =>
              updateForm("isAvailable", true)
            }
            style={[
              styles.availabilityButton,
              form.isAvailable &&
                styles.selectedAvailability,
            ]}
          >
            <Text
              style={[
                styles.availabilityText,
                form.isAvailable &&
                  styles.selectedAvailabilityText,
              ]}
            >
              Disponible
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              updateForm("isAvailable", false)
            }
            style={[
              styles.availabilityButton,
              !form.isAvailable &&
                styles.selectedUnavailable,
            ]}
          >
            <Text
              style={[
                styles.availabilityText,
                !form.isAvailable &&
                  styles.selectedAvailabilityText,
              ]}
            >
              No disponible
            </Text>
          </Pressable>
        </View>

        {/* Guardar */}
        <Pressable
          onPress={handleUpdate}
          disabled={isUpdating}
          style={[
            styles.updateButton,
            isUpdating &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.updateButtonText}>
            {isUpdating
              ? "Guardando..."
              : "Guardar cambios"}
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

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

  availabilityContainer: {
    flexDirection: "row",
    gap: 10,
  },

  availabilityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },

  selectedAvailability: {
    backgroundColor: "#0F766E",
  },

  selectedUnavailable: {
    backgroundColor: "#DC2626",
  },

  availabilityText: {
    fontWeight: "700",
    color: "#374151",
  },

  selectedAvailabilityText: {
    color: "#FFFFFF",
  },

  updateButton: {
    marginTop: 30,
    backgroundColor: "#0F766E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});