import { create } from "zustand";
import { Category } from "../interfaces/category";
import { Product } from "../interfaces/product";

const API_URL = "https://octramtechnologies.mx/api";

interface ProductStore {

  products: Product[];
  categories: Category[];
  selectedProduct: Product | null;


  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;


  error: string | null;


  getProducts: () => Promise<void>;


  getCategories: () => Promise<void>;

 
  getProductById: (id: number) => Promise<void>;


  createProduct: (
    product: Omit<
      Product,
      "id" | "createdAt" | "updatedAt" | "isDeleted" | "category"
    >
  ) => Promise<void>;


  updateProduct: (
    id: number,
    product: Partial<Product>
  ) => Promise<void>;


  deleteProduct: (id: number) => Promise<void>;


  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  
  products: [],
  categories: [],
  selectedProduct: null,

  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  error: null,


  getProducts: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const products = await apiFetch<Product[]>("/products");

      set({
        products,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.log("Error al obtener productos:", error);

      set({
        isLoading: false,
        error: "No se pudieron cargar los productos.",
      });
    }
  },


  getCategories: async () => {
    try {
      const categories = await apiFetch<Category[]>("/categories");

      set({
        categories,
      });
    } catch (error) {
      console.log("Error al obtener categorías:", error);

      set({
        error: "No se pudieron cargar las categorías.",
      });
    }
  },

  getProductById: async (id) => {
    set({
      isLoading: true,
      error: null,
      selectedProduct: null,
    });

    try {
      const product = await apiFetch<Product>(
        `/products/${id}`
      );

      set({
        selectedProduct: product,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.log("Error al obtener producto:", error);

      set({
        isLoading: false,
        error: "No se pudo cargar el producto.",
      });
    }
  },


  createProduct: async (product) => {
    set({
      isCreating: true,
      error: null,
    });

    try {
      await apiFetch<Product>("/products", {
        method: "POST",
        body: JSON.stringify(product),
      });

      set({
        isCreating: false,
        error: null,
      });


      const products = await fetchProducts();

      set({
        products,
      });
    } catch (error) {
      console.log("Error al crear producto:", error);

      set({
        isCreating: false,
        error: "No se pudo crear el producto.",
      });


      throw error;
    }
  },



  updateProduct: async (id, product) => {
    set({
      isUpdating: true,
      error: null,
    });

    try {
      const updatedProduct = await apiFetch<Product>(
        `/products/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(product),
        }
      );

      set((state) => ({
        
        products: state.products.map((item) =>
          item.id === id ? updatedProduct : item
        ),

       
        selectedProduct: updatedProduct,

        isUpdating: false,
        error: null,
      }));
    } catch (error) {
      console.log("Error al actualizar producto:", error);

      set({
        isUpdating: false,
        error: "No se pudo actualizar el producto.",
      });

      throw error;
    }
  },


  deleteProduct: async (id) => {
    set({
      isDeleting: true,
      error: null,
    });

    try {
      await apiFetch(`/products/${id}`, {
        method: "DELETE",
      });

      set((state) => ({
        
        products: state.products.filter(
          (product) => product.id !== id
        ),

        
        selectedProduct: null,

        isDeleting: false,
        error: null,
      }));
    } catch (error) {
      console.log("Error al eliminar producto:", error);

      set({
        isDeleting: false,
        error: "No se pudo eliminar el producto.",
      });

      throw error;
    }
  },


  clearError: () => {
    set({
      error: null,
    });
  },
}));


async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products");
}


async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });


  if (!response.ok) {
    const errorText = await response.text();

    console.log(
      "ERROR API:",
      response.status,
      errorText
    );

    throw new Error(
      `Error ${response.status}: ${
        errorText || "Error en la API"
      }`
    );
  }


  if (response.status === 204) {
    return undefined as T;
  }


  const text = await response.text();


  if (!text) {
    return undefined as T;
  }

  
  return JSON.parse(text);
}