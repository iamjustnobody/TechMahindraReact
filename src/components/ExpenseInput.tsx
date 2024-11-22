import {
  Form,
  Formik,
  FormikHelpers,
  useFormik,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { useExpenseContext } from "../state/expenseContext";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Expense as Exp } from "../state/expenseReducer";
import { ButtonWFormik } from "./helpers/ButtonWFormik";
import { SelectFieldWFormik } from "./helpers/SelectFieldWFormik";
import { DateField } from "./helpers/DateField";
import { InputField } from "./helpers/InputField";

export type Expense = {
  category: string | null | undefined;
  amount?: number | null;
  date?: Date | null;
};

const validationSchema = Yup.object({
  category: Yup.string().nullable().required("Please enter a category"),
  amount: Yup.number()
    .nullable()
    .required("Please enter an amount")
    .typeError("Amount must be a number")
    .min(0, "Amount cannot be negative"),
  date: Yup.date()
    .nullable()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
  // .nullable(),
});

export const ExpenseInput: React.FC = () => {
  const { state, dispatch } = useExpenseContext();
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    ""
  );

  const handleSubmit = async (
    values: Expense,
    helpers: FormikHelpers<Expense>
  ) => {
    const { category, amount, date } = values;
    // console.log("type ", typeof values.amount);

    if (!category || !amount || amount <= 0 || !date) {
      setErrorMessage("Please provide valid values in the fields.");
      return;
    }
    let numAmount = amount;
    if (typeof amount === "string") numAmount = parseFloat(amount);
    dispatch({ type: "ADD_EXPENSE_START" });
    try {
      const expense = { ...values, amount: numAmount, id: uuidv4() };
      await new Promise((resolve) => setTimeout(resolve, 500));

      dispatch({ type: "ADD_EXPENSE", payload: expense as Exp });
      setErrorMessage("");
      // helpers.resetForm();
    } catch (error) {
      dispatch({ type: "ADD_EXPENSE_FAIL" });
      console.error("Failed to add expense:", error);
      setErrorMessage("Something went wrong. Please try it again later.");
    }
  };
  return (
    <div className="InputContainer">
      <h3>Add A New Expense</h3>
      <Formik
        initialValues={
          {
            category: "",
            amount: null,
            date: null,
          } as Expense
        }
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched, values }) => (
          <Form className="InputForm">
            <div className="InputSection">
              <SelectFieldWFormik
                fieldName={"category"}
                options={categories}
                value={categories.find((cat) => cat.value === values.category)}
                required={true}
              />
              <InputField
                fieldName={"amount"}
                label={"Amount"}
                required={true}
                type="number"
                inputMode="numeric"
                step={0.01}
              />
              <DateField fieldName={"date"} />
            </div>
            <ButtonWFormik errMsg={errorMessage} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export const categories = [
  { value: "food", label: "Food" },
  { value: "transportation", label: "Transportation" },
  { value: "entertainment", label: "Entertainment" },
  { value: "others", label: "Others" },
];
