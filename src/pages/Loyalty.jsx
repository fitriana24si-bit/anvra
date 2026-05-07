// Loyalty.jsx

import { useEffect, useRef } from "react";
import {
    FaStar,
    FaMedal,
    FaTrophy,
    FaCrown,
    FaEllipsisH,
} from "react-icons/fa";

import PageHeader from "../components/PageHeader";
import customers from "../data/customers";

const GREEN = "#6EA674";
const GREEN_DARK = "#023337";
const GREEN_LIGHT = "#C1E6BA";
const GREEN_MUTED = "#EAF3DE";

const TIER = {
    Gold: {
        icon: <FaCrown />,
        bg: "#FEF3C7",
        color: "#92400E",
        border: "#FCD34D",
        next: null,
        nextPts: null,
        bar: "#F59E0B",
    },
    Silver: {
        icon: <FaTrophy />,
        bg: "#F1F5F9",
        color: "#475569",
        border: "#CBD5E1",
        next: "Gold",
        nextPts: 1000,
        bar: "#94A3B8",
    },
    Bronze: {
        icon: <FaMedal />,
        bg: "#FEF0E0",
        color: "#92400E",
        border: "#FCA86C",
        next: "Silver",
        nextPts: 500,
        bar: "#D97706",
    },
    None: {
        icon: <FaStar />,
        bg: "#F5F5F5",
        color: "#9CA3AF",
        border: "#E5E7EB",
        next: "Bronze",
        nextPts: 100,
        bar: "#D1D5DB",
    },
};

function CardHeader({ title, sub }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
            }}
        >
            <div>
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#111827",
                    }}
                >
                    {title}
                </div>

                {sub && (
                    <div
                        style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginTop: 2,
                        }}
                    >
                        {sub}
                    </div>
                )}
            </div>

            <button
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                }}
            >
                <FaEllipsisH size={14} />
            </button>
        </div>
    );
}

function TierSummaryCard({
    tier,
    count,
    icon,
    bg,
    color,
    border,
}) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #EAECF0",
                borderRadius: 12,
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "0.2s ease",
                cursor: "pointer",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(2,51,55,0.08)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "none")
            }
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color,
                        fontSize: 18,
                        border: `1px solid ${border}`,
                    }}
                >
                    {icon}
                </div>

                <div
                    style={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: "#111827",
                    }}
                >
                    {count}
                </div>
            </div>

            <div>
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#111827",
                    }}
                >
                    {tier} Member
                </div>

                <div
                    style={{
                        fontSize: 11,
                        color: "#9CA3AF",
                        marginTop: 4,
                    }}
                >
                    {count} pelanggan aktif
                </div>
            </div>
        </div>
    );
}

function ProgressBar({ value, max, color }) {
    const pct = max
        ? Math.min((value / max) * 100, 100)
        : 100;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}
        >
            <div
                style={{
                    flex: 1,
                    height: 6,
                    background: "#F3F4F6",
                    borderRadius: 10,
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 10,
                        transition: "width 0.5s ease",
                    }}
                />
            </div>

            <span
                style={{
                    fontSize: 11,
                    color: "#9CA3AF",
                    minWidth: 36,
                    textAlign: "right",
                }}
            >
                {Math.round(pct)}%
            </span>
        </div>
    );
}

