import { useField, useFormikContext } from "formik";
import Select from "react-select";
import { Expense } from "../ExpenseInput";

export type SelectOption = { value: any; label: string };

type DropdownProps = {
  options: { value: any; label: string }[];
  value?: SelectOption["value"];
  onChange?(selectedOption: SelectOption): void;
  defaultMenuIsOpen?: boolean;
  isMulti?: boolean;
  readonly?: boolean;
  dropdownProps?: any;
  className?: string;
};

type SelectType = {
  id: any;
  label: string;
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
  } = props;

  return (
    <div className="SelectBox">
      <div className="SelectLabel">
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
      </div>
    </div>
  );
};
