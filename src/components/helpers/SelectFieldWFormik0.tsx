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
  } = props;
  const [field, meta, helpers] = useField<Expense["category"]>(
    fieldName ?? "category"
  );
  const { setFieldValue } = useFormikContext<Expense>();

  const handleChange = (category: SelectOption | null) => {
    //(category: string | null)
    // setFieldValue((fieldName ?? "category") as string, category?.value);
    helpers.setValue(category?.value);
  };
  return (
    <div className="SelectBox">
      <div className="SelectLabel">
        <label //htmlFor={fieldName ?? "category"}
        // htmlFor="category"
        >
          {label ?? "Category"}
        </label>
      </div>
      <div className="SelectField">
        <Select
          // id="category"
          // id={fieldName ?? "category"}
          // options={categories}
          options={options}
          value={value ?? options.find((op) => op.value === field.value)}
          onChange={onChange ?? handleChange}
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
