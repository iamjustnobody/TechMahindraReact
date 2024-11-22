import { useFormikContext } from "formik";
import { useExpenseContext } from "../../state/expenseContext";
import { Expense } from "../ExpenseInput";
import Button, { ButtonOwnProps } from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

export const ButtonWFormik = ({
  errMsg,
  label,
  onClick,
  children,
  className,
  variant,
  size,
  color,
  buttonOwnProps,
}: {
  errMsg?: string | null;
  label?: string | null;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "text" | "contained" | "outlined";
  color?: "success" | "error";
  buttonOwnProps?: ButtonOwnProps;
}) => {
  const { state, dispatch } = useExpenseContext();
  const { values } = useFormikContext<Expense>();
  const { category, amount, date } = values;
  return (
    <div>
      {state.generating ? (
        <LoadingButton loading variant="outlined">
          Submiting
        </LoadingButton>
      ) : (
        <Button
          variant={variant ?? "contained"}
          size={size ?? "medium"}
          color={color}
          type="submit"
          disabled={
            state.generating || !category || !amount || amount <= 0 || !date
          }
          onClick={onClick}
          className={className}
          {...buttonOwnProps}
        >
          {label ?? children ?? "Add Expense"}
        </Button>
      )}
      {errMsg && errMsg.length > 0 && <p>{errMsg}</p>}
    </div>
  );
};
