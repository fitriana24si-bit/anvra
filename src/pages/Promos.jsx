import { useState } from "react";
import { FaPlus, FaTimes, FaTag, FaTruck, FaBoxOpen, FaFire, FaCalendarAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

const GREEN = "#6EA674";
const GREEN_DARK = "#023337";
const GREEN_MUTED = "#EAF3DE";

const TYPE_STYLE = {
    Bundling: { bg: "#EDE9FE", color: "#5B21B6", icon: <FaBoxOpen size={12} /> },
    Diskon:   { bg: GREEN_MUTED, color: GREEN_DARK, icon: <FaTag size={12} /> },
    Delivery: { bg: "#DCFCE7", color: "#15803D", icon: <FaTruck size={12} /> },
    Flash:    { bg: "#FEF9C3", color: "#A16207", icon: <FaFire size={12} /> },
};

const initialPromos = [
    { id: 1, title: "Beli 2 Roti Coklat Gratis 1",   type: "Bundling", validUntil: "2025-05-30", desc: "Berlaku untuk semua varian roti coklat, min. 2 pcs.", active: true,  discount: "Free 1 item" },
    { id: 2, title: "Diskon 20% untuk Member Gold",    type: "Diskon",   validUntil: "2025-06-15", desc: "Khusus pelanggan tier Gold, berlaku semua produk.", active: true,  discount: "20%" },
    { id: 3, title: "Free Delivery min. Rp 50.000",    type: "Delivery", validUntil: "2025-05-31", desc: "Gratis ongkir untuk area Kota, minimum belanja Rp 50k.", active: true,  discount: "Free Delivery" },
    { id: 4, title: "Flash Sale Croissant 50% Off",    type: "Flash",    validUntil: "2025-05-20", desc: "Hanya 50 pcs per hari, mulai pukul 08.00 pagi.", active: false, discount: "50%" },
];

function PromoCard({ promo, onToggle, onDelete }) {
    const ts = TYPE_STYLE[promo.type] || TYPE_STYLE.Diskon;
    const isExpired = new Date(promo.validUntil) < new Date();
    const daysLeft = Math.max(0, Math.round((new Date(promo.validUntil) - new Date()) / (1000 * 60 * 60 * 24)));

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #EAECF0",
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                opacity: !promo.active ? 0.6 : 1,
                transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(2,51,55,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: ts.bg, color: ts.color,
                        padding: "4px 10px", borderRadius: 20,
                        fontSize: 11, fontWeight: 700,
                    }}>
                        {ts.icon} {promo.type}
                    </span>
                    {isExpired && (
                        <span style={{
                            background: "#FEF2F2", color: "#B91C1C",
                            padding: "4px 10px", borderRadius: 20,
                            fontSize: 10, fontWeight: 700,
                        }}>EXPIRED</span>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                        onClick={() => onToggle(promo.id)}
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: promo.active ? GREEN_DARK : "#D1D5DB",
                            fontSize: 22, display: "flex",
                        }}
                    >
                        {promo.active ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button
                        onClick={() => onDelete(promo.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", fontSize: 14, display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#EF4444"}
                        onMouseLeave={e => e.currentTarget.style.color = "#D1D5DB"}
                    ><FaTimes /></button>
                </div>
            </div>

            {/* Body */}
            <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 5 }}>{promo.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{promo.desc}</div>
            </div>

            {/* Footer */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderTop: "1px solid #F5F5F5", paddingTop: 12,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9CA3AF" }}>
                    <FaCalendarAlt size={10} />
                    <span>
                        Berlaku hingga{" "}
                        {new Date(promo.validUntil).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!isExpired && promo.active && (
                        <span style={{ fontSize: 11, color: daysLeft <= 7 ? "#EF4444" : "#9CA3AF" }}>
                            {daysLeft} hari lagi
                        </span>
                    )}
                    <span style={{
                        background: GREEN_MUTED, color: GREEN_DARK,
                        fontWeight: 800, fontSize: 13,
                        padding: "4px 12px", borderRadius: 8,
                    }}>{promo.discount}</span>
                </div>
            </div>
        </div>
    );
}

export default function Promos() {
    const [promos, setPromos] = useState(initialPromos);
    const [showModal, setShowModal] = useState(false);
    const [filterType, setFilterType] = useState("All");
    const [form, setForm] = useState({ title: "", type: "Diskon", validUntil: "", desc: "", discount: "" });

    const filtered = promos.filter(p => filterType === "All" || p.type === filterType);
    const activeCount = promos.filter(p => p.active).length;

    const handleToggle = (id) => setPromos(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const handleDelete = (id) => setPromos(prev => prev.filter(p => p.id !== id));
    const handleSave = () => {
        if (!form.title || !form.discount) return;
        setPromos(prev => [...prev, { ...form, id: Date.now(), active: true }]);
        setForm({ title: "", type: "Diskon", validUntil: "", desc: "", discount: "" });
        setShowModal(false);
    };

    return (
        <div style={{ paddingBottom: 32 }}>
            {/* Page Title */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Promo & Diskon</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>Dashboard / Promos</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: GREEN_DARK, color: "#fff", border: "none",
                        borderRadius: 10, padding: "10px 20px",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = GREEN}
                    onMouseLeave={e => e.currentTarget.style.background = GREEN_DARK}
                >
                    <FaPlus size={11} /> Buat Promo
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {[
                    { label: "Total Promo",    value: promos.length,               color: GREEN_DARK,  borderColor: GREEN_DARK },
                    { label: "Promo Aktif",    value: activeCount,                  color: "#16A34A",   borderColor: "#22C55E" },
                    { label: "Promo Nonaktif", value: promos.length - activeCount,  color: "#6B7280",   borderColor: "#9CA3AF" },
                ].map(s => (
                    <div key={s.label} style={{
                        flex: 1, background: "#fff", borderRadius: 12,
                        padding: "16px 20px", border: "1px solid #EAECF0",
                        borderTop: `3px solid ${s.borderColor}`,
                    }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["All", "Bundling", "Diskon", "Delivery", "Flash"].map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                        style={{
                            padding: "7px 16px", borderRadius: 20,
                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                            border: filterType === t ? "none" : "1px solid #E5E7EB",
                            background: filterType === t ? GREEN_DARK : "#fff",
                            color: filterType === t ? "#fff" : "#6B7280",
                            transition: "all 0.15s",
                        }}
                    >{t}</button>
                ))}
            </div>

            {/* Promo Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                {filtered.map(p => (
                    <PromoCard key={p.id} promo={p} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
                {filtered.length === 0 && (
                    <div style={{
                        gridColumn: "1/-1", padding: 48, textAlign: "center",
                        color: "#D1D5DB", background: "#fff", borderRadius: 12,
                        border: "1px solid #EAECF0",
                    }}>
                        <FaTag size={28} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                        Tidak ada promo untuk kategori ini
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(4px)", display: "flex",
                        alignItems: "center", justifyContent: "center", zIndex: 50,
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            background: "#fff", borderRadius: 20, padding: 28,
                            width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Buat Promo Baru</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                                <FaTimes size={16} />
                            </button>
                        </div>
                        {[
                            { label: "Judul Promo",    key: "title",      type: "text", placeholder: "Contoh: Diskon 10% Weekend" },
                            { label: "Nilai Diskon",   key: "discount",   type: "text", placeholder: "Contoh: 10% / Free Delivery" },
                            { label: "Deskripsi",      key: "desc",       type: "text", placeholder: "Syarat & ketentuan singkat" },
                            { label: "Berlaku Hingga", key: "validUntil", type: "date", placeholder: "" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 13 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>{f.label}</label>
                                <input
                                    type={f.type}
                                    placeholder={f.placeholder}
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
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Tipe Promo</label>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["Diskon", "Bundling", "Delivery", "Flash"].map(t => (
                                    <button key={t}
                                        onClick={() => setForm({ ...form, type: t })}
                                        style={{
                                            padding: "7px 14px", borderRadius: 8,
                                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.type === t ? `2px solid ${GREEN_DARK}` : "1px solid #E5E7EB",
                                            background: form.type === t ? GREEN_MUTED : "#fff",
                                            color: form.type === t ? GREEN_DARK : "#6B7280",
                                        }}
                                    >{t}</button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            style={{
                                width: "100%", background: GREEN_DARK, color: "#fff",
                                border: "none", borderRadius: 10, padding: 12,
                                fontSize: 14, fontWeight: 600, cursor: "pointer",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = GREEN}
                            onMouseLeave={e => e.currentTarget.style.background = GREEN_DARK}
                        >Simpan Promo</button>
                    </div>
                </div>
            )}
        </div>
    );
}