import { FindAllProductsUseCase } from './find-all-products.use-case';
import { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';

describe('FindAllProductsUseCase', () => {
  let useCase: FindAllProductsUseCase;
  let products: Product[];
  let repository: ProductRepository;

  beforeEach(() => {
    products = [
      { id: 1, name: 'iPhone 15', price: 59999, stock: 10, categoryId: 1 },
      { id: 2, name: 'Galaxy Phone', price: 54999, stock: 8, categoryId: 1 },
      { id: 3, name: 'LG Refrigerator', price: 79999, stock: 5, categoryId: 2 },
      { id: 4, name: 'Galaxy Tab', price: 29999, stock: 3, categoryId: 3 },
    ];

    repository = {
      findAll: () => [...products],
      findOne: id => products.find(product => product.id === id),
      save: product => product,
      remove: () => undefined,
    };

    useCase = new FindAllProductsUseCase(repository);
  });

  it('matches products case-insensitively by name', () => {
    const result = useCase.execute(undefined, undefined, undefined, 'phone');

    expect(result.data.map(product => product.name)).toEqual(
      expect.arrayContaining(['iPhone 15', 'Galaxy Phone']),
    );
    expect(result.data).toHaveLength(2);
  });

  it('matches regardless of the casing used in the query', () => {
    const result = useCase.execute(undefined, undefined, undefined, 'PHONE');

    expect(result.data.map(product => product.name)).toEqual(
      expect.arrayContaining(['iPhone 15', 'Galaxy Phone']),
    );
  });

  it('combines search with the categoryId filter', () => {
    const result = useCase.execute(1, undefined, undefined, 'galaxy');

    expect(result.data).toEqual([
      expect.objectContaining({ name: 'Galaxy Phone', categoryId: 1 }),
    ]);
  });

  it('returns no results when categoryId excludes the only search match', () => {
    const result = useCase.execute(3, undefined, undefined, 'phone');

    expect(result.data).toEqual([]);
  });

  it('returns all products when no search term is provided', () => {
    const result = useCase.execute();

    expect(result.data).toHaveLength(products.length);
  });

  it('returns an empty result when nothing matches the search term', () => {
    const result = useCase.execute(undefined, undefined, undefined, 'nonexistent');

    expect(result.data).toEqual([]);
  });
});
