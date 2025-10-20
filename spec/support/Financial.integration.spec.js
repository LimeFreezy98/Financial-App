// Financial.integration.spec.js  Test

let saveTransaction; // will be set after dynamic import

// mock localStorage for Node environment BEFORE importing the module
beforeAll(async () => {
  global.localStorage = {
    store: {},

    getItem(key) {
      return this.store[key] || null;
    },

    setItem(key, value) {
      this.store[key] = value.toString();
    },

    removeItem(key) {
      delete this.store[key];
    },

    clear() {
      this.store = {};
    },
  };

  // dynamic import AFTER localStorage mock exists
  const mod = await import("../../helper2.js");
  saveTransaction = mod.saveTransaction;
});

describe("Add Transaction Integration", () => {

  beforeEach(() => {
    localStorage.clear(); // clear before each test
  });

  it("should save a valid transaction to localStorage", () => {
    const tx = {
      type: "Income",
      category: "Salary",
      amount: 1000,
      date: "2025-10-15",
      notes: "October paycheck"
    };

    saveTransaction(tx);

    const stored = JSON.parse(localStorage.getItem("transactions"));
    expect(stored).toBeDefined();
    expect(stored.length).toBe(1);
    expect(stored[0]).toEqual(tx);
  });

  it("should throw an error if transaction is invalid", () => {
    const tx = {
      type: "", // invalid
      category: "Food",
      amount: -50,
      date: "",
      notes: ""
    };

    expect(() => saveTransaction(tx)).toThrowError("Invalid transaction");
    const stored = JSON.parse(localStorage.getItem("transactions"));
    // getItem returns null when nothing set, so guard that:
    expect(stored || []).toEqual([]);
  });
  
});