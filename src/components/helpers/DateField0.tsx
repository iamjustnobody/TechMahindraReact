import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import { Expense } from "../ExpenseInput";
import { DatePickerProps } from "react-datepicker";

type DateType = {
  fieldName: string;
  label?: string | null;
};
export interface DateFieldProps<T> {
  fieldName: keyof T;
  label?: string | null;
  readOnly?: boolean;
  onChange?: (
    date: Date | null,
    event: React.SyntheticEvent<any> | undefined
  ) => void;
  datePickerProps?: Omit<DatePickerProps, "onChange">;
}
export const DateField = function <T>({
  fieldName,
  label,
  readOnly,
  datePickerProps,
  onChange,
}: DateFieldProps<T>) {
  const [field, meta, helpers] = useField<Expense["date"]>(
    (fieldName ?? "date") as string
  );
  const formik = useFormikContext<Expense>();

  const handleChange = (date: Date | null) => {
    formik.setFieldValue((fieldName ?? "date") as string, date);
    // helpers.setValue(date);
  };
  return (
    <div className="DateBox">
      <label htmlFor="date">{label ?? "Date"}</label>
      <DatePicker
        id="date"
        selected={field.value ? new Date(field.value) : null}
        onChange={onChange ?? handleChange}
        // onChange={()=>{}}
        dateFormat="yyyy-MM-dd"
        maxDate={new Date()}
        // dateFormat="Pp"
        // locale={"en-US"}
        readOnly={readOnly}
        placeholderText={readOnly ? "" : "Select date..."}
        // {...datePickerProps}
      />
    </div>
  );
};
