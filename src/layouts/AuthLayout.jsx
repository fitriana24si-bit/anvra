import { Outlet } from "react-router-dom";

const GREEN = "#6EA674";
const GREEN_DARK = "#023337";
const GREEN_MUTED = "#EAF3DE";

export default function AuthLayout() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F4F5F7",
            fontFamily: "'Barlow', sans-serif",
            padding: "24px",
        }}>
            {/* Decorative side panel */}
            <div style={{
                display: "flex",
                width: "100%",
                maxWidth: 900,
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(2,51,55,0.12)",
            }}>
                {/* Left panel - branding */}
                <div style={{
                    width: 340,
                    background: GREEN_DARK,
                    padding: "48px 36px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}>
                    <div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                            Rotte<span style={{ color: GREEN }}>.</span>
                        </div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Bakery CRM</div>
                    </div>

                    <div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 12 }}>
                            Welcome back to your bakery dashboard
                        </div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                            Manage your customers, orders, loyalty programs, and reports all in one place.
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 20 }}>
                        {[
                            { value: "30+", label: "Customers" },
                            { value: "98%", label: "Satisfaction" },
                            { value: "1.2jt", label: "Revenue" },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right panel - form */}
                <div style={{
                    flex: 1,
                    background: "#fff",
                    padding: "48px 44px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                    <Outlet />
                    <p style={{
                        textAlign: "center",
                        fontSize: 11,
                        color: "#9CA3AF",
                        marginTop: 28,
                    }}>
                        © 2025 Rotte Bakery CRM. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}