function TierDonut({ data }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const load = () => {
            if (!window.Chart || !canvasRef.current) return;

            if (chartRef.current) chartRef.current.destroy();

            chartRef.current = new window.Chart(
                canvasRef.current,
                {
                    type: "doughnut",
                    data: {
                        labels: data.map((d) => d.label),
                        datasets: [
                            {
                                data: data.map((d) => d.value),
                                backgroundColor: data.map(
                                    (d) => d.color
                                ),
                                borderWidth: 0,
                                hoverOffset: 4,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "68%",
                        plugins: {
                            legend: { display: false },
                        },
                    },
                }
            );
        };

        if (window.Chart) load();
        else {
            const s = document.createElement("script");
            s.src =
                "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            s.onload = load;
            document.head.appendChild(s);
        }

        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, []);

    return <canvas ref={canvasRef} />;
}

export default function Loyalty() {
    const members = customers.filter(
        (c) => c.loyalty !== "None"
    );

    const gold = customers.filter(
        (c) => c.loyalty === "Gold"
    ).length;

    const silver = customers.filter(
        (c) => c.loyalty === "Silver"
    ).length;

    const bronze = customers.filter(
        (c) => c.loyalty === "Bronze"
    ).length;

    const nonMember = customers.filter(
        (c) => c.loyalty === "None"
    ).length;

    const totalPoints = members.reduce(
        (s, c) => s + c.points,
        0
    );

    const avgPoints = members.length
        ? Math.round(totalPoints / members.length)
        : 0;

    const donutData = [
        {
            label: "Gold",
            value: gold,
            color: "#F59E0B",
        },
        {
            label: "Silver",
            value: silver,
            color: "#94A3B8",
        },
        {
            label: "Bronze",
            value: bronze,
            color: "#D97706",
        },
        {
            label: "Non",
            value: nonMember,
            color: "#E5E7EB",
        },
    ];

    return (
        <div style={{ paddingBottom: 32 }}>
            <PageHeader
                title="Loyalty Program"
                breadcrumb={["Dashboard", "Loyalty"]}
            />

            {/* SUMMARY */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                    gap: 16,
                    marginBottom: 24,
                }}
            >
                <TierSummaryCard
                    tier="Gold"
                    count={gold}
                    icon={TIER.Gold.icon}
                    bg={TIER.Gold.bg}
                    color={TIER.Gold.color}
                    border={TIER.Gold.border}
                />

                <TierSummaryCard
                    tier="Silver"
                    count={silver}
                    icon={TIER.Silver.icon}
                    bg={TIER.Silver.bg}
                    color={TIER.Silver.color}
                    border={TIER.Silver.border}
                />

                <TierSummaryCard
                    tier="Bronze"
                    count={bronze}
                    icon={TIER.Bronze.icon}
                    bg={TIER.Bronze.bg}
                    color={TIER.Bronze.color}
                    border={TIER.Bronze.border}
                />

                <TierSummaryCard
                    tier="Non"
                    count={nonMember}
                    icon={TIER.None.icon}
                    bg={TIER.None.bg}
                    color={TIER.None.color}
                    border={TIER.None.border}
                />
            </div>

            {/* ROW */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 16,
                    marginBottom: 16,
                }}
            >
                {/* DONUT */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "20px 24px",
                        border: "1px solid #EAECF0",
                    }}
                >
                    <CardHeader
                        title="Distribusi Tier"
                        sub="Komposisi member saat ini"
                    />

                    <div
                        style={{
                            position: "relative",
                            height: 180,
                            marginBottom: 20,
                        }}
                    >
                        <TierDonut data={donutData} />

                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 26,
                                    fontWeight: 800,
                                    color: "#111827",
                                }}
                            >
                                {members.length}
                            </div>

                            <div
                                style={{
                                    fontSize: 11,
                                    color: "#9CA3AF",
                                }}
                            >
                                members
                            </div>
                        </div>
                    </div>

                    {donutData.map((d) => (
                        <div
                            key={d.label}
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                                fontSize: 12,
                            }}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 2,
                                        background: d.color,
                                        display: "inline-block",
                                    }}
                                />

                                <span
                                    style={{
                                        color: "#6B7280",
                                    }}
                                >
                                    {d.label === "Non"
                                        ? "Non-Member"
                                        : d.label}
                                </span>
                            </span>

                            <span
                                style={{
                                    fontWeight: 700,
                                    color: "#111827",
                                }}
                            >
                                {d.value}
                            </span>
                        </div>
                    ))}

                    <div
                        style={{
                            marginTop: 16,
                            borderTop:
                                "1px solid #F5F5F5",
                            paddingTop: 14,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                fontSize: 12,
                            }}
                        >
                            <span
                                style={{
                                    color: "#9CA3AF",
                                }}
                            >
                                Total Poin
                            </span>

                            <span
                                style={{
                                    fontWeight: 700,
                                    color: GREEN_DARK,
                                }}
                            >
                                {totalPoints.toLocaleString()}
                            </span>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                fontSize: 12,
                                marginTop: 6,
                            }}
                        >
                            <span
                                style={{
                                    color: "#9CA3AF",
                                }}
                            >
                                Rata-rata Poin
                            </span>

                            <span
                                style={{
                                    fontWeight: 700,
                                    color: "#111827",
                                }}
                            >
                                {avgPoints}
                            </span>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "20px 24px",
                        border: "1px solid #EAECF0",
                    }}
                >
                    <CardHeader
                        title="Poin & Progress Member"
                        sub="Progress menuju tier berikutnya"
                    />

                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: 13,
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        borderBottom:
                                            "1px solid #F5F5F5",
                                    }}
                                >
                                    {[
                                        "Member",
                                        "Tier",
                                        "Poin",
                                        "Progress",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "10px 14px",
                                                color:
                                                    "#9CA3AF",
                                                fontWeight: 600,
                                                fontSize: 11,
                                                textTransform:
                                                    "uppercase",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {members
                                    .slice(0, 10)
                                    .map((c) => {
                                        const t =
                                            TIER[c.loyalty];

                                        const initials =
                                            c.name
                                                .split(" ")
                                                .map(
                                                    (w) =>
                                                        w[0]
                                                )
                                                .slice(0, 2)
                                                .join("")
                                                .toUpperCase();

                                        return (
                                            <tr
                                                key={c.id}
                                                style={{
                                                    borderBottom:
                                                        "1px solid #F9F9F9",
                                                    transition:
                                                        "0.2s ease",
                                                }}
                                                onMouseEnter={(
                                                    e
                                                ) =>
                                                    (e.currentTarget.style.background =
                                                        "#FAFAFA")
                                                }
                                                onMouseLeave={(
                                                    e
                                                ) =>
                                                    (e.currentTarget.style.background =
                                                        "transparent")
                                                }
                                            >
                                                <td
                                                    style={{
                                                        padding:
                                                            "11px 14px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 10,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 34,
                                                                height: 34,
                                                                borderRadius:
                                                                    "50%",
                                                                background:
                                                                    t.bg,
                                                                color:
                                                                    t.color,
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {
                                                                initials
                                                            }
                                                        </div>

                                                        <span
                                                            style={{
                                                                fontWeight: 600,
                                                                color:
                                                                    "#111827",
                                                            }}
                                                        >
                                                            {
                                                                c.name
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "11px 14px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            background:
                                                                t.bg,
                                                            color:
                                                                t.color,
                                                            border: `1px solid ${t.border}`,
                                                            padding:
                                                                "4px 10px",
                                                            borderRadius: 20,
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {
                                                            c.loyalty
                                                        }
                                                    </span>
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "11px 14px",
                                                        fontWeight: 700,
                                                        color:
                                                            GREEN_DARK,
                                                    }}
                                                >
                                                    {c.points}
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "11px 14px",
                                                        minWidth: 200,
                                                    }}
                                                >
                                                    {t.nextPts ? (
                                                        <div>
                                                            <ProgressBar
                                                                value={
                                                                    c.points
                                                                }
                                                                max={
                                                                    t.nextPts
                                                                }
                                                                color={
                                                                    t.bar
                                                                }
                                                            />

                                                            <div
                                                                style={{
                                                                    fontSize: 10,
                                                                    color:
                                                                        "#9CA3AF",
                                                                    marginTop: 4,
                                                                }}
                                                            >
                                                                {Math.max(
                                                                    0,
                                                                    t.nextPts -
                                                                        c.points
                                                                )}{" "}
                                                                poin lagi
                                                                →
                                                                {
                                                                    t.next
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                fontSize: 12,
                                                                color:
                                                                    "#F59E0B",
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            ✦
                                                            Tier
                                                            Tertinggi
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* REQUIREMENT */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "20px 24px",
                    border: "1px solid #EAECF0",
                }}
            >
                <CardHeader
                    title="Syarat Naik Tier"
                    sub="Benefit tiap tingkatan member"
                />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(220px,1fr))",
                        gap: 16,
                    }}
                >
                    {[
                        {
                            tier: "Bronze",
                            pts: "0–499 poin",
                            color: "#D97706",
                            bg: "#FEF0E0",
                            desc: "Gratis bergabung dan mendapatkan poin setiap pembelian",
                        },
                        {
                            tier: "Silver",
                            pts: "500–999 poin",
                            color: "#475569",
                            bg: "#F1F5F9",
                            desc: "Diskon 5% dan prioritas pelayanan",
                        },
                        {
                            tier: "Gold",
                            pts: "1000+ poin",
                            color: "#92400E",
                            bg: "#FEF3C7",
                            desc: "Promo eksklusif, diskon 10%, dan gratis ongkir",
                        },
                    ].map((t) => (
                        <div
                            key={t.tier}
                            style={{
                                background: t.bg,
                                borderRadius: 12,
                                padding: "18px 18px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: t.color,
                                }}
                            >
                                {t.tier}
                            </div>

                            <div
                                style={{
                                    fontSize: 11,
                                    color:
                                        t.color + "99",
                                    marginTop: 3,
                                    fontWeight: 600,
                                }}
                            >
                                {t.pts}
                            </div>

                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#6B7280",
                                    marginTop: 10,
                                    lineHeight: 1.6,
                                }}
                            >
                                {t.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}