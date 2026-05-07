import { useState, useEffect, useRef } from "react";
import { FaUserPlus, FaSearch, FaTimes, FaUser, FaEllipsisH } from "react-icons/fa";
import customersData from "../data/customers";

const GREEN = "#6EA674";
const GREEN_DARK = "#023337";
const GREEN_LIGHT = "#C1E6BA";
const GREEN_MUTED = "#EAF3DE";

const TIER_STYLE = {
    Gold:   { bg: "#FEFCE8", color: "#A16207", border: "#FCD34D" },
    Silver: { bg: "#F9FAFB", color: "#4B5563", border: "#CBD5E1" },
    Bronze: { bg: "#FFF7ED", color: "#92400E", border: "#FCA86C" },
    None:   { bg: "#F5F5F5", color: "#9CA3AF", border: "#E5E7EB" },
};

function Avatar({ name }) {
    const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    return (
        <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: GREEN_MUTED, color: GREEN,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>{initials}</div>
    );
}

function TierBadge({ tier }) {
    const s = TIER_STYLE[tier] || TIER_STYLE.None;
    return (
        <span style={{
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
        }}>{tier === "None" ? "Non-Member" : tier}</span>
    );
}

// ─── Customer Overview Chart ──────────────────────────────────────────────────
function OverviewChart({ data, labels }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        const load = () => {
            if (!window.Chart || !canvasRef.current) return;
            if (chartRef.current) chartRef.current.destroy();
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "line",
                data: {
                    labels,
                    datasets: [{
                        data,
                        borderColor: GREEN,
                        backgroundColor: "rgba(110,166,116,0.12)",
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: GREEN,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: "#9CA3AF", font: { size: 10 } } },
                        y: { grid: { color: "#F5F5F5" }, ticks: { color: "#9CA3AF", font: { size: 10 } } }
                    }
                }
            });
        };
        if (window.Chart) load();
        else {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            s.onload = load;
            document.head.appendChild(s);
        }
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, []);
    return <canvas ref={canvasRef} />;
}

