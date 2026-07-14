import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/category.entity';
import { CategoryRepository } from '../../domain/category.repository';

/**
 * Infrastructure: the ONLY place allowed to know the data lives in a
 * plain array. Swapping this for a real database later means writing a
 * new class here — domain/ and application/ stay untouched.
 */
@Injectable()
export class InMemoryCategoryRepository implements CategoryRepository {
  private categories: Category[] = [
    { id: 1, name: 'Smartphones' },
    { id: 2, name: 'Refrigerators' },
    { id: 3, name: 'Motorcycle Parts' },
  ];

  findAll(): Category[] {
    return [...this.categories];
  }

  findOne(id: number): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  save(category: Category): Category {
    const existingIndex = this.categories.findIndex(c => c.id === category.id);

    if (existingIndex !== -1)
      this.categories[existingIndex] = category;
    else
      this.categories.push(category);

    return category;
  }

  remove(id: number): Category | undefined {
    const categoryIndex = this.categories.findIndex(category => category.id === id);
    if (categoryIndex === -1)
      return undefined;

    const [removedCategory] = this.categories.splice(categoryIndex, 1);
    return removedCategory;
  }
}
