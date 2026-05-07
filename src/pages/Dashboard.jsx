import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaUsers, FaStar, FaArrowUp, FaArrowDown, FaEllipsisH } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import customers from "../data/customers";
import orders from "../data/orders";

const GREEN = "#6EA674";
const GREEN_DARK = "#023337";
const GREEN_LIGHT = "#C1E6BA";
const GREEN_MUTED = "#EAF3DE";

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ data, color }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 72, h = 28;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
    return (
        <svg width={w} height={h} style={{ display: "block" }}>
            <polyline points={pts} fill="none" stroke={color || GREEN} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, trend, sparkData, accentColor }) {
    const isUp = trend >= 0;
    return (
        <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: "18px 20px",
            border: "1px solid #EAECF0",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            transition: "box-shadow 0.2s",
            cursor: "pointer",
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(2,51,55,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: GREEN_MUTED, display: "flex",
                    alignItems: "center", justifyContent: "center",
                }}>
                    <span style={{ color: GREEN, fontSize: 16 }}>{icon}</span>
                </div>
                <div style={{
                    display: "flex", alignItems: "center", gap: 3,
                    fontSize: 12, fontWeight: 700,
                    color: isUp ? "#16A34A" : "#DC2626",
                    background: isUp ? "#F0FDF4" : "#FEF2F2",
                    padding: "3px 8px", borderRadius: 20,
                }}>
                    {isUp ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>{label}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>Previous 7days </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: accentColor || GREEN }}>({sub})</span>
                </div>
                {sparkData && <Sparkline data={sparkData} color={accentColor || GREEN} />}
            </div>
        </div>
    );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data, labels }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        const load = () => {
            if (!window.Chart || !canvasRef.current) return;
            if (chartRef.current) chartRef.current.destroy();
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels,
                    datasets: [{
                        data,
                        backgroundColor: data.map((_, i) => i === data.length - 1 ? GREEN : GREEN_LIGHT),
                        borderRadius: 6,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => "Rp " + (ctx.parsed.y / 1000000).toFixed(1) + "jt" } } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: "#9CA3AF", font: { size: 11 } } },
                        y: {
                            grid: { color: "#F5F5F5" },
                            ticks: { color: "#9CA3AF", font: { size: 11 }, callback: v => "Rp " + (v / 1000000).toFixed(0) + "jt" }
                        }
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

