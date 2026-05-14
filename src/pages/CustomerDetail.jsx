import { useParams } from "react-router-dom";
import customersData from "../data/customers";

const GREEN_DARK = "#023337";
const GREEN_LIGHT = "#C1E6BA";

export default function CustomerDetail() {

    // ambil id dari URL
    const { id } = useParams();

    // cari customer berdasarkan id
    const customer = customersData.find(
        (item) => item.id === Number(id)
    );

    // kalau customer tidak ditemukan
    if (!customer) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">
                    Customer Tidak Ditemukan
                </h1>
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* CARD DETAIL */}
            <div
                className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto"
            >

                {/* HEADER */}
                <div className="flex items-center gap-5 mb-8">

                    {/* AVATAR */}
                    <div
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            background: GREEN_LIGHT,
                            color: GREEN_DARK,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            fontWeight: "bold",
                        }}
                    >
                        {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                    </div>

                    {/* INFO */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {customer.name}
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Customer ID:
                            {" "}
                            #CUST{String(customer.id).padStart(3, "0")}
                        </p>
                    </div>
                </div>

                {/* DETAIL */}
                <div className="grid grid-cols-2 gap-6">

                    <div>
                        <p className="text-sm text-gray-400">
                            Email
                        </p>

                        <h3 className="font-semibold text-gray-800">
                            {customer.email}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">
                            Phone
                        </p>

                        <h3 className="font-semibold text-gray-800">
                            {customer.phone}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">
                            Loyalty
                        </p>

                        <h3 className="font-semibold text-gray-800">
                            {customer.loyalty}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">
                            Points
                        </p>

                        <h3 className="font-semibold text-gray-800">
                            {customer.points}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">
                            Total Belanja
                        </p>

                        <h3 className="font-semibold text-gray-800">
                            Rp {customer.totalSpent.toLocaleString()}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">
                            Join Date
                        </p>

                        <h3 className="font-semibold text-gray-800">
                            {customer.joinDate}
                        </h3>
                    </div>

                </div>
            </div>
        </div>
    );
}