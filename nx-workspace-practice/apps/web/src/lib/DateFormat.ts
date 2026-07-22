export function formatDisplayDate(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}

export function toDateInputValue(date: Date | string | undefined): string | undefined {
  return date?.toString().slice(0, 10);
}