// ─── Line Chart ───────────────────────────────────────────────────────────────
function LineChart({ data, labels }) {
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
                        backgroundColor: "rgba(110,166,116,0.1)",
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: GREEN,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: "#9CA3AF", font: { size: 11 } } },
                        y: { grid: { color: "#F5F5F5" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }
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

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        const load = () => {
            if (!window.Chart || !canvasRef.current) return;
            if (chartRef.current) chartRef.current.destroy();
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "doughnut",
                data: {
                    labels: segments.map(s => s.label),
                    datasets: [{ data: segments.map(s => s.value), backgroundColor: segments.map(s => s.color), borderWidth: 0, hoverOffset: 4 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "68%",
                    plugins: { legend: { display: false } }
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

// ─── Card Header ──────────────────────────────────────────────────────────────
function CardHeader({ title, sub, badge, action }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{title}</div>
                {sub && <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{sub}</div>}
            </div>
            {badge && (
                <span style={{
                    background: GREEN_MUTED, color: GREEN_DARK,
                    fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                }}>{badge}</span>
            )}
            {action && action}
            {!badge && !action && (
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                    <FaEllipsisH size={14} />
                </button>
            )}
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
    Completed: { bg: "#F0FDF4", color: "#16A34A", dot: "#22C55E" },
    Pending:   { bg: "#FEFCE8", color: "#CA8A04", dot: "#EAB308" },
    Cancelled: { bg: "#FEF2F2", color: "#DC2626", dot: "#EF4444" },
};

// ─── Top Customer ─────────────────────────────────────────────────────────────
function TopCustomerItem({ rank, name, spent, tier }) {
    const tierColor = { Gold: "#CA8A04", Silver: "#6B7280", Bronze: "#B45309", None: "#9CA3AF" };
    const tierBg = { Gold: "#FEFCE8", Silver: "#F9FAFB", Bronze: "#FFF7ED", None: "#F5F5F5" };
    const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0", borderBottom: "1px solid #F5F5F5",
        }}>
            <div style={{ fontSize: 12, color: "#D1D5DB", fontWeight: 700, width: 16, textAlign: "center" }}>{rank}</div>
            <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: GREEN_MUTED, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 12, fontWeight: 700, color: GREEN, flexShrink: 0,
            }}>{initials}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{name}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Rp {spent.toLocaleString()}</div>
            </div>
            <span style={{
                fontSize: 10, fontWeight: 700,
                background: tierBg[tier] || tierBg.None,
                color: tierColor[tier] || tierColor.None,
                padding: "2px 8px", borderRadius: 20,
            }}>{tier}</span>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const totalOrders = orders.length;
    const totalCompleted = orders.filter(o => o.status === "Completed").length;
    const totalCancelled = orders.filter(o => o.status === "Cancelled").length;
    const totalPending = orders.filter(o => o.status === "Pending").length;
    const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
    const totalCustomers = customers.length;
    const activeMembers = customers.filter(c => c.loyalty !== "None" && c.points > 0).length;

    const monthLabels = ["Nov", "Des", "Jan", "Feb", "Mar", "Apr"];
    const revenueData = [18500000, 22000000, 19800000, 25000000, 23400000, totalRevenue];
    const orderTrendData = [22, 28, 24, 32, 29, totalOrders];
    const sparkOrders = [22, 28, 24, 32, 29, totalOrders];
    const sparkRevenue = [185, 220, 198, 250, 234, Math.round(totalRevenue / 100000)];

    const pieSegments = [
        { label: "Completed", value: totalCompleted, color: GREEN },
        { label: "Pending",   value: totalPending,   color: "#EAB308" },
        { label: "Cancelled", value: totalCancelled, color: "#E5E7EB" },
    ];
    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

    const recentOrders = orders.slice(0, 7);

    return (
        <div style={{ paddingBottom: 32 }}>
            {/* Page Title */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Dashboard</h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>Home</p>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 24 }}>
                <StatCard icon={<FaShoppingCart />} label="Total Orders" value={totalOrders} sub={`+12.4%`} trend={12} sparkData={sparkOrders} />
                <StatCard icon={<FaTruck />} label="Completed" value={totalCompleted} sub={`+${Math.round(totalCompleted/totalOrders*100)}%`} trend={8} sparkData={[18,22,20,26,23,totalCompleted]} />
                <StatCard icon={<FaBan />} label="Cancelled" value={totalCancelled} sub={`-3%`} trend={-3} sparkData={[5,3,6,4,5,totalCancelled]} accentColor="#DC2626" />
                <StatCard icon={<FaDollarSign />} label="Total Revenue" value={`Rp ${(totalRevenue/1000000).toFixed(1)}jt`} sub={`+15%`} trend={15} sparkData={sparkRevenue} />
                <StatCard icon={<FaUsers />} label="Customers" value={totalCustomers} sub={`+5%`} trend={5} sparkData={[80,92,95,101,105,totalCustomers]} />
                <StatCard icon={<FaStar />} label="Active Members" value={activeMembers} sub={`+9%`} trend={9} sparkData={[30,35,32,38,36,activeMembers]} />
            </div>

            {/* ── Row 2 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginBottom: 16 }}>
                {/* Revenue Bar */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #EAECF0" }}>
                    <CardHeader
                        title="Report for this week"
                        sub="Pendapatan 6 bulan terakhir"
                        badge="+15% vs bulan lalu"
                    />
                    {/* Mini summary */}
                    <div style={{ display: "flex", gap: 24, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #F5F5F5" }}>
                        {[
                            { label: "Customers", value: totalCustomers + "k" },
                            { label: "Total Orders", value: totalOrders },
                            { label: "Revenue", value: `Rp ${(totalRevenue/1000000).toFixed(1)}jt` },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ height: 200, position: "relative" }}>
                        <BarChart data={revenueData} labels={monthLabels} />
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: "#9CA3AF" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 2, background: GREEN, display: "inline-block" }} />
                            Bulan ini
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 2, background: GREEN_LIGHT, display: "inline-block" }} />
                            Bulan sebelumnya
                        </span>
                    </div>
                </div>

                {/* Users in last 30 min / Status Order */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Users card */}
                    <div style={{
                        background: GREEN_DARK, borderRadius: 12,
                        padding: "20px 24px", border: "1px solid #EAECF0", flex: 1,
                    }}>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Users in last 30 minutes</div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
                            {totalCustomers}.5K
                        </div>
                        <div style={{ height: 60, marginBottom: 12 }}>
                            <LineChart data={orderTrendData} labels={monthLabels} />
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Sales by Country</div>
                    </div>

                    {/* Status Order */}
                    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #EAECF0" }}>
                        <CardHeader title="Status Order" sub="Distribusi semua order" />
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div style={{ width: 80, height: 80, flexShrink: 0 }}>
                                <DonutChart segments={pieSegments} />
                            </div>
                            <div style={{ flex: 1 }}>
                                {pieSegments.map(seg => (
                                    <div key={seg.label} style={{
                                        display: "flex", alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: 12, marginBottom: 6,
                                    }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280" }}>
                                            <span style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, display: "inline-block" }} />
                                            {seg.label}
                                        </span>
                                        <span style={{ fontWeight: 700, color: "#111827" }}>{seg.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Row 3: Transaction table + Top Products ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>
                {/* Recent Orders */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #EAECF0" }}>
                    <CardHeader
                        title="Transaction"
                        sub="7 order terkini"
                        action={
                            <a href="/orders" style={{
                                fontSize: 12, color: GREEN_DARK, fontWeight: 700,
                                textDecoration: "none", background: GREEN_MUTED,
                                padding: "4px 12px", borderRadius: 20,
                            }}>Filter</a>
                        }
                    />
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #F0F0F0" }}>
                                {["No.", "Id Customer", "Order Date", "Status", "Amount"].map(h => (
                                    <th key={h} style={{
                                        textAlign: "left", padding: "8px 10px",
                                        color: "#9CA3AF", fontWeight: 600,
                                        fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5,
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((o, i) => {
                                const ss = STATUS_STYLE[o.status] || STATUS_STYLE.Pending;
                                return (
                                    <tr key={o.id}
                                        style={{ borderBottom: "1px solid #F9F9F9" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={{ padding: "10px 10px", color: "#9CA3AF" }}>{i + 1}.</td>
                                        <td style={{ padding: "10px 10px", fontFamily: "monospace", color: "#374151" }}>
                                            #{String(o.id).padStart(4, "0")}
                                        </td>
                                        <td style={{ padding: "10px 10px", color: "#6B7280" }}>{o.orderDate}</td>
                                        <td style={{ padding: "10px 10px" }}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: 4,
                                                background: ss.bg, color: ss.color,
                                                padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                                            }}>
                                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: ss.dot }} />
                                                {o.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "10px 10px", fontWeight: 700, color: GREEN_DARK }}>
                                            Rp {o.totalPrice.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div style={{ textAlign: "center", marginTop: 14 }}>
                        <a href="/orders" style={{ fontSize: 12, color: GREEN, fontWeight: 600, textDecoration: "none" }}>
                            Lihat semua →
                        </a>
                    </div>
                </div>

                {/* Top Customers */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #EAECF0" }}>
                    <CardHeader title="Top Pelanggan" sub="Berdasarkan total belanja" />
                    {topCustomers.map((c, i) => (
                        <TopCustomerItem key={c.id} rank={i + 1} name={c.name} spent={c.totalSpent} tier={c.loyalty} />
                    ))}
                    <a href="/customers" style={{
                        display: "block", textAlign: "center", marginTop: 14,
                        fontSize: 12, color: GREEN, fontWeight: 600, textDecoration: "none",
                    }}>All products →</a>
                </div>
            </div>
        </div>
    );
}