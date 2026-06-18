import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    { id: 1, name: 'Smartphones' },
    { id: 2, name: 'Refrigerators' },
    { id: 3, name: 'Motorcycle Parts' },
  ];

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: number): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  create(name: string): Category {
    const newCategory = { id: this.categories.length + 1, name };
    this.categories.push(newCategory);
    return newCategory;
  }

  update(id: number, name: string): Category | null {
    const categoryIdIndex = this.categories.findIndex(category => category.id === id);

    if (categoryIdIndex === -1)
      return null;

    this.categories[categoryIdIndex].name = name;
    return this.categories[categoryIdIndex];
  }

  remove(id: number): Category | null {
    const categoryIdIndex = this.categories.findIndex(category => category.id === id);

    if (categoryIdIndex === -1)
      return null;
    
    const removedCategory = this.categories.splice(categoryIdIndex, 1);
    return removedCategory[0];
  }
}
