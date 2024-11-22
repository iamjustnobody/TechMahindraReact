import { useField, useFormikContext } from "formik";
import { Expense } from "../ExpenseInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { ReactNode } from "react";
import MenuItem from "@mui/material/MenuItem";

export type SelectOption = { value: any; label: string };

type DropdownProps = {
  options: { value: any; label: string }[];
  value?: SelectOption["value"];
  onChange?(event: SelectChangeEvent<string>, child: ReactNode): void;
  defaultMenuIsOpen?: boolean;
  isMulti?: boolean;
  readonly?: boolean;
  dropdownProps?: any;
  className?: string;
  required: boolean;
};

type SelectType = {
  fieldName: string;
  label?: string | null;
};
export const SelectFieldWFormik: React.FC<SelectType & DropdownProps> = (
  props
) => {
  const {
    fieldName,
    label,
    options,
    value,
    onChange,
    defaultMenuIsOpen,
    className,
    isMulti,
    readonly,
    dropdownProps,
    required,
  } = props;
  const [field, meta, helpers] = useField<Expense["category"]>(
    fieldName ?? "category"
  );
  const { setFieldValue } = useFormikContext<Expense>();

  const handleChange = (event: SelectChangeEvent) => {
    // setFieldValue((fieldName ?? "category") as string, event.target.value);
    helpers.setValue(event.target.value);
  };
  return (
    <div className="SelectBox">
      <FormControl required error={Boolean(meta.error)}>
        <InputLabel id={`SelectField-Lable-${fieldName ?? "category"}`}>
          {label ?? "Category"}
        </InputLabel>
        <Select
          labelId={`SelectField-Lable-${fieldName ?? "category"}`}
          id={fieldName ?? "category"}
          value={field.value === null ? undefined : field.value}
          label={label ?? "Category"}
          onChange={onChange ?? handleChange}
          required={required}
          error={!!meta.error}
          inputProps={{
            readOnly: readonly, // defaultMenuIsOpen,
            // menuPlacement: "auto",
            // isMulti,
            // isDisabled: readonly,
            ...dropdownProps,
          }}
          disabled={readonly}
          //   {...dropdownProps}
        >
          {options?.map((op) => (
            <MenuItem value={op.value}>{op.label}</MenuItem>
          ))}
        </Select>
        {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
    </div>
  );
};
