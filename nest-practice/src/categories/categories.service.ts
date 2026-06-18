import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
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
    const categoryIndex = this.categories.findIndex(category => category.id === id);

    if (categoryIndex === -1)
      return null;

    this.categories[categoryIndex].name = name;
    return this.categories[categoryIndex];
  }

  remove(id: number): Category | null {
    const categoryIndex = this.categories.findIndex(category => category.id === id);

    if (categoryIndex === -1)
      return null;
    
    const removedCategory = this.categories.splice(categoryIndex, 1);
    return removedCategory[0];
  }
}
