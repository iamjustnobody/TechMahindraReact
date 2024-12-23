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
  value: Date | null;
  label?: string | null;
  readOnly?: boolean;
  onChange: (date: Date | null) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
}
export const DateFieldNoFormik = function <T>({
  value,
  label,
  readOnly,

  onChange,
  minDate,
  maxDate,
}: DateFieldProps<T>) {
  return (
    <div className="DateBox">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label ?? "Date"}
          value={value ? dayjs(value) : undefined}
          onChange={(newValue) => onChange(convertToDate(newValue))}
          //   dateFormat="yyyy-MM-dd"
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          minDate={minDate ? dayjs(minDate) : undefined}
          // dateFormat="Pp"
          // locale={"en-US"}
          readOnly={readOnly}
        />
      </LocalizationProvider>
    </div>
  );
};

const convertToDate = (dayjsValue: Dayjs | null): Date | null => {
  return dayjsValue ? dayjsValue.toDate() : null;
};
