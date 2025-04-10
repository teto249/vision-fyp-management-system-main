export default function LabelInput({
  id,
  type,
  value,
  onChange,
  disabled,
  children,
  placeholder,
}) {
  return (
    <div>
      <label className="label-text" htmlFor={id}>
        {children}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}

function Input({ id, type, placeholder, value, onChange, disabled, ...rest }) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className="input w-full"
      required
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    />
  );
}

 