import { create } from "zustand";
import { Category } from "../interfaces/category";
import { Product } from "../interfaces/product";

const API_URL = "https://octramtechnologies.mx/api";

interface ProductStore {
  isLoadig: boolean;
  products: Product[];
  categories: Category[];
  getProducts: () => Promise<void>;
  getCategories: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  isLoadig: false,
  products: [],
  categories: [],
  getProducts: async () => {
    set({ isLoadig: true });
    try {
      const p = await apiFetch<Product[]>("/products");
      set({ products: p });
    } catch (error) {
    } finally {
      set({ isLoadig: false });
    }
  },
  getCategories: async () => {
    try {
      const c = await apiFetch<Category[]>("/categories");
      set({ categories: c });
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