export default function Customers() {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filterTier, setFilterTier] = useState("All");
    const [sortBy, setSortBy] = useState("name");
    const [form, setForm] = useState({ name: "", email: "", phone: "", loyalty: "None" });

    const filtered = customersData
        .filter(c =>
            (filterTier === "All" || c.loyalty === filterTier) &&
            (c.name.toLowerCase().includes(search.toLowerCase()) ||
             c.email.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "spent") return b.totalSpent - a.totalSpent;
            if (sortBy === "points") return b.points - a.points;
            return 0;
        });

    const gold = customersData.filter(c => c.loyalty === "Gold").length;
    const silver = customersData.filter(c => c.loyalty === "Silver").length;
    const bronze = customersData.filter(c => c.loyalty === "Bronze").length;
    const activeC = customersData.filter(c => c.points > 0).length;

    const chartLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = [18000, 24000, 20000, 25409, 22000, 27000, 23000];

    return (
        <div style={{ paddingBottom: 32 }}>
            {/* Page Title */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Customers</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>Dashboard / Customers</p>
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
                    <FaUserPlus size={13} /> Tambah Customer
                </button>
            </div>

            {/* ── Top Section: Stats + Chart ── */}
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, marginBottom: 20 }}>
                {/* Left stat cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #EAECF0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{customersData.length.toLocaleString()}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 2 }}>Total Customers</div>
                                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Last 7 days</div>
                            </div>
                            <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>+14.4%</span>
                        </div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #EAECF0" }}>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>2,370</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 2 }}>New Customers</div>
                            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Last 7 days</div>
                        </div>
                        <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>+20%</span>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #EAECF0" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>250k</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 2 }}>Visitor</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Last 7 days</div>
                        <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>+20%</span>
                    </div>
                </div>

                {/* Customer Overview chart */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #EAECF0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Customer Overview</div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <button style={{
                                padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                                cursor: "pointer", border: "none", background: GREEN_DARK, color: "#fff",
                            }}>This week</button>
                            <button style={{
                                padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                                cursor: "pointer", border: "1px solid #E5E7EB", background: "transparent", color: "#6B7280",
                            }}>Last week</button>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
                        {[
                            { label: "Active Customers", value: "25k" },
                            { label: "Repeat Customers", value: "5.6k" },
                            { label: "Avg. Value", value: "250k" },
                            { label: "Conversion Rate", value: "5.5%" },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{s.value}</div>
                                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ height: 160, position: "relative" }}>
                        <OverviewChart data={chartData} labels={chartLabels} />
                    </div>
                </div>
            </div>

            {/* ── Filter & Search Bar ── */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #EAECF0", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                        <FaSearch style={{
                            position: "absolute", left: 11, top: "50%",
                            transform: "translateY(-50%)", color: "#D1D5DB", fontSize: 12,
                        }} />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: "100%", paddingLeft: 32, paddingRight: 12,
                                paddingTop: 8, paddingBottom: 8,
                                border: "1px solid #E5E7EB", borderRadius: 8,
                                fontSize: 13, outline: "none",
                                boxSizing: "border-box", color: "#374151",
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["All", "Gold", "Silver", "Bronze", "None"].map(tier => (
                            <button key={tier} onClick={() => setFilterTier(tier)}
                                style={{
                                    padding: "7px 14px", borderRadius: 20,
                                    fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                                    background: filterTier === tier ? GREEN_DARK : "#F5F5F5",
                                    color: filterTier === tier ? "#fff" : "#6B7280",
                                    transition: "all 0.15s",
                                }}
                            >{tier === "None" ? "Non-Member" : tier}</button>
                        ))}
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{
                            padding: "8px 12px", border: "1px solid #E5E7EB",
                            borderRadius: 8, fontSize: 13, color: "#6B7280", outline: "none",
                        }}
                    >
                        <option value="name">Urutkan: Nama</option>
                        <option value="spent">Total Belanja</option>
                        <option value="points">Poin</option>
                    </select>
                </div>
            </div>

            {/* ── Table ── */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAECF0", overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>
                        Menampilkan <strong style={{ color: "#111827" }}>{filtered.length}</strong> dari {customersData.length} pelanggan
                    </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#FAFAFA" }}>
                                {["Customer Id", "Name", "Phone", "Order Count", "Total Spend", "Status", "Action"].map(h => (
                                    <th key={h} style={{
                                        textAlign: "left", padding: "11px 16px",
                                        color: "#9CA3AF", fontWeight: 600,
                                        fontSize: 11, textTransform: "uppercase",
                                        letterSpacing: 0.5, borderBottom: "1px solid #F0F0F0",
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}
                                    style={{ borderBottom: "1px solid #F9F9F9", transition: "background 0.1s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#9CA3AF", fontSize: 12 }}>
                                        #CUST{String(c.id).padStart(3, "0")}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <Avatar name={c.name} />
                                            <span style={{ fontWeight: 600, color: "#111827" }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#6B7280" }}>{c.phone}</td>
                                    <td style={{ padding: "12px 16px", color: "#374151", fontWeight: 500 }}>
                                        {Math.floor(c.totalSpent / 45000)}
                                    </td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700, color: GREEN_DARK }}>
                                        Rp {c.totalSpent.toLocaleString()}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <TierBadge tier={c.loyalty} />
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button style={{
                                                background: "none", border: "1px solid #E5E7EB",
                                                borderRadius: 6, padding: "5px 8px",
                                                cursor: "pointer", color: "#6B7280", fontSize: 11,
                                            }}>✉</button>
                                            <button style={{
                                                background: "none", border: "1px solid #FEE2E2",
                                                borderRadius: 6, padding: "5px 8px",
                                                cursor: "pointer", color: "#DC2626", fontSize: 11,
                                            }}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#D1D5DB" }}>
                                    <FaUser size={28} style={{ display: "block", margin: "0 auto 10px", opacity: 0.3 }} />
                                    Tidak ada pelanggan ditemukan
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
                        <button style={{
                            width: 28, height: 28, borderRadius: 6,
                            border: "1px solid #E5E7EB", background: "transparent",
                            color: "#6B7280", fontSize: 12, cursor: "pointer",
                        }}>...</button>
                        <button style={{
                            width: 28, height: 28, borderRadius: 6,
                            border: "1px solid #E5E7EB", background: "transparent",
                            color: "#6B7280", fontSize: 12, cursor: "pointer",
                        }}>24</button>
                    </div>
                    <button style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: "none", border: "1px solid #E5E7EB",
                        borderRadius: 8, padding: "6px 14px",
                        fontSize: 12, color: "#6B7280", cursor: "pointer",
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
                        width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Tambah Customer</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                                <FaTimes size={16} />
                            </button>
                        </div>
                        {[
                            { label: "Nama Lengkap", key: "name", type: "text", placeholder: "Nama pelanggan" },
                            { label: "Email", key: "email", type: "email", placeholder: "email@example.com" },
                            { label: "No. Telepon", key: "phone", type: "text", placeholder: "08xx-xxxx-xxxx" },
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
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Tier Loyalitas</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {["None", "Bronze", "Silver", "Gold"].map(t => (
                                    <button key={t} onClick={() => setForm({ ...form, loyalty: t })}
                                        style={{
                                            flex: 1, padding: "8px", borderRadius: 8,
                                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.loyalty === t ? `2px solid ${GREEN_DARK}` : "1px solid #E5E7EB",
                                            background: form.loyalty === t ? GREEN_MUTED : "#fff",
                                            color: form.loyalty === t ? GREEN_DARK : "#6B7280",
                                        }}
                                    >{t}</button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                width: "100%", background: GREEN_DARK, color: "#fff",
                                border: "none", borderRadius: 10, padding: 12,
                                fontSize: 14, fontWeight: 600, cursor: "pointer",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = GREEN}
                            onMouseLeave={e => e.currentTarget.style.background = GREEN_DARK}
                        >Simpan Customer</button>
                    </div>
                </div>
            )}
        </div>
    );
}