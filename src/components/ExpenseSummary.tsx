import React, { useMemo } from "react";
import { Expense } from "../state/expenseReducer";
import { useExpenseContext } from "../state/expenseContext";
import { format, parse } from "date-fns";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface ExpenseSummaryProps {
  groupedExpenses: Record<string, Record<string, number>>;
  filteredExpenses: Expense[];
  timeFrame: "day" | "week" | "month";
}
export function capitalizeFirstCharacter(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  groupedExpenses,
  filteredExpenses,
  timeFrame,
}) => {
  // total spending for selected time period
  //   const totalSpending = filteredExpenses.reduce(
  //     (acc, expense) => acc + expense.amount,
  //     0
  //   );
  const totalSpending = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [filteredExpenses]);

  //  summary for grouped data - total spending for each selected time frame
  //   const summary = Object.keys(groupedExpenses).map((key) => {
  //     const total = groupedExpenses[key].total || 0;
  //     return { timeFrame: key, total };
  //   });
  const summary = useMemo(() => {
    return Object.keys(groupedExpenses).map((key) => {
      const total = groupedExpenses[key].total || 0;
      return { timeFrame: key, total };
    });
  }, [groupedExpenses]);

  const { state } = useExpenseContext();
  const { startDate, endDate, expenses, categoryFilter } = state;
  return (
    <div className="expense-summary">
      <h3>Expense Summary</h3>
      <p>
        Total Spending
        {startDate ? ` from ${format(startDate, "dd MMM yyyy")}` : ""}
        {endDate ? ` to ${format(endDate, "dd MMM yyyy")}` : ""}:{" "}
        <strong>£{totalSpending.toFixed(2)}</strong>
      </p>
      <div className="grouped-expenses-summary">
        <h4>
          Spending Breakdown for Each {capitalizeFirstCharacter(timeFrame)}
        </h4>
        {/* <ul>
          {summary.map((entry) => (
            <li key={entry.timeFrame}>
              {entry.timeFrame}: £{entry.total.toFixed(2)}
            </li>
          ))}
        </ul> */}
        <div className="SummaryBreakdown">
          <List>
            {summary.map((entry) => (
              <ListItem key={entry.timeFrame} divider>
                <ListItemText
                  primary={
                    timeFrame === "day"
                      ? convertToDayFormat(entry.timeFrame)
                      : timeFrame === "week"
                      ? `Week of ${convertToDayFormat(entry.timeFrame)}`
                      : convertToMonthFormat(entry.timeFrame)
                  }
                  secondary={`£${entry.total.toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;

//convert 'yyyy-MM-dd' to 'dd MMM yyyy'
const convertToDayFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  return format(parsedDate, "dd MMM yyyy");
};

// convert 'yyyy-MM' to 'MMM yyyy'
const convertToMonthFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "yyyy-MM", new Date());
  return format(parsedDate, "MMM yyyy");
};
