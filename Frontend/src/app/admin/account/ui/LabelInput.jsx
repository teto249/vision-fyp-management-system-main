export default function LabelInput({
  id,
  type,
  value,
  onChange,
  disabled,
  children,
  placeholder,
  ...rest
}) {
  return (
    <div>
      <label className="label-text" htmlFor={id}>
        {children}
      </label>
      <input
      id={id}
      type={type}
      placeholder={placeholder}
      className="input w-full"
      required
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    />
    </div>
  );
}
