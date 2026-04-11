import data from "../data/layanan.json";
import { useState } from "react";

export default function GuestView() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [kota, setKota] = useState("");

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) &&
    (kategori === "" || item.kategori === kategori) &&
    (kota === "" || item.penyedia.kota === kota)
  );

  return (
    <div className="p-5 min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        🌿 Daftar Layanan
      </h1>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          type="text"
          placeholder="🔍 Cari layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Semua Kategori</option>
          <option value="IT">IT</option>
          <option value="Edukasi">Edukasi</option>
        </select>

        <select
          value={kota}
          onChange={(e) => setKota(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Semua Kota</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
          <option value="Medan">Medan</option>
          <option value="Padang">Padang</option>
          <option value="Surabaya">Surabaya</option>
        </select>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >

            {/* IMAGE FIX */}
            <div className="w-full h-40 overflow-hidden rounded-lg">
              <img
                src={item.gambar}
                alt={item.nama}
                className="w-full h-full object-cover hover:scale-110 transition duration-300"
              />
            </div>

            {/* CONTENT */}
            <h2 className="font-bold text-lg mt-3 text-gray-800">
              {item.nama}
            </h2>

            <p className="text-sm text-gray-500">
              {item.kategori}
            </p>

            <div className="flex justify-between items-center mt-2">
              <p className="text-green-600 font-semibold">
                Rp {item.harga}
              </p>

              <p className="text-yellow-500 text-sm">
                ⭐ {item.rating}
              </p>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              📍 {item.penyedia.kota}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}