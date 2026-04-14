import data from "../data/layanan.json";
import { useState } from "react";
import SearchFilter from "../components/SearchFilter";

export default function GuestView() {

  // ⭐ PERUBAHAN MODUL
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    kategori: "",
    kota: ""
  });

  // ⭐ PERUBAHAN MODUL
  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  // ⭐ PERUBAHAN MODUL
  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(dataForm.searchTerm.toLowerCase()) &&
    (dataForm.kategori === "" || item.kategori === dataForm.kategori) &&
    (dataForm.kota === "" || item.penyedia.kota === dataForm.kota)
  );

  return (
    <div className="p-5 min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50">

      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        🌿 Daftar Layanan
      </h1>

      {/* ⭐ PERUBAHAN MODUL */}
      <SearchFilter dataForm={dataForm} handleChange={handleChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >

            <div className="w-full h-40 overflow-hidden rounded-lg">
              <img
                src={item.gambar}
                alt={item.nama}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="font-bold text-lg mt-3 text-gray-800">
              {item.nama}
            </h2>

            <p className="text-sm text-gray-500">
              {item.kategori}
            </p>

            <div className="flex justify-between mt-2">
              <p className="text-green-600 font-semibold">
                Rp {item.harga}
              </p>
              <p className="text-yellow-500">
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