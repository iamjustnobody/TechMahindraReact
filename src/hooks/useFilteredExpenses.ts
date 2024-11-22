import { useMemo } from "react";
import { isBefore, isAfter } from "date-fns";
import { Expense } from "../state/expenseReducer";

export const useFilteredExpenses = (
  expenses: Expense[],
  startDate: Date | null,
  endDate: Date | null,
  categoryFilter: string
) => {
  return useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      // filter by date range
      if (
        (startDate && isBefore(expenseDate, startDate)) ||
        (endDate && isAfter(expenseDate, endDate))
      ) {
        return false;
      }

      // filter by category
      if (categoryFilter !== "all" && expense.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [expenses, startDate, endDate, categoryFilter]);
};
