import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ReactNode } from "react";

export type SelectOption = { value: any; label: string };

type DropdownProps = {
  options: { value: any; label: string }[];
  value?: SelectOption["value"];
  // onChange?(selectedOption: SelectOption): void;
  onChange?(event: SelectChangeEvent<string>, child: ReactNode): void;
  defaultMenuIsOpen?: boolean;
  isMulti?: boolean;
  readonly?: boolean;
  dropdownProps?: any;
  className?: string;
  required?: boolean;
};

type SelectType = {
  id: any;
  label: string;
  errMsg?: string;
};
export const SelectFieldWOFormik: React.FC<SelectType & DropdownProps> = (
  props
) => {
  const {
    label,
    options,
    value,
    onChange,
    defaultMenuIsOpen,
    className,
    isMulti,
    readonly,
    dropdownProps,
    id,
    errMsg,
    required,
  } = props;

  return (
    <div className="SelectBox">
      {/* <div className="SelectLabel">
        <label //htmlFor={id as string}
        >
          {label}
        </label>
      </div>
      <div className="SelectField">
        <Select
          // id={id as string}
          // options={categories}
          options={options}
          value={value}
          onChange={onChange}
          defaultMenuIsOpen={defaultMenuIsOpen}
          classNamePrefix={className}
          menuPlacement="auto"
          isMulti={isMulti}
          isDisabled={readonly}
          {...dropdownProps}
        />
      </div> */}
      <FormControl required={required} error={!!errMsg}>
        <InputLabel id={`SelectField-Lable-${id}`}>{label}</InputLabel>
        <Select
          labelId={`SelectField-Lable-${id}`}
          id={id}
          value={value}
          label={label}
          onChange={onChange}
          required={required}
          error={!!errMsg}
          inputProps={{
            readOnly: readonly,
            // defaultMenuIsOpen,
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
        {!!errMsg && typeof errMsg === "string" && (
          <FormHelperText>{errMsg}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
};
