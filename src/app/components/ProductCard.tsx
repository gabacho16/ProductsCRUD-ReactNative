import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Product } from "../interfaces/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Pressable style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text>{product.title}</Text>
        <Text>{product.description}</Text>

        <View>
          <Text>{product.isAvailable ? "Disponible" : " No disponible"}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#e3e4e5",
  },
  content: {
    padding: 16,
  },
  category: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "600",
  },
});
