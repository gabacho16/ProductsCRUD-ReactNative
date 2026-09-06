import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { CategoryList } from "../components/CategoryList";
import { ProductCard } from "../components/ProductCard";
import { useProductStore } from "../store/productStore";

export default function ProductsScreen() {
  const router = useRouter();

  // Categoría seleccionada
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | null
  >(null);

  // Controla el refresh manual
  const [refreshing, setRefreshing] = useState(false);

  // Datos de Zustand
  const products = useProductStore((state) => state.products);
  const categories = useProductStore((state) => state.categories);

  // Estados
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);

  // Funciones del store
  const getProducts = useProductStore((state) => state.getProducts);
  const getCategories = useProductStore((state) => state.getCategories);
  const clearError = useProductStore((state) => state.clearError);

  // Seleccionar categoría
  const onSelectCategory = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    // null significa "Todos"
    if (selectedCategoryId === null) {
      return products;
    }

    return products.filter(
      (product) => product.categoryId === selectedCategoryId,
    );
  }, [products, selectedCategoryId]);

  // Cargar información al abrir la pantalla
  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts, getCategories]);

  // Actualizar productos manualmente
  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      clearError();

      await Promise.all([
        getProducts(),
        getCategories(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Botón para crear producto */}
      <Pressable
        style={styles.createButton}
        onPress={() => router.push("/products/create")}
      >
        <Text style={styles.createButtonText}>
          + Crear producto
        </Text>
      </Pressable>

      <FlatList
        style={styles.container}
        contentContainerStyle={styles.list}
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}

        // Pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }

        // Encabezado
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>
              CATÁLOGO
            </Text>

            <Text style={styles.title}>
              Nuestros productos
            </Text>

            <Text style={styles.subtitle}>
              Elige una categoría
            </Text>

            <CategoryList
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={onSelectCategory}
            />
          </View>
        }

        // Estado cuando no hay productos
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator
                color="#0F766E"
                size="large"
              />

              <Text style={styles.emptyText}>
                Cargando productos...
              </Text>
            </View>
          ) : error ? (
            // Estado de error
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                Ocurrió un error
              </Text>

              <Text style={styles.emptyText}>
                {error}
              </Text>

              <Pressable
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryButtonText}>
                  Intentar nuevamente
                </Text>
              </Pressable>
            </View>
          ) : (
            // Estado vacío
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                Aún no hay productos
              </Text>

              <Text style={styles.emptyText}>
                Vuelve más tarde para descubrir novedades.
              </Text>
            </View>
          )
        }

        // Mostrar cada producto
        renderItem={({ item }) => (
          <ProductCard product={item} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  list: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },

  header: {
    paddingTop: 22,
  },

  eyebrow: {
    color: "#0F766E",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 6,
  },

  title: {
    color: "#17202A",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.7,
    lineHeight: 36,
  },

  subtitle: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
    marginTop: 3,
  },

  createButton: {
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "#0F766E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 64,
  },

  emptyTitle: {
    color: "#344054",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },

  emptyText: {
    color: "#98A2B3",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#0F766E",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});