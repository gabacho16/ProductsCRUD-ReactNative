import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProductStore } from "../store/productStore";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Producto seleccionado desde Zustand
  const selectedProduct = useProductStore(
    (state) => state.selectedProduct
  );

  // Estados y funciones de Zustand
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);

  const getProductById = useProductStore(
    (state) => state.getProductById
  );

  const deleteProduct = useProductStore(
    (state) => state.deleteProduct
  );

  // Obtener el producto cuando entramos a esta pantalla
  useEffect(() => {
    if (id) {
      getProductById(Number(id));
    }
  }, [id, getProductById]);

  // Estado de carga
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0F766E" />
          <Text style={styles.loadingText}>
            Cargando producto...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si ocurrió un error o no encontramos el producto
  if (error || !selectedProduct) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            No se pudo cargar el producto
          </Text>

          <Text style={styles.errorText}>
            {error ?? "Producto no encontrado."}
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Regresar
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Función para eliminar producto
  const handleDelete = () => {
    Alert.alert(
      "Eliminar producto",
      `¿Estás seguro de que quieres eliminar "${selectedProduct.title}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(selectedProduct.id);

              Alert.alert(
                "Producto eliminado",
                "El producto se eliminó correctamente.",
                [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch {
              Alert.alert(
                "Error",
                "No se pudo eliminar el producto."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Botón regresar */}
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Regresar</Text>
        </Pressable>

        {/* Imagen del producto */}
        <Image
          source={{ uri: selectedProduct.image }}
          style={styles.image}
        />

        {/* Información del producto */}
        <View style={styles.content}>
          {/* Categoría */}
          <Text style={styles.category}>
            {selectedProduct.category}
          </Text>

          {/* Nombre */}
          <Text style={styles.title}>
            {selectedProduct.title}
          </Text>

          {/* Precio */}
          <Text style={styles.price}>
            ${selectedProduct.price.toFixed(2)}
          </Text>

          {/* Disponibilidad */}
          <View
            style={[
              styles.availability,
              !selectedProduct.isAvailable &&
                styles.unavailable,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                !selectedProduct.isAvailable &&
                  styles.unavailableDot,
              ]}
            />

            <Text
              style={[
                styles.availabilityText,
                !selectedProduct.isAvailable &&
                  styles.unavailableText,
              ]}
            >
              {selectedProduct.isAvailable
                ? "Disponible"
                : "No disponible"}
            </Text>
          </View>

          {/* Descripción */}
          <Text style={styles.descriptionTitle}>
            Descripción
          </Text>

          <Text style={styles.description}>
            {selectedProduct.description}
          </Text>

          {/* Botón editar */}
          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: "/products/edit/[id]",
                params: {
                  id: selectedProduct.id.toString(),
                },
              })
            }
          >
            <Text style={styles.editButtonText}>
              Editar producto
            </Text>
          </Pressable>

          {/* Botón eliminar */}
          <Pressable
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>
              Eliminar producto
            </Text>
          </Pressable>
        </View>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    color: "#667085",
    fontSize: 15,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  errorText: {
    marginTop: 8,
    color: "#667085",
    fontSize: 15,
    textAlign: "center",
  },

  back: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    color: "#0F766E",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: "#0F766E",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  image: {
    width: "100%",
    height: 280,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
  },

  content: {
    paddingTop: 20,
  },

  category: {
    color: "#0F766E",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8,
  },

  title: {
    color: "#17202A",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },

  price: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },

  availability: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
  },

  unavailable: {
    backgroundColor: "#FEE2E2",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16A34A",
    marginRight: 7,
  },

  unavailableDot: {
    backgroundColor: "#DC2626",
  },

  availabilityText: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "700",
  },

  unavailableText: {
    color: "#991B1B",
  },

  descriptionTitle: {
    marginTop: 28,
    marginBottom: 8,
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },

  description: {
    color: "#667085",
    fontSize: 16,
    lineHeight: 24,
  },

  editButton: {
    marginTop: 30,
    backgroundColor: "#0F766E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  deleteButton: {
    marginTop: 12,
    backgroundColor: "#DC2626",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});