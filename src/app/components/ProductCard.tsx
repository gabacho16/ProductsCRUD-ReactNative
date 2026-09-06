import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Product } from "../interfaces/product";


interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  
const router = useRouter();

return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/products/[id]",
          params: { id: product.id.toString() },
        })
      }
      style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{product.category}</Text>
          <View
            style={[
              styles.availability,
              !product.isAvailable && styles.unavailable,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                !product.isAvailable && styles.unavailableDot,
              ]}
            />
            <Text
              style={[
                styles.availabilityText,
                !product.isAvailable && styles.unavailableText,
              ]}
            >
              {product.isAvailable ? "Disponible" : "No disponible"}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{product.title}</Text>
        <Text numberOfLines={3} style={styles.description}>
          {product.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#EAECF0",
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  pressedCard: {
    opacity: 0.92,
  },
  image: {
    width: "100%",
    height: 190,
    backgroundColor: "#F2F4F7",
    resizeMode: "cover",
  },
  content: {
    padding: 17,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  category: {
    color: "#0F766E",
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  availability: {
    alignItems: "center",
    backgroundColor: "#ECFDF3",
    borderRadius: 14,
    flexDirection: "row",
    gap: 6,
    marginLeft: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  unavailable: {
    backgroundColor: "#F2F4F7",
  },
  statusDot: {
    backgroundColor: "#12B76A",
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  unavailableDot: {
    backgroundColor: "#98A2B3",
  },
  availabilityText: {
    color: "#027A48",
    fontSize: 12,
    fontWeight: "600",
  },
  unavailableText: {
    color: "#667085",
  },
  title: {
    color: "#1D2939",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  description: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
});
