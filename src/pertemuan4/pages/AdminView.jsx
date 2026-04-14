import data from "../data/layanan.json";
import { useState } from "react";
import SearchFilter from "../components/SearchFilter";

export default function AdminView() {

  // ⭐ PERUBAHAN MODUL: pakai satu state object
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    kategori: "",
    kota: ""
  });

  // ⭐ PERUBAHAN MODUL: satu handleChange
  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  // ⭐ PERUBAHAN MODUL: pakai dataForm + toLowerCase
  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(dataForm.searchTerm.toLowerCase()) &&
    (dataForm.kategori === "" || item.kategori === dataForm.kategori) &&
    (dataForm.kota === "" || item.penyedia.kota === dataForm.kota)
  );

  return (
    <div className="p-5 min-h-screen bg-gray-100">

      <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
        📊 Admin Panel
      </h1>

      {/* ⭐ PERUBAHAN MODUL: pakai component */}
      <SearchFilter dataForm={dataForm} handleChange={handleChange} />

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
                <tr key={item.id} className="text-center border-t hover:bg-gray-50">
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