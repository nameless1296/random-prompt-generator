export interface SubCategory {
  id: string;
  name: string;
  tags: string[];
}
export interface TagCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  enabled: boolean;
  subcategories: SubCategory[];
}
/**
 * Convert a human-readable tag to Danbooru underscore format.
 * "blonde hair" → "blonde_hair"
 */
export function toTag(s: string): string {
  if (s.length <= 4 && /[^a-zA-Z ]/.test(s)) return s;
  return s.replace(/ /g, '_');
}
export type TagDisplayMode = 'space' | 'underscore';
export function fromTag(s: string): string {
  if (s.length <= 4 && /[^a-zA-Z_ ]/.test(s)) return s;
  return s.replace(/_/g, ' ');
}
export function formatTagByMode(tag: string, mode: TagDisplayMode): string {
  return mode === 'space' ? fromTag(tag) : tag;
}
export function formatPromptByMode(prompt: string, mode: TagDisplayMode): string {
  if (!prompt) return '';
  return prompt
    .split(', ')
    .map(tag => formatTagByMode(tag, mode))
    .join(', ');
}
export function formatPromptForDisplay(prompt: string): string {
  return formatPromptByMode(prompt, 'space');
}
export function formatTags(sub: SubCategory): string[] {
  return sub.tags.map(toTag);
}
export function getTotalTags(cat: TagCategory): number {
  return cat.subcategories.reduce((sum, sub) => sum + sub.tags.length, 0);
}
export function getAllTags(cat: TagCategory): string[] {
  return cat.subcategories.flatMap(s => s.tags.map(toTag));
}
export function getVisibleSubcategories(cat: TagCategory): SubCategory[] {
  return cat.subcategories;
}
export { defaultCategories } from './categoryData';
