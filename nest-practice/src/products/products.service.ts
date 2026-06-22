import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { Product } from './domain/product.entity';
import { CreateProductDto } from './presentation/create-product.dto';
import { UpdateProductDto } from './presentation/update-product.dto';
import { PaginationQueryResult } from './presentation/pagination-query.dto';
import { ReplaceProductDto } from './presentation/replace-product.dto';



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
  
  /**
   * For GET /products
   */
  findAll(
    categoryId?: number,
    page?: number,
    limit?: number,
    search?: string,
  ): PaginationQueryResult<Product> {
    const decasedSearch: string | null = search
          ? search.toLowerCase()
          : null;

    if (!page || !limit)
      return {
        data: this.products,
        meta: {
          total: this.products.length,
          page: 1,
          limit: this.products.length,
          totalPages: 1,
        },
      };

    const startIndex: number = (page - 1) * limit;
    const endIndex: number = startIndex + limit;
    let filteredProducts: Product[] = categoryId
          ? this.products.filter(product => product.categoryId === categoryId)
          : this.products;

    if (decasedSearch)
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(decasedSearch)
      );

    return {
      data: filteredProducts.slice(startIndex, endIndex),
      meta: {
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
    };
  }

  /**
   * For GET /products/:id
   */
  findOne(id: number): Product {
    const product = this.products.find(product => product.id === id);
    if (!product)
      throw new NotFoundException("Product not found");

    return product;
  }

  /**
   * For POST /products
   */
  create(product: CreateProductDto): Product {
    const categoryExists = this.products.some(product => product.categoryId === product.categoryId);
    if (!categoryExists)
      throw new NotFoundException("Category does not exist");

    const newProduct: Product = {
      id: this.products.length + 1,
      ...product
    };
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * For PUT /products/:id
   */
  replace(id: number, newProduct: ReplaceProductDto): Product {
    const productIndex = this.products.findIndex(
      product => product.id === id
    );

    if (productIndex === -1)
      throw new NotFoundException("Product not found");

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...newProduct
    };
    return this.products[productIndex];
  }
  
  // PATCH /products/:id
  update(id: number, updatedProduct: UpdateProductDto): Product {
    const productIndex = this.products.findIndex(
      product => product.id === id
    );

    if (productIndex === -1)
      throw new NotFoundException("Product not found");

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedProduct
    };
    return this.products[productIndex];
  }

  /**
   * For DELETE /products/:id
   */
  remove(id: number): Product {
    const productIndex = this.products.findIndex(
      product => product.id === id
    );

    if (productIndex === -1)
      throw new NotFoundException("Product not found");
    
    const removedProduct = this.products.splice(productIndex, 1);
    return removedProduct[0];
  }
}
