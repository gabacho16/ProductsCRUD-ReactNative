import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#F7F8FA" } }}>
      <Stack.Screen name="products/index" options={{ headerShown: false }} />
    </Stack>
  );
}
