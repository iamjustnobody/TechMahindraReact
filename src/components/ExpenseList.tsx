// ExpenseList.tsx
import React from "react";
import { useExpenseContext } from "../state/expenseContext";
import { useFilteredExpenses } from "../hooks/useFilteredExpenses";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";

const ExpenseList: React.FC = () => {
  const { state, dispatch } = useExpenseContext();
  const { expenses, startDate, endDate, categoryFilter } = state;
  const filteredExpenses = useFilteredExpenses(
    expenses,
    startDate,
    endDate,
    categoryFilter
  );
  const handleRemove = (id: string) => {
    dispatch({ type: "REMOVE_EXPENSE", payload: id });
  };

  return (
    <div className="ExpenseList">
      <h3>Expense List</h3>
      {/* <ul>
        {filteredExpenses?.map(
          (
            expense //instead of state.expenses?.map
          ) => (
            <li key={expense.id}>
              {expense.category} - ${expense.amount} on{" "}
              {expense.date.toISOString()}
              <button onClick={() => handleRemove(expense.id)}>Remove</button>
            </li>
          )
        )}
      </ul> */}
      <List>
        {filteredExpenses?.map(
          (
            expense //instead of state.expenses?.map
          ) => (
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemove(expense.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                // primary={`${expense.category} - £${expense.amount}`}
                // secondary={
                //   <>
                //     <Typography
                //       component="span"
                //       variant="body2"
                //       color="text.primary"
                //     >
                //       {format(expense.date, "MMM d, yyyy")}
                //     </Typography>
                //     <br />
                //     <Typography
                //       component="span"
                //       variant="body2"
                //       color="text.secondary"
                //     >
                //       Tertiary Text
                //     </Typography>
                //   </>
                // }
                primary={
                  <Typography
                    // variant="h6" // Larger size for primary text
                    // color="text.primary" // Default primary color
                    // sx={{ fontWeight: "bold" }} // Optional: make it bold
                    variant="subtitle1" //"body1" // Smaller size for primary text
                    color="text.primary" // Primary color
                    sx={{ fontWeight: 500 }} // Medium font weight
                  >
                    {`${expense.category} - £${expense.amount}`}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2" // Smaller size for secondary text
                    color="text.secondary" // Secondary color (lighter shade)
                  >
                    {format(expense.date, "MMM d, yyyy")}
                  </Typography>
                }
              />
              {/* <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction> */}
            </ListItem>
          )
        )}
      </List>
    </div>
  );
};

export default ExpenseList;
