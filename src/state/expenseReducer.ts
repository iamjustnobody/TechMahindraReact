export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: Date;
}

export interface State {
  expenses: Expense[];
  generating: boolean;
  startDate: Date | null;
  endDate: Date | null;
  categoryFilter: string;
}

export interface Action {
  type:
    | "ADD_EXPENSE"
    | "REMOVE_EXPENSE"
    | "ADD_EXPENSE_START"
    | "ADD_EXPENSE_FAIL"
    | "Filter_StartDate"
    | "Filter_EndDate"
    | "Filter_Category";
  payload?: Expense | string | Date | null;
}

export const initialState: State = {
  expenses: [],
  generating: false,
  startDate: null,
  endDate: null,
  categoryFilter: "all",
};

export const expenseReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_EXPENSE_START":
      return { ...state, generating: true };
    case "ADD_EXPENSE":
      if (!action.payload) return state;
      const newState = {
        ...state,
        expenses: [...state.expenses, action.payload as Expense].sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        ),
        generating: false,
      };
      localStorage.setItem("expenseState", JSON.stringify(newState));
      return newState;
    case "ADD_EXPENSE_FAIL":
      return { ...state, generating: false };
    case "REMOVE_EXPENSE":
      if (!action.payload) return state;
      const updatedExpenses = state.expenses.filter(
        (expense) =>
          expense.id !==
          (typeof action.payload == "string"
            ? action.payload
            : (action.payload as Expense)?.id)
      );
      return {
        ...state,
        expenses: updatedExpenses.sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        ),
      };
    case "Filter_StartDate":
      // if (typeof action.payload === "string") return state;
      return { ...state, startDate: action.payload as Date | null };
    case "Filter_EndDate":
      // if (typeof action.payload === "string") return state;
      return { ...state, endDate: action.payload as Date | null };
    case "Filter_Category":
      return {
        ...state,
        categoryFilter: action.payload as State["categoryFilter"],
      };
    default:
      return state;
  }
};
