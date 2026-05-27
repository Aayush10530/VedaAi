import { format, parseISO } from 'date-fns';

export function formatDate(dateString: string | Date): string {
  try {
    const d = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(d, 'dd-MM-yyyy');
  } catch (error) {
    return String(dateString);
  }
}
