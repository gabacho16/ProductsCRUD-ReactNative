import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryList } from "../components/CategoryList";
import { ProductCard } from "../components/ProductCard";
import { useProductStore } from "../store/productStore";

export default function ProductsScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const onSelectCategory = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    // Filtrar productos por categoria
  };

  const products = useProductStore((state) => state.products);
  const categories = useProductStore((state) => state.categories);
  const isLoading = useProductStore((state) => state.isLoadig);
  const getProducts = useProductStore((state) => state.getProducts);
  const getCategories = useProductStore((state) => state.getCategories);

  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts, getCategories]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.list}
        data={products}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>CATÁLOGO</Text>
            <Text style={styles.title}>Nuestros productos</Text>
            <Text style={styles.subtitle}>Elige una categoría</Text>

            <CategoryList
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={onSelectCategory}
            />
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color="#0f766e" size="large" />
              <Text style={styles.emptyText}>Cargando productos…</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aún no hay productos</Text>
              <Text style={styles.emptyText}>
                Vuelve más tarde para descubrir novedades.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => <ProductCard product={item} />}
      ></FlatList>
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
});
