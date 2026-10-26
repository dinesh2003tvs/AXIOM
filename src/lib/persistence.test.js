import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "../data/seed.js";
import { clearAppState, loadAppState, saveAppState, STORAGE_KEY } from "./persistence.js";

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
    get: key => values.get(key)
  };
}

describe("browser state persistence", () => {
  it("loads seeded demo state when storage is empty", () => {
    const result = loadAppState(createStorage());
    assert.equal(result.state.version, 1);
    assert.equal(result.state.projects.length, 6);
    assert.equal(result.canPersist, true);
    assert.equal(result.warning, "");
  });

  it("round trips app state through the versioned storage key", () => {
    const storage = createStorage();
    const state = createInitialState();
    state.role = "PM";
    saveAppState(state, storage);

    const result = loadAppState(storage);
    assert.equal(storage.get(STORAGE_KEY) !== undefined, true);
    assert.equal(result.state.role, "PM");
    assert.deepEqual(result.state.projects, state.projects);
    assert.equal(result.canPersist, true);
  });

  it("does not overwrite malformed saved data before an explicit restore", () => {
    const storage = createStorage({ [STORAGE_KEY]: "{not valid json" });
    const result = loadAppState(storage);

    assert.equal(result.canPersist, false);
    assert.match(result.warning, /could not be read/);
    assert.equal(storage.get(STORAGE_KEY), "{not valid json");
  });

  it("does not overwrite a saved state with an unsupported version", () => {
    const saved = JSON.stringify({ ...createInitialState(), version: 2 });
    const storage = createStorage({ [STORAGE_KEY]: saved });
    const result = loadAppState(storage);
    assert.equal(result.canPersist, false);
    assert.match(result.warning, /unsupported version/);
    assert.equal(storage.get(STORAGE_KEY), saved);
  });

  it("reports unavailable browser storage instead of throwing during load", () => {
    const result = loadAppState();
    assert.equal(result.canPersist, false);
    assert.match(result.warning, /could not be read/);
  });

  it("surfaces storage write failures", () => {
    const storage = { setItem() { throw new Error("quota exceeded"); } };
    assert.throws(() => saveAppState(createInitialState(), storage), /could not save changes in browser storage: quota exceeded/);
  });

  it("removes only the AXIOM state key when restoring", () => {
    const storage = createStorage({ [STORAGE_KEY]: "saved", unrelated: "keep" });
    clearAppState(storage);
    assert.equal(storage.get(STORAGE_KEY), undefined);
    assert.equal(storage.get("unrelated"), "keep");
  });
});
