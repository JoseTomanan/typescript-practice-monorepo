import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';



@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: "iPhone 15",
      price: 59999,
      stock: 10,
      categoryId: 1
    },
    {
      id: 2,
      name: "Samsung S25",
      price: 54999,
      stock: 8,
      categoryId: 1
    },
  ];
  
  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  create(product: Omit<Product, 'id'>): Product {
    const newProduct = { id: this.products.length + 1, ...product };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, updatedProduct: Partial<Product>): Product | null {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1)
      return null;

    this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
    return this.products[productIndex];
  }

  remove(id: number): Product | null {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1)
      return null;
    
    const removedProduct = this.products.splice(productIndex, 1);
    return removedProduct[0];
  }
}
