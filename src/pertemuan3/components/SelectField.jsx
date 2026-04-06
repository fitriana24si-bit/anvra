import { Alert } from "../TailwindCSS";

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
      >
        <option value="">-- Pilih --</option>
        {options.map((item, i) => (
          <option key={i} value={item}>
            {item}
          </option>
        ))}
      </select>

      {error && <Alert>{error}</Alert>}
    </div>
  );
}