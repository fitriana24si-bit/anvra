import data from "../data/layanan.json";
import { useState } from "react";

export default function AdminView() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [kota, setKota] = useState("");

  // FILTER LOGIC
  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) &&
    (kategori === "" || item.kategori === kategori) &&
    (kota === "" || item.penyedia.kota === kota)
  );

  return (
    <div className="p-5 min-h-screen bg-gray-100">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
        📊 Admin Panel
      </h1>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">

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

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-xl p-4">

        <table className="w-full text-sm">

          <thead className="bg-green-100">
            <tr>
              <th className="p-2">Nama</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Kota</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="text-center border-t hover:bg-gray-50"
                >
                  <td className="p-2">{item.nama}</td>
                  <td className="p-2">{item.kategori}</td>
                  <td className="p-2">Rp {item.harga}</td>
                  <td className="p-2">⭐ {item.rating}</td>
                  <td className="p-2">{item.penyedia.kota}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}