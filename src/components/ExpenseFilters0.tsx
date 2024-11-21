import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useExpenseContext } from "../state/expenseContext";
import { ReactNode, useEffect, useMemo } from "react";
import { SelectFieldWOFormik } from "./helpers/SelectFieldWOFormik";

export const ExpenseFilters = () => {
  const { state, dispatch } = useExpenseContext();
  const { startDate, endDate, categoryFilter, expenses } = state;
  // useEffect(() => console.log(startDate), [startDate]);

  // const uniqueCategories = useMemo(() => {
  //   // return [...new Set(expenses.map(expense => expense.category))];
  //   return Array.from(
  //     new Set(state.expenses.map((expense) => expense.category))
  //   ).map((arr) => ({ value: arr, label: arr }));
  // }, [state.expenses]);
  // const uniqueCategories = state.expenses.reduce((categories, expense) => {
  //   if (!categories.includes(expense.category)) {
  //     categories.push(expense.category);
  //   }
  //   return categories;
  // }, []);

  const uniqueCategories = useMemo(() => {
    const categories = Array.from(
      new Set(state.expenses.map((expense) => expense.category))
    ).map((category) => ({ value: category, label: category }));

    categories.unshift({ value: "all", label: "All" });

    return categories;
  }, [state.expenses]);

  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <div>
        <label>Start Date: </label>
        {/* <DatePicker
          selected={startDate}
          onChange={(date) =>
            dispatch({ type: "Filter_StartDate", payload: startDate as Date })
          }
          maxDate={endDate === null ? undefined : endDate}
        /> */}
        <DatePicker
          // id="startDate"
          selected={startDate}
          onChange={(date) =>
            dispatch({
              type: "Filter_StartDate",
              payload: date ? (date as Date) : null,
            })
          }
          // onSelect={(date) =>
          //   dispatch({ type: "Filter_StartDate", payload: date as Date })
          // }

          dateFormat="yyyy-MM-dd"
          maxDate={endDate === null ? new Date() : endDate}
          // dateFormat="Pp"
          // locale={"en-US"}
          readOnly={false}
          placeholderText={"Start date..."}
        />
      </div>
      <div>
        <label>End Date: </label>
        {/* <DatePicker
          selected={endDate}
          onChange={(date) =>
            dispatch({ type: "Filter_EndDate", payload: endDate as Date })
          }
          minDate={startDate === null ? undefined : startDate}
        /> */}
        <DatePicker
          // id="endDate"
          selected={endDate}
          onChange={(date) =>
            dispatch({
              type: "Filter_EndDate",
              payload: date ? (date as Date) : null,
            })
          }
          // onSelect={(date) =>
          //   dispatch({ type: "Filter_EndDate", payload: date as Date })
          // }

          dateFormat="yyyy-MM-dd"
          minDate={startDate === null ? undefined : startDate}
          maxDate={new Date()}
          // dateFormat="Pp"
          // locale={"en-US"}
          readOnly={false}
          placeholderText={"End date..."}
        />
      </div>
      <div>
        {/* <label>Category: </label>
        <select
          value={categoryFilter}
          onChange={(e) =>
            dispatch({
              type: "Filter_Category",
              payload: categoryFilter as string,
            })
          }
        >
          <option value="All">All</option>
          {Array.from(new Set(state.expenses.map((exp) => exp.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select> */}
        <SelectFieldWOFormik
          options={uniqueCategories}
          value={uniqueCategories?.find(
            (option) => option.value === categoryFilter
          )}
          onChange={(e: any) => {
            dispatch({
              type: "Filter_Category",
              payload: e?.value, //categoryFilter as string,
            });
          }}
          label="Category: "
          id={"categoryFilter"}
        />
      </div>
    </div>
  );
};
