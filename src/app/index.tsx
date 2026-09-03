// 1. Redirigir a la pagina de products
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/products" />;
}
