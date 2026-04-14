export default function SearchFilter({ dataForm, handleChange }) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">

      {/* ⭐ PERUBAHAN MODUL: pakai name + handleChange */}
      <input
        type="text"
        name="searchTerm"
        placeholder="Cari layanan..."
        value={dataForm.searchTerm}
        onChange={handleChange}
        className="border p-2 rounded-lg w-full"
      />

      {/* ⭐ PERUBAHAN MODUL */}
      <select
        name="kategori"
        value={dataForm.kategori}
        onChange={handleChange}
        className="border p-2 rounded-lg w-full md:w-1/3"
      >
        <option value="">Semua Kategori</option>
        <option value="IT">IT</option>
        <option value="Edukasi">Edukasi</option>
      </select>

      {/* ⭐ PERUBAHAN MODUL */}
      <select
        name="kota"
        value={dataForm.kota}
        onChange={handleChange}
        className="border p-2 rounded-lg w-full md:w-1/3"
      >
        <option value="">Semua Kota</option>
        <option value="Jakarta">Jakarta</option>
        <option value="Bandung">Bandung</option>
        <option value="Medan">Medan</option>
        <option value="Padang">Padang</option>
        <option value="Surabaya">Surabaya</option>
      </select>

    </div>
  );
}