import { useState } from "react";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import { Card, Button, ResultBox } from "./TailwindCSS";

export default function UserForm() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    umur: "",
    gender: "",
    tujuan: ""
  });

  const [error, setError] = useState({});
  const [hasil, setHasil] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validasi = () => {
    let err = {};

    // 3 VALIDASI MINIMAL
    if (!form.nama) err.nama = "Nama wajib diisi";
    else if (/\d/.test(form.nama)) err.nama = "Tidak boleh angka";

    if (!form.email) err.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Format email salah";

    if (!form.umur) err.umur = "Umur wajib diisi";
    else if (isNaN(form.umur)) err.umur = "Harus angka";

    if (!form.gender) err.gender = "Pilih gender";
    if (!form.tujuan) err.tujuan = "Pilih tujuan";

    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validasi()) {
      setHasil(form);
    }
  };

  const isValid =
    form.nama &&
    form.email &&
    form.umur &&
    form.gender &&
    form.tujuan &&
    Object.keys(error).length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card>
        <h2 className="text-xl font-bold text-center mb-4 text-green-600">
          Form Pendaftaran
        </h2>

        <form onSubmit={handleSubmit}>
          <InputField label="Nama" name="nama" value={form.nama} onChange={handleChange} error={error.nama} />
          <InputField label="Email" name="email" value={form.email} onChange={handleChange} error={error.email} />
          <InputField label="Umur" name="umur" value={form.umur} onChange={handleChange} error={error.umur} />

          <SelectField label="Jenis Kelamin" name="gender" value={form.gender} onChange={handleChange} options={["Laki-laki", "Perempuan"]} error={error.gender} />

          <SelectField label="Tujuan" name="tujuan" value={form.tujuan} onChange={handleChange} options={["Kuliah", "Kerja", "Liburan"]} error={error.tujuan} />

          {/* CONDITIONAL RENDERING */}
          {isValid && <Button type="submit">Submit</Button>}
        </form>

        {/* HASIL OUTPUT */}
        {hasil && (
          <ResultBox>
            <h3 className="font-semibold text-green-700 mb-2">
              Hasil Input:
            </h3>
            <p>Nama: {hasil.nama}</p>
            <p>Email: {hasil.email}</p>
            <p>Umur: {hasil.umur}</p>
            <p>Gender: {hasil.gender}</p>
            <p>Tujuan: {hasil.tujuan}</p>
          </ResultBox>
        )}
      </Card>
    </div>
  );
}