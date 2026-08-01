export interface SubCategory {
  id: string;
  name: string;
  tags: string[];
  nsfw?: boolean;
}

export interface TagCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  enabled: boolean;
  nsfw?: boolean;
  subcategories: SubCategory[];
}

/**
 * Convert a human-readable tag to Danbooru underscore format.
 * "blonde hair" → "blonde_hair"
 * Preserves tags that are already correct (single-word, hyphenated, emoticons…).
 */
export function toTag(s: string): string {
  // Don't touch short emoticon-style tags like :d, :3, ^_^, >_<, ;_;, T_T, etc.
  if (s.length <= 4 && /[^a-zA-Z ]/.test(s)) return s;
  return s.replace(/ /g, '_');
}

/** Convert underscore tags back to display text */
export type TagDisplayMode = 'space' | 'underscore';

export function fromTag(s: string): string {
  if (s.length <= 4 && /[^a-zA-Z_ ]/.test(s)) return s;
  return s.replace(/_/g, ' ');
}

/** Format a single tag by display mode */
export function formatTagByMode(tag: string, mode: TagDisplayMode): string {
  return mode === 'space' ? fromTag(tag) : tag;
}

/** Format a full prompt string by display mode */
export function formatPromptByMode(prompt: string, mode: TagDisplayMode): string {
  if (!prompt) return '';
  return prompt
    .split(', ')
    .map(tag => formatTagByMode(tag, mode))
    .join(', ');
}

/** Backward-compatible helper: default display is space mode */
export function formatPromptForDisplay(prompt: string): string {
  return formatPromptByMode(prompt, 'space');
}

/** Get the Danbooru-formatted tags array for a subcategory */
export function formatTags(sub: SubCategory): string[] {
  return sub.tags.map(toTag);
}

export function getTotalTags(cat: TagCategory, includeNsfw: boolean): number {
  return cat.subcategories
    .filter(s => includeNsfw || !s.nsfw)
    .reduce((sum, sub) => sum + sub.tags.length, 0);
}

export function getAllTags(cat: TagCategory, includeNsfw: boolean): string[] {
  return cat.subcategories
    .filter(s => includeNsfw || !s.nsfw)
    .flatMap(s => s.tags.map(toTag));
}

export function getVisibleSubcategories(cat: TagCategory, includeNsfw: boolean): SubCategory[] {
  return cat.subcategories.filter(s => includeNsfw || !s.nsfw);
}

export { defaultCategories } from './categoryData';
