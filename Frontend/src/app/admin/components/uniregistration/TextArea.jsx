export default function TextArea({ children, description }) {
  return (
    <div className="border-l-4 border-primary-500 pl-4 bg-gray-800 rounded-tr-3xl rounded-br-3xl py-3">
      <h3 className="text-xl font-semibold text-gray-200">{children}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}
