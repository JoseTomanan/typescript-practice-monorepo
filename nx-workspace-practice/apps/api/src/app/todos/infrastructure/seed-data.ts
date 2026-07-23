import { TodoItem } from 'todo-domain';

/** The same seed data TodosService used to hold in memory. */
export const SEED_TODOS: TodoItem[] = [
  {
    id: 1,
    title: 'Teach the office plant to file its own expense reports',
    description: 'It keeps submitting receipts for sunlight.',
    status: { status: 'in-progress' },
    dateCreated: new Date('2026-07-01'),
    deadline: new Date('2026-08-15'),
  },
  {
    id: 2,
    title: 'Negotiate a ceasefire between the printer and the stapler',
    description: 'Tensions escalated after the Great Paper Jam of Tuesday.',
    status: { status: 'todo' },
    dateCreated: new Date('2026-07-05'),
    deadline: new Date('2026-07-31'),
  },
  {
    id: 3,
    title: 'Alphabetize the ocean',
    status: { status: 'todo' },
    dateCreated: new Date('2026-07-10'),
  },
  {
    id: 4,
    title: 'Return the borrowed thunderstorm to the neighbors',
    description: 'They noticed. It was raining indoors again.',
    status: { status: 'done', dateFinished: new Date('2026-07-18') },
    dateCreated: new Date('2026-06-20'),
  },
];
