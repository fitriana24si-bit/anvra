export default function SearchFilter({
  search,
  setSearch,
  kategori,
  setKategori,
  kota,
  setKota
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">

      <input
        type="text"
        placeholder="Cari layanan..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg w-full"
      />

      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="border p-2 rounded-lg w-full md:w-1/3"
      >
        <option value="">Semua Kategori</option>
        <option value="IT">IT</option>
        <option value="Edukasi">Edukasi</option>
      </select>

      <select
        value={kota}
        onChange={(e) => setKota(e.target.value)}
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