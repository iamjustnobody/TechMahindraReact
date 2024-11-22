import { useFormikContext } from "formik";
import { useExpenseContext } from "../../state/expenseContext";
import { Expense } from "../ExpenseInput";
import Button, { ButtonOwnProps } from "@mui/material/Button";

export const ButtonWOFormik = ({
  errMsg,
  label,
  onClick,
  children,
  className,
  disabled,
  size,
  variant,
  color,
  buttonOwnProps,
}: {
  errMsg?: string | null;
  label?: string | null;
  onClick?: () => void;
  children?: React.ReactNode | string | null;
  className?: string;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "text" | "contained" | "outlined";
  color?: "success" | "error";
  buttonOwnProps?: ButtonOwnProps;
}) => {
  return (
    <div>
      <Button
        variant={variant ?? "contained"}
        size={size ?? "medium"}
        color={color}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={className}
        {...buttonOwnProps}
      >
        {children}
      </Button>
      {errMsg && errMsg.length > 0 && <p>{errMsg}</p>}
    </div>
  );
};
