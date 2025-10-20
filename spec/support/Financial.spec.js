// Financial.spec.js  Test
import { calculateTotals } from "../../helper.js";

describe("calculateTotals()", () => {
    it("calculates totals correctly", () => {
      const transactions = [
        { type: "Income", amount: 1000 },
        { type: "Expense", amount: 200 },
        { type: "Expense", amount: 100 },
        { type: "Income", amount: 500 }
      ];
  
      const result = calculateTotals(transactions);
  
      expect(result.totalIncome).toBe(1500);
      expect(result.totalExpenses).toBe(300);
      expect(result.remainingBalance).toBe(1200);
    });
  
    it("returns zeros when transactions are empty", () => {
      const result = calculateTotals([]);
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
      expect(result.remainingBalance).toBe(0);
    });
  });