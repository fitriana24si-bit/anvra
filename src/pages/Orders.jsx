import { useState } from "react";
import { FaPlus, FaSearch, FaTimes, FaBoxOpen } from "react-icons/fa";
import ordersData from "../data/orders";

const GREEN = "#6EA674";
const GREEN_DARK = "#023337";
const GREEN_LIGHT = "#C1E6BA";
const GREEN_MUTED = "#EAF3DE";

const STATUS_STYLE = {
    Completed: { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
    Pending:   { bg: "#FEFCE8", color: "#A16207", dot: "#EAB308" },
    Cancelled: { bg: "#FEF2F2", color: "#B91C1C", dot: "#EF4444" },
};

const PAYMENT_ICONS = {
    Cash: "💵", Transfer: "🏦", QRIS: "📱",
    "Kartu Kredit": "💳", GoFood: "🟢", GrabFood: "🟢",
};

function StatusBadge({ status }) {
    const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: s.bg, color: s.color,
            padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
            {status}
        </span>
    );
}

function SummaryCard({ label, value, color, sub }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 12,
            padding: "18px 20px", border: "1px solid #EAECF0",
            flex: 1, borderTop: `3px solid ${color}`,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>{value}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{label}</div>
                </div>
            </div>
            {sub && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>Last 7 days</div>}
        </div>
    );
}

