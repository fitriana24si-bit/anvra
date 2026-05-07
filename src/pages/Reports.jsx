import { useEffect, useRef } from "react";
import { FaChartBar, FaUsers, FaExclamationTriangle, FaArrowUp, FaDownload } from "react-icons/fa";
import customers from "../data/customers";
import orders from "../data/orders";

const GREEN = "#6EA674";
const GREEN_DARK = "#023337";
const GREEN_LIGHT = "#C1E6BA";
const GREEN_MUTED = "#EAF3DE";

function MetricCard({ label, value, sub, color, icon }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 12,
            padding: "18px 20px", border: "1px solid #EAECF0",
            display: "flex", gap: 14, alignItems: "flex-start",
        }}>
            <div style={{
                background: color + "1A", borderRadius: 10,
                padding: 10, flexShrink: 0,
            }}>
                <span style={{ color, fontSize: 16 }}>{icon}</span>
            </div>
            <div>
                <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{sub}</div>
            </div>
        </div>
    );
}

function HorizontalBar({ data }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        const load = () => {
            if (!window.Chart || !canvasRef.current) return;
            if (chartRef.current) chartRef.current.destroy();
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels: data.map(d => d.label),
                    datasets: [{
                        data: data.map(d => d.value),
                        backgroundColor: data.map((_, i) => {
                            const stops = [GREEN_DARK, GREEN, "#5A9E60", GREEN_LIGHT, "#A8D5AE"];
                            return stops[i] || GREEN_LIGHT;
                        }),
                        borderRadius: 6,
                        borderSkipped: false,
                    }]
                },
                options: {
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: "#F5F5F5" }, ticks: { color: "#9CA3AF", font: { size: 11 }, callback: v => v + " pcs" } },
                        y: { grid: { display: false }, ticks: { color: "#374151", font: { size: 12 } } },
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

