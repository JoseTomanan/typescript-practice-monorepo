import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from '../../domain/product.repository';

/**
 * Infrastructure: the ONLY place allowed to know the data lives in a
 * plain array. Swapping this for a real database later means writing a
 * new class here — domain/ and application/ stay untouched.
 */
@Injectable()
export class InMemoryProductRepository implements ProductRepository {
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
    {
      id: 3,
      name: "LG Refrigerator",
      price: 79999,
      stock: 5,
      categoryId: 2
    },
    {
      id: 4,
      name: "Chassis for Honda S2000 Lite",
      price: 1999,
      stock: 20,
      categoryId: 3
    },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  save(product: Product): Product {
    const existingIndex = this.products.findIndex(p => p.id === product.id);
    
    if (existingIndex !== -1)
      this.products[existingIndex] = product;
    else
      this.products.push(product);
    
    return product;
  }

  remove(id: number): Product | undefined {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      const [removedProduct] = this.products.splice(productIndex, 1);
      return removedProduct;
    }
    return undefined;
  }
}
