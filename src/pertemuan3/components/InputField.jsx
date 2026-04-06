import { Alert } from "../TailwindCSS";

export default function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text"
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
      />

      {error && <Alert>{error}</Alert>}
    </div>
  );
}