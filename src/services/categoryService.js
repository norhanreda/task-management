import { apiFetch } from '../utils/fetchClient';

export async function fetchCategories() {
  return apiFetch('categories?order=name.asc');
}
