import { createInitialState } from "../data/seed.js";

export const STORAGE_KEY = "axiom.frontend.v1";

const isAppState = value =>
  value &&
  value.version === 1 &&
  ["CXO / Leadership", "PMO", "PM"].includes(value.role) &&
  Array.isArray(value.projects) &&
  Array.isArray(value.drafts) &&
  Array.isArray(value.knowledge) &&
  Array.isArray(value.resources) &&
  Array.isArray(value.attachments) &&
  value.uiPreferences &&
  typeof value.uiPreferences === "object";

export function loadAppState(storage) {
  try {
    const saved = (storage ?? window.localStorage).getItem(STORAGE_KEY);
    if (saved === null) {
      return { state: createInitialState(), canPersist: true, warning: "" };
    }

    const parsed = JSON.parse(saved);
    if (!isAppState(parsed)) {
      return {
        state: createInitialState(),
        canPersist: false,
        warning: "Saved AXIOM data is invalid or from an unsupported version. Restore demo data to continue saving."
      };
    }
    return { state: { ...createInitialState(), ...parsed }, canPersist: true, warning: "" };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown storage error";
    return {
      state: createInitialState(),
      canPersist: false,
      warning: `Saved AXIOM data could not be read: ${detail}. Restore demo data to continue saving.`
    };
  }
}

export function saveAppState(state, storage) {
  try {
    (storage ?? window.localStorage).setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown storage error";
    throw new Error(`AXIOM could not save changes in browser storage: ${detail}`);
  }
}

export function clearAppState(storage) {
  try {
    (storage ?? window.localStorage).removeItem(STORAGE_KEY);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown storage error";
    throw new Error(`AXIOM could not clear browser storage: ${detail}`);
  }
}