function StackedBar({ labels, datasets }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        const load = () => {
            if (!window.Chart || !canvasRef.current) return;
            if (chartRef.current) chartRef.current.destroy();
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "bar",
                data: { labels, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { stacked: true, grid: { display: false }, ticks: { color: "#9CA3AF", font: { size: 11 } } },
                        y: { stacked: true, grid: { color: "#F5F5F5" }, ticks: { color: "#9CA3AF", font: { size: 11 }, callback: v => "Rp " + (v / 1000000).toFixed(0) + "jt" } },
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

export default function Reports() {
    const totalTransaction = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const avgOrderValue = totalTransaction ? Math.round(totalRevenue / totalTransaction) : 0;
    const completedOrders = orders.filter(o => o.status === "Completed");
    const completedRevenue = completedOrders.reduce((s, o) => s + o.totalPrice, 0);
    const conversionRate = totalTransaction ? Math.round((completedOrders.length / totalTransaction) * 100) : 0;

    const memberRevenue = orders.filter(o => {
        const cust = customers.find(c => c.id === o.customerId);
        return cust && (cust.loyalty === "Gold" || cust.loyalty === "Silver");
    }).reduce((sum, o) => sum + o.totalPrice, 0);

    const totalCustomers = customers.length;
    const goldMembers = customers.filter(c => c.loyalty === "Gold").length;

    const topProducts = [
        { label: "Roti Coklat",   value: 142 },
        { label: "Croissant",     value: 118 },
        { label: "Sourdough",     value: 97 },
        { label: "Roti Tawar",    value: 85 },
        { label: "Cinnamon Roll", value: 71 },
    ];

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
    const stackedDatasets = [
        { label: "Cash",     data: [4000000, 5000000, 3500000, 6000000, 5500000, 4800000], backgroundColor: GREEN_DARK, borderRadius: 4 },
        { label: "Transfer", data: [3000000, 4000000, 5000000, 4500000, 5000000, 6000000], backgroundColor: GREEN,      borderRadius: 4 },
        { label: "QRIS",     data: [2000000, 2500000, 3000000, 3500000, 4000000, 4500000], backgroundColor: GREEN_LIGHT, borderRadius: 4 },
    ];

    const inactiveCustomers = [
        { name: "Hilman Fauzi",  lastOrder: "31 Maret 2025",  spent: 850000 },
        { name: "Irfan Hakim",   lastOrder: "8 April 2025",   spent: 620000 },
        { name: "Dewi Susanti",  lastOrder: "2 April 2025",   spent: 430000 },
        { name: "Budi Santoso",  lastOrder: "25 Maret 2025",  spent: 1200000 },
    ];

    return (
        <div style={{ paddingBottom: 32 }}>
            {/* Page Title */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Laporan CRM</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>Dashboard / Reports</p>
                </div>
                <button style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "#fff", color: GREEN_DARK,
                    border: `1px solid ${GREEN_DARK}`,
                    borderRadius: 10, padding: "10px 18px",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                    <FaDownload size={11} /> Export PDF
                </button>
            </div>

            {/* Metric Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
                <MetricCard label="Total Transaksi"       value={totalTransaction}                              sub="Semua status"       color={GREEN_DARK} icon={<FaChartBar />} />
                <MetricCard label="Total Pendapatan"      value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} sub="Gross revenue"      color="#16A34A"    icon={<FaArrowUp />} />
                <MetricCard label="Nilai Order Rata-rata" value={`Rp ${avgOrderValue.toLocaleString()}`}        sub="Per transaksi"      color="#7C3AED"    icon={<FaChartBar />} />
                <MetricCard label="Konversi Selesai"      value={`${conversionRate}%`}                          sub="Completed / total"  color="#CA8A04"    icon={<FaArrowUp />} />
                <MetricCard label="Total Pelanggan"       value={totalCustomers}                                sub="Terdaftar"          color="#0369A1"    icon={<FaUsers />} />
                <MetricCard label="Kontribusi Gold/Silver" value={`Rp ${(memberRevenue / 1000000).toFixed(1)}jt`} sub="Member premium"   color={GREEN}      icon={<FaChartBar />} />
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {/* Top Products */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "22px 24px", border: "1px solid #EAECF0" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 4 }}>Produk Terlaris</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Berdasarkan jumlah terjual</div>
                    <div style={{ position: "relative", height: 200 }}>
                        <HorizontalBar data={topProducts} />
                    </div>
                </div>

                {/* Stacked Revenue */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "22px 24px", border: "1px solid #EAECF0" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 2 }}>Revenue per Metode Bayar</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 10 }}>6 bulan terakhir</div>
                    <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                        {stackedDatasets.map(d => (
                            <span key={d.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9CA3AF" }}>
                                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.backgroundColor, display: "inline-block" }} />
                                {d.label}
                            </span>
                        ))}
                    </div>
                    <div style={{ position: "relative", height: 180 }}>
                        <StackedBar labels={monthLabels} datasets={stackedDatasets} />
                    </div>
                </div>
            </div>

            {/* Inactive Customers */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "22px 24px", border: "1px solid #EAECF0", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ background: "#FEF9C3", borderRadius: 8, padding: "7px 9px" }}>
                        <FaExclamationTriangle style={{ color: "#CA8A04", fontSize: 14 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Pelanggan Tidak Aktif (30+ Hari)</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>Perlu follow-up / promo retensi</div>
                    </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#FAFAFA" }}>
                                {["Pelanggan", "Order Terakhir", "Total Belanja Historis", "Aksi"].map(h => (
                                    <th key={h} style={{
                                        textAlign: "left", padding: "10px 14px",
                                        color: "#9CA3AF", fontWeight: 600,
                                        fontSize: 11, textTransform: "uppercase",
                                        letterSpacing: 0.4, borderBottom: "1px solid #F0F0F0",
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inactiveCustomers.map(c => (
                                <tr key={c.name}
                                    style={{ borderBottom: "1px solid #F9F9F9" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 14px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: "50%",
                                                background: GREEN_MUTED, color: GREEN_DARK,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 11, fontWeight: 700, flexShrink: 0,
                                            }}>
                                                {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                                            </div>
                                            <span style={{ fontWeight: 600, color: "#111827" }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <span style={{
                                            background: "#FEF9C3", color: "#A16207",
                                            padding: "3px 10px", borderRadius: 20,
                                            fontSize: 11, fontWeight: 600,
                                        }}>{c.lastOrder}</span>
                                    </td>
                                    <td style={{ padding: "12px 14px", fontWeight: 700, color: GREEN_DARK }}>
                                        Rp {c.spent.toLocaleString()}
                                    </td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <button style={{
                                            background: GREEN_MUTED, color: GREEN_DARK,
                                            border: "none", borderRadius: 6,
                                            padding: "5px 12px", fontSize: 12,
                                            fontWeight: 600, cursor: "pointer",
                                        }}>Kirim Promo</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Footer */}
            <div style={{
                background: GREEN_DARK,
                borderRadius: 12, padding: "22px 28px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Rotte Bakery CRM</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 3 }}>
                        Laporan diperbarui otomatis dari data transaksi
                    </div>
                </div>
                <div style={{ display: "flex", gap: 32 }}>
                    {[
                        { label: "Revenue Bersih", value: `Rp ${(completedRevenue / 1000000).toFixed(1)}jt` },
                        { label: "Gold Members",   value: goldMembers },
                        { label: "Avg Order",      value: `Rp ${(avgOrderValue / 1000).toFixed(0)}rb` },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{s.value}</div>
                            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}