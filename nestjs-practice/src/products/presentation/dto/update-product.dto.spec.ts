import { UpdateProductSchema } from './update-product.dto';

describe('UpdateProductSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    expect(UpdateProductSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a partial update with just name', () => {
    expect(UpdateProductSchema.safeParse({ name: 'New Name' }).success).toBe(true);
  });

  it('accepts a partial update with just price', () => {
    expect(UpdateProductSchema.safeParse({ price: 999 }).success).toBe(true);
  });

  it('accepts a full update with all fields', () => {
    const result = UpdateProductSchema.safeParse({
      name: 'Updated',
      price: 100,
      stock: 5,
      categoryId: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a negative price', () => {
    const result = UpdateProductSchema.safeParse({ price: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects a name that is too short', () => {
    const result = UpdateProductSchema.safeParse({ name: 'x' });
    expect(result.success).toBe(false);
  });

  it('rejects a negative stock', () => {
    const result = UpdateProductSchema.safeParse({ stock: -3 });
    expect(result.success).toBe(false);
  });

  it('rejects a non-string name', () => {
    const result = UpdateProductSchema.safeParse({ name: 123 });
    expect(result.success).toBe(false);
  });
});
