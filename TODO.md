*No AI work is present (or should be present) in this repository as much as possible. This repository is for learning purposes for the internship.*

# TODO

Create a Notion-style (as identical as possible) tasks tracker that integrates with a spreadsheet in Google Sheets via Clasp and GAS API.
Refer to previous project `money-sheet-monorepo` to learn how the whole integration flow works.

## Module Checklist

- [x] Beginner's TS
- [x] React w TS
- [ ] NextJS

---

# NestJS Mini Exercise: Products & Categories API

**Objective:** Build a simple e-commerce API that manages products and categories using NestJS.

> Use **in-memory arrays** (no database).

---

## 📺 Video Tutorial Reference

Every concept needed for this exercise is covered in this walkthrough. Use the timestamps to jump to the relevant lesson.

| Time | Topic | Exercise Section |
| ---- | ----- | ---------------- |
| [0:00:00](https://www.youtube.com/watch?v=21_I-12f5JE) | Why NestJS? | Intro |
| [0:03:40](https://www.youtube.com/watch?v=21_I-12f5JE&t=220s) | DevMatch – A Dating App For Developers | Intro |
| [0:05:08](https://www.youtube.com/watch?v=21_I-12f5JE&t=308s) | Setup | — |
| [0:07:21](https://www.youtube.com/watch?v=21_I-12f5JE&t=441s) | Modules & Decorators | §1 Create Modules |
| [0:10:18](https://www.youtube.com/watch?v=21_I-12f5JE&t=618s) | Controller (GET) All Profiles | §2 / §3 GET all |
| [0:15:00](https://www.youtube.com/watch?v=21_I-12f5JE&t=900s) | Controller (GET) Single Profile | §2 / §3 GET by ID |
| [0:17:24](https://www.youtube.com/watch?v=21_I-12f5JE&t=1044s) | Controller (POST) | §2 / §3 POST |
| [0:23:35](https://www.youtube.com/watch?v=21_I-12f5JE&t=1415s) | Controller (PUT) | §2 / §3 PUT |
| [0:26:19](https://www.youtube.com/watch?v=21_I-12f5JE&t=1579s) | Controller (DELETE) | §2 / §3 DELETE |
| [0:29:37](https://www.youtube.com/watch?v=21_I-12f5JE&t=1777s) | Service (Get All Profiles) | §1 Service logic |
| [0:32:59](https://www.youtube.com/watch?v=21_I-12f5JE&t=1979s) | Service (Get Single Profile) | §1 Service logic |
| [0:36:49](https://www.youtube.com/watch?v=21_I-12f5JE&t=2209s) | Service (Create Profile) | §1 Service logic |
| [0:46:01](https://www.youtube.com/watch?v=21_I-12f5JE&t=2761s) | Service (Update Profile) | §1 Service logic |
| [0:51:20](https://www.youtube.com/watch?v=21_I-12f5JE&t=3080s) | Service (Remove Profile) | §1 Service logic |
| [0:54:47](https://www.youtube.com/watch?v=21_I-12f5JE&t=3287s) | Exception Filters – Bubbling Up | §6 Exception Handling |
| [1:02:34](https://www.youtube.com/watch?v=21_I-12f5JE&t=3754s) | Exception Filters – Challenges | §6 Exception Handling |
| [1:07:00](https://www.youtube.com/watch?v=21_I-12f5JE&t=4020s) | Handling exceptions in the controller | §6 Exception Handling |
| [1:10:09](https://www.youtube.com/watch?v=21_I-12f5JE&t=4209s) | Pipes (Transformation) | §5 `ParseIntPipe` |
| [1:14:58](https://www.youtube.com/watch?v=21_I-12f5JE&t=4498s) | Pipes (Validation) | §5 `ValidationPipe` + DTOs |
| [1:20:41](https://www.youtube.com/watch?v=21_I-12f5JE&t=4841s) | Intro To Guards | §7 Guard (Bonus) |
| [1:24:14](https://www.youtube.com/watch?v=21_I-12f5JE&t=5054s) | Outro | — |

> 💡 The video uses a "Profiles" dating-app example. In this exercise you apply the same patterns to **Products** and **Categories**.

---

## Entities

### Category

```ts
{
  id: number;
  name: string;
}
```

### Product

```ts
{
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
}
```

---

## 1. Create Modules

Create:

- `products` module
- `categories` module

Each module should have:

- Controller
- Service

---

## 2. Category Endpoints

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/categories`     | Get all categories   |
| GET    | `/categories/:id` | Get category by ID   |
| POST   | `/categories`     | Create category      |
| PUT    | `/categories/:id` | Update category      |
| DELETE | `/categories/:id` | Delete category      |

---

## 3. Product Endpoints

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/products`     | Get all products   |
| GET    | `/products/:id` | Get product by ID  |
| POST   | `/products`     | Create product     |
| PUT    | `/products/:id` | Update product     |
| DELETE | `/products/:id` | Delete product     |

---

## 4. Relationship Challenge

Add an endpoint:

```
GET /categories/:id/products
```

**Example Response:**

```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "price": 59999,
    "stock": 10,
    "categoryId": 1
  },
  {
    "id": 2,
    "name": "Samsung S25",
    "price": 54999,
    "stock": 8,
    "categoryId": 1
  }
]
```

---

## 5. Validation

### CreateCategoryDto

```ts
export class CreateCategoryDto {
  @IsString()
  name: string;
}
```

### CreateProductDto

```ts
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsInt()
  categoryId: number;
}
```

**Use:**

- `ValidationPipe`
- `ParseIntPipe`

---

## 6. Exception Handling

Throw exceptions when:

- Product not found
- Category not found
- Category does not exist when creating a product

**Example:**

```ts
throw new NotFoundException('Category not found');
```

---

## 7. Guard (Bonus)

Protect **create / update / delete** endpoints using:

```
x-api-key: ecommerce123
```

---

## Bonus Challenges

### Challenge 1

Add:

```
GET /products?categoryId=1
```

Filter products by category.

### Challenge 2

Return category details with product:

```json
{
  "id": 1,
  "name": "iPhone 15",
  "price": 59999,
  "stock": 10,
  "category": {
    "id": 1,
    "name": "Electronics"
  }
}
```

### Challenge 3

Prevent deletion of a category if products are assigned to it.

```ts
throw new BadRequestException(
  'Cannot delete category with existing products'
);
```

---

## 🟡 Intermediate Challenges

### Challenge 4 — Pagination

Add pagination to `GET /products`:

```
GET /products?page=1&limit=5
```

Return both the data and metadata:

```json
{
  "data": [ /* products */ ],
  "meta": {
    "total": 23,
    "page": 1,
    "limit": 5,
    "totalPages": 5
  }
}
```

> Tip: use a `PaginationQueryDto` with `@IsOptional()`, `@IsInt()`, `@Min(1)` and `@Type(() => Number)`.

### Challenge 5 — Search by Name

Add a case-insensitive search:

```
GET /products?search=phone
```

Should match `iPhone 15`, `Galaxy Phone`, etc. Combine it with the existing `categoryId` filter so both can be used together.

### Challenge 6 — Price Range Filter

```
GET /products?minPrice=10000&maxPrice=60000
```

Return only products whose price falls within the range (inclusive). Validate that `minPrice <= maxPrice`, otherwise throw a `BadRequestException`.

### Challenge 7 — Partial Update with PATCH

Add a `PATCH /products/:id` endpoint that updates only the provided fields. Build the DTO with NestJS's `PartialType`:

```ts
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

### Challenge 8 — Stronger Validation

Tighten the DTO rules:

```ts
export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  categoryId: number;
}
```

Enable `whitelist: true` and `forbidNonWhitelisted: true` in your `ValidationPipe` so unexpected fields are rejected.

---