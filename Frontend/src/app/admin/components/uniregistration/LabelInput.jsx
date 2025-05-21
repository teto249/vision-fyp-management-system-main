export default function LabelInput({ children, type, placeholder,name }) {
  return (
    <div className="space-y-2">
      <label className=" block text-sm font-medium text-gray-300">
        {children}
      </label>
      <input name={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        required
      />
    </div>
  );
}