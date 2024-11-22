import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useExpenseContext } from "../state/expenseContext";
import { ReactNode, useEffect, useMemo } from "react";
import { SelectFieldWOFormik } from "./helpers/SelectFieldWOFormik";
import { DateFieldNoFormik } from "./helpers/DateFieldNoFormik";

export const ExpenseFilters = () => {
  const { state, dispatch } = useExpenseContext();
  const { startDate, endDate, categoryFilter, expenses } = state;

  const uniqueCategories = useMemo(() => {
    const categories = Array.from(
      new Set(state.expenses.map((expense) => expense.category))
    ).map((category) => ({ value: category, label: category }));

    categories.unshift({ value: "all", label: "All" });

    return categories;
  }, [state.expenses]);

  return (
    <div className="ExpenseFilter">
      <h3>Expense Filter</h3>
      <div className="FilterSection">
        <DateFieldNoFormik
          value={startDate}
          onChange={(date) =>
            dispatch({
              type: "Filter_StartDate",
              payload: date ? (date as Date) : null,
            })
          }
          maxDate={endDate === null ? new Date() : endDate}
          readOnly={false}
          label={"Start date"}
        />

        <DateFieldNoFormik
          value={endDate}
          onChange={(date) =>
            dispatch({
              type: "Filter_EndDate",
              payload: date ? (date as Date) : null,
            })
          }
          minDate={startDate === null ? undefined : startDate}
          maxDate={new Date()}
          readOnly={false}
          label={"End date"}
        />

        <SelectFieldWOFormik
          options={uniqueCategories}
          value={
            uniqueCategories?.find((option) => option.value === categoryFilter)
              ?.value
          }
          onChange={(e: any) => {
            dispatch({
              type: "Filter_Category",
              payload: e?.target?.value, //e?.value,
            });
          }}
          label="Category: "
          id={"categoryFilter"}
        />
      </div>
    </div>
  );
};
