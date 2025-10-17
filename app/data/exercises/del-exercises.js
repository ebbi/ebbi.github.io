// app/data/exercises.js
/**
 * Tiny wrapper that holds the master exercise index.
 * The array is populated once (by ui/menu.js) and then reused.
 */
export const EXERCISES = [];   // ← mutable cache, exported as a live reference