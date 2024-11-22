import { useField, useFormikContext } from "formik";

import { Expense } from "../ExpenseInput";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DateValidationError } from "@mui/x-date-pickers/models/validation";
import { PickerChangeHandlerContext } from "@mui/x-date-pickers/models/pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";

type DateType = {
  fieldName: string;
  label?: string | null;
};
export interface DateFieldProps<T> {
  fieldName: keyof T;
  label?: string | null;
  readOnly?: boolean;
  onChange?: (
    date: Dayjs | null,
    context: PickerChangeHandlerContext<DateValidationError>
  ) => void;
}
export const DateField = function <T>({
  fieldName,
  label,
  readOnly,
  //   datePickerProps,
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label ?? "Date"}
          value={dayjs(field.value ? new Date(field.value) : null)}
          onChange={
            onChange ?? ((newValue) => handleChange(convertToDate(newValue)))
          }
          maxDate={dayjs(new Date())}
          readOnly={readOnly}
          slotProps={{
            textField: {
              error: Boolean(meta.error),
              helperText: meta.error,
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

const convertToDate = (dayjsValue: Dayjs | null): Date | null => {
  return dayjsValue ? dayjsValue.toDate() : null;
};