export default function Orders() {
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("orderDate");
    const [form, setForm] = useState({
        customerName: "", status: "Pending",
        totalPrice: "", orderDate: "", paymentMethod: "Cash",
    });

    const filtered = ordersData
        .filter(o =>
            (statusFilter === "All" || o.status === statusFilter) &&
            (o.customerName.toLowerCase().includes(search.toLowerCase()) ||
             String(o.id).includes(search))
        )
        .sort((a, b) => {
            if (sortField === "totalPrice") return b.totalPrice - a.totalPrice;
            if (sortField === "orderDate") return new Date(b.orderDate) - new Date(a.orderDate);
            return 0;
        });

    const totalRevenue = ordersData.reduce((s, o) => s + o.totalPrice, 0);
    const completed = ordersData.filter(o => o.status === "Completed").length;
    const pending = ordersData.filter(o => o.status === "Pending").length;
    const cancelled = ordersData.filter(o => o.status === "Cancelled").length;

    return (
        <div style={{ paddingBottom: 32 }}>
            {/* Page Title */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Order Management</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>Dashboard / Orders</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: GREEN_DARK, color: "#fff", border: "none",
                        borderRadius: 10, padding: "10px 20px", fontSize: 13,
                        fontWeight: 600, cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = GREEN}
                    onMouseLeave={e => e.currentTarget.style.background = GREEN_DARK}
                >
                    <FaPlus size={11} /> Add Order
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <SummaryCard label="Total Orders" value={ordersData.length} color={GREEN_DARK} sub />
                <SummaryCard label="New Orders" value={pending} color={GREEN} sub />
                <SummaryCard label="Completed Orders" value={completed} color="#22C55E" sub />
                <SummaryCard label="Canceled Orders" value={cancelled} color="#EF4444" sub />
            </div>

            {/* ── Filter Bar ── */}
            <div style={{
                background: "#fff", borderRadius: 12,
                padding: "14px 18px", border: "1px solid #EAECF0", marginBottom: 16,
            }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                        <FaSearch style={{
                            position: "absolute", left: 11, top: "50%",
                            transform: "translateY(-50%)", color: "#D1D5DB", fontSize: 12,
                        }} />
                        <input
                            placeholder="Search order report..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: "100%", paddingLeft: 32, paddingRight: 10,
                                paddingTop: 8, paddingBottom: 8,
                                border: "1px solid #E5E7EB", borderRadius: 8,
                                fontSize: 13, outline: "none",
                                boxSizing: "border-box", color: "#374151",
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["All", "Completed", "Pending", "Cancelled"].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                style={{
                                    padding: "7px 16px", borderRadius: 20,
                                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                                    border: statusFilter === s ? "none" : "1px solid #E5E7EB",
                                    background: statusFilter === s ? GREEN_DARK : "transparent",
                                    color: statusFilter === s ? "#fff" : "#6B7280",
                                    transition: "all 0.15s",
                                }}
                            >{s === "All" ? `All order (${ordersData.length})` : s}</button>
                        ))}
                    </div>
                    <select value={sortField} onChange={e => setSortField(e.target.value)}
                        style={{
                            padding: "8px 12px", border: "1px solid #E5E7EB",
                            borderRadius: 8, fontSize: 13, color: "#6B7280", outline: "none",
                        }}>
                        <option value="orderDate">Terbaru</option>
                        <option value="totalPrice">Harga Tertinggi</option>
                    </select>
                </div>
            </div>

            {/* ── Table ── */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAECF0", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#FAFAFA" }}>
                                {["No.", "Order Id", "Product/Customer", "Date", "Price", "Payment", "Status"].map(h => (
                                    <th key={h} style={{
                                        textAlign: "left", padding: "12px 16px",
                                        color: "#9CA3AF", fontWeight: 600,
                                        fontSize: 11, textTransform: "uppercase",
                                        letterSpacing: 0.5, borderBottom: "1px solid #F0F0F0",
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o, i) => (
                                <tr key={o.id}
                                    style={{ borderBottom: "1px solid #F9F9F9", transition: "background 0.1s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 16px", color: "#9CA3AF" }}>{i + 1}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{
                                            fontFamily: "monospace", background: "#F5F5F5",
                                            color: "#374151", padding: "3px 8px",
                                            borderRadius: 5, fontSize: 12,
                                        }}>
                                            #ORD{String(o.id).padStart(3, "0")}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111827" }}>
                                        {o.customerName}
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#6B7280" }}>{o.orderDate}</td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700, color: GREEN_DARK }}>
                                        Rp {o.totalPrice.toLocaleString()}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                            background: "#F5F5F5", color: "#374151",
                                            padding: "3px 10px", borderRadius: 6, fontSize: 12,
                                        }}>
                                            {PAYMENT_ICONS[o.paymentMethod] || "💳"} {o.paymentMethod}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <StatusBadge status={o.status} />
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#D1D5DB" }}>
                                    <FaBoxOpen size={28} style={{ display: "block", margin: "0 auto 10px", opacity: 0.3 }} />
                                    Tidak ada order ditemukan
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{
                    padding: "14px 18px", borderTop: "1px solid #F0F0F0",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <button style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: "none", border: "1px solid #E5E7EB",
                        borderRadius: 8, padding: "6px 14px",
                        fontSize: 12, color: "#6B7280", cursor: "pointer",
                    }}>← Previous</button>
                    <div style={{ display: "flex", gap: 4 }}>
                        {[1, 2, 3, 4, 5].map(p => (
                            <button key={p} style={{
                                width: 28, height: 28, borderRadius: 6,
                                border: p === 1 ? "none" : "1px solid #E5E7EB",
                                background: p === 1 ? GREEN_DARK : "transparent",
                                color: p === 1 ? "#fff" : "#6B7280",
                                fontSize: 12, cursor: "pointer",
                            }}>{p}</button>
                        ))}
                        <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 12 }}>...</span>
                        <button style={{
                            width: 28, height: 28, borderRadius: 6,
                            border: "1px solid #E5E7EB", background: "transparent",
                            color: "#6B7280", fontSize: 12, cursor: "pointer",
                        }}>24</button>
                    </div>
                    <button style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: GREEN_DARK, border: "none",
                        borderRadius: 8, padding: "6px 14px",
                        fontSize: 12, color: "#fff", cursor: "pointer",
                    }}>Next →</button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(4px)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 50,
                }}
                    onClick={() => setShowModal(false)}
                >
                    <div style={{
                        background: "#fff", borderRadius: 20, padding: 28,
                        width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Tambah Order</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                                <FaTimes size={16} />
                            </button>
                        </div>
                        {[
                            { label: "Nama Customer", key: "customerName", type: "text", placeholder: "Nama pelanggan" },
                            { label: "Total Harga (Rp)", key: "totalPrice", type: "number", placeholder: "50000" },
                            { label: "Tanggal Order", key: "orderDate", type: "date", placeholder: "" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{
                                        width: "100%", padding: "9px 12px",
                                        border: "1px solid #E5E7EB", borderRadius: 8,
                                        fontSize: 13, outline: "none", boxSizing: "border-box",
                                    }}
                                />
                            </div>
                        ))}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Status</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {["Pending", "Completed", "Cancelled"].map(s => (
                                    <button key={s} onClick={() => setForm({ ...form, status: s })}
                                        style={{
                                            flex: 1, padding: 8, borderRadius: 8,
                                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.status === s ? `2px solid ${GREEN_DARK}` : "1px solid #E5E7EB",
                                            background: form.status === s ? GREEN_MUTED : "#fff",
                                            color: form.status === s ? GREEN_DARK : "#6B7280",
                                        }}
                                    >{s}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Metode Pembayaran</label>
                            <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                                style={{
                                    width: "100%", padding: "9px 12px",
                                    border: "1px solid #E5E7EB", borderRadius: 8,
                                    fontSize: 13, outline: "none",
                                }}>
                                <option>Cash</option>
                                <option>Transfer</option>
                                <option>QRIS</option>
                                <option>Kartu Kredit</option>
                                <option>GoFood</option>
                                <option>GrabFood</option>
                            </select>
                        </div>
                        <button onClick={() => setShowModal(false)}
                            style={{
                                width: "100%", background: GREEN_DARK, color: "#fff",
                                border: "none", borderRadius: 10, padding: 12,
                                fontSize: 14, fontWeight: 600, cursor: "pointer",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = GREEN}
                            onMouseLeave={e => e.currentTarget.style.background = GREEN_DARK}
                        >Simpan Order</button>
                    </div>
                </div>
            )}
        </div>
    );
}