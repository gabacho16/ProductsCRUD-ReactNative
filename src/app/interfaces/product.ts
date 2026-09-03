export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isDeleted: boolean;
  image: string;
  categoryId: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}
