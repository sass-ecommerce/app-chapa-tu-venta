import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logError(label: string, err: unknown) {
  if (axios.isAxiosError(err)) {
    console.error(label, err.response?.data);
  } else {
    console.error(label, err);
  }
}
