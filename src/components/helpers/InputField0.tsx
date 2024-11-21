import { useField, useFormikContext } from "formik";

export interface TextFieldProps {
  fieldName: string;
  label: string;
  required: boolean;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  isVisible?: boolean;
  maxLength?: number;
  touched?: () => void;
  autoFocus?: boolean;
  autoComplete?: boolean;
  classNamePrefix?: string;
  className?: string;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  onBlur?: (e: React.FocusEvent) => void;
  step?: string | number | undefined;
}

export const InputField = ({
  fieldName,
  label,
  onBlur,
  classNamePrefix,
  className,
  type,
  disabled,
  placeholder,
  maxLength,
  touched,
  autoFocus,
  autoComplete,
  inputMode,
  step,
}: TextFieldProps) => {
  const [field, meta, helpers] = useField<any>(fieldName as string);
  const showError = meta.touched && meta.error;
  const blurOn = onBlur ?? field.onBlur;
  const formik = useFormikContext<any>();

  const handleChange = (e: any) => {
    formik.setFieldValue(
      fieldName as string,
      type === "number" ? parseFloat(e.target.value) : e.target.value
    );
    // helpers.setValue(type === "number" ? parseFloat(e.target.value) : e.target.value);
  };
  return (
    <div className={`InputBox ${classNamePrefix}`}>
      <div className="InputLabel">
        <label>{label}</label>
      </div>
      <div className="InputField">
        {type == "textarea" ? (
          <textarea
            rows={4}
            maxLength={1000}
            className={`${className}`}
            name={fieldName}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete={autoComplete ? "on" : "off"}
            //   className={className}
            onBlur={blurOn}
            inputMode={inputMode ?? undefined}
            onChange={handleChange}
          ></textarea>
        ) : (
          <input
            name={fieldName}
            type={type ?? "text"}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            //   touched={touched}
            autoFocus={autoFocus}
            autoComplete={autoComplete ? "on" : "off"}
            className={className}
            onBlur={blurOn}
            inputMode={inputMode ?? undefined}
            onChange={handleChange}
            step={step}
          />
        )}

        {/* <ErrorM name={field} /> */}
      </div>
    </div>
  );
};
