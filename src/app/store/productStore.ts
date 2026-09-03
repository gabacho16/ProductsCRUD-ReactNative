import { create } from "zustand";
import { Product } from "../interfaces/product";

const API_URL = "https://octramtechnologies.mx/api";

interface ProductStore {
  products: Product[];
  getProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  getProducts: async () => {
    try {
      const p = await apiFetch<Product[]>("/products");
      set({ products: p });
    } catch (error) {}
  },
}));

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error("No se pudo completar la petición");
  }
  return response.json();
}
