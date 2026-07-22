/** Injection token for the shared DynamoDBDocumentClient instance. */
export const DYNAMODB_CLIENT = 'DYNAMODB_CLIENT';

/** Single table holding every entity for this app (todos + the id counter). */
export const TODOS_TABLE_NAME = process.env.DYNAMODB_TODOS_TABLE ?? 'Todos';

/** All current data lives under one logical "todo list" partition. */
export const TODO_LIST_PK = 'TODOLIST#1';

export const COUNTER_SK = 'COUNTER';

export const todoSortKey = (id: number) => `TODO#${id}`;
