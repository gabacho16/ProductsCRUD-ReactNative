import { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductCard } from "../components/ProductCard";
import { useProductStore } from "../store/productStore";

export default function ProductsScreen() {
  const products = useProductStore((state) => state.products);
  const getProducts = useProductStore((state) => state.getProducts);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <SafeAreaView>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.list}
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F4F6",
  },
  list: {
    padding: 16,
  },
});
