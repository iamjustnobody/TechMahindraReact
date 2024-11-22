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
import { categories } from "./ExpenseInput";

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
      <List>
        {filteredExpenses?.map(
          (
            expense //instead of state.expenses?.map
          ) => (
            <ListItem
              alignItems="flex-start"
              divider
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
                    variant="subtitle1" //"body1" "h6"
                    // color="text.primary"
                    sx={{ fontWeight: 500 }}
                  >
                    {/* {`${expense.category} - £${expense.amount}`}  - categories or uniqueCategories from ExpenseFilters.tsx*/}
                    {`${
                      categories.find((cat) => expense.category === cat.value)
                        ?.label
                    } - £${expense.amount}`}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
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
