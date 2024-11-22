import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import {
  expenseReducer,
  initialState,
  Expense,
  Action,
  State,
} from "./expenseReducer";

interface ContextProps {
  state: State; //{ expenses: Expense[]; generating: boolean };
  dispatch: Dispatch<Action>;
}

const parseDates = (state: State): State => {
  return {
    ...state,
    expenses: state.expenses.map((expense) => ({
      ...expense,
      date: new Date(expense.date), // convert string back to Date object
    })),
    startDate: state.startDate ? new Date(state.startDate) : null,
    endDate: state.endDate ? new Date(state.endDate) : null,
  };
};

const loadStateFromLocalStorage = (): State => {
  const savedState = localStorage.getItem("expenseState");
  const state = savedState ? JSON.parse(savedState) : initialState;
  return parseDates(state);
};

const ExpenseContext = createContext<ContextProps | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    expenseReducer,
    loadStateFromLocalStorage()
  ); //useReducer(expenseReducer, initialState)

  React.useEffect(() => {
    localStorage.setItem("expenseState", JSON.stringify(state));
  }, [state]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = React.useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
};
