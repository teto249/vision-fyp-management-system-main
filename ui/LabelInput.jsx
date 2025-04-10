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

 function ProHeader({ toggleEditMode, isEditMode }) {
  return (
    <div className="grid grid-cols-3 items-center bg-base-300/10 p-4">
      {/* <!-- Empty left column --> */}
      <div></div>

      {/* <!-- Center column for text --> */}
      <div className="text-center">
        <h5 className="text-xl font-bold">Account Details</h5>
      </div>

      {/* <!-- Right column for button --> */}
      <div className="flex justify-end">
        <button
          onClick={toggleEditMode}
          className={isEditMode ? "btn-secondary" : "btn-primary"}
        >
          {isEditMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}
