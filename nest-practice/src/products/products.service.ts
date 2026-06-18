import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';



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
    {
      id: 3,
      name: "LG Refrigerator",
      price: 79999,
      stock: 5,
      categoryId: 2
    },
    {
      id: 4,
      name: "Honda Chassis",
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

  create(product: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.products.length + 1,
      ...product
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, updatedProduct: UpdateProductDto): Product | null {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1)
      return null;

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedProduct
    };
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
