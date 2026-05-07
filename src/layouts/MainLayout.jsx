import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FaTachometerAlt, FaUsers, FaShoppingCart, FaStar, FaTag,
    FaChartBar, FaSignOutAlt, FaBars, FaBell, FaSearch, FaUser,
    FaCog
} from "react-icons/fa";

const GREEN = "#6EA674";
const GREEN_DARK = "#023337";
const GREEN_LIGHT = "#C1E6BA";
const GREEN_MUTED = "#EAF3DE";

const NAV_ITEMS = [
    { path: "/",          icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/customers", icon: <FaUsers />,          label: "Customers" },
    { path: "/orders",    icon: <FaShoppingCart />,   label: "Orders" },
    { path: "/loyalty",   icon: <FaStar />,           label: "Loyalty" },
    { path: "/promos",    icon: <FaTag />,            label: "Promos" },
    { path: "/reports",   icon: <FaChartBar />,       label: "Reports" },
];

export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#F4F5F7", fontFamily: "'Barlow', sans-serif" }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: collapsed ? 72 : 240,
                minHeight: "100vh",
                background: "#fff",
                borderRight: "1px solid #EAECF0",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.25s ease",
                flexShrink: 0,
                position: "sticky",
                top: 0,
                height: "100vh",
                overflowY: "auto",
                overflowX: "hidden",
                zIndex: 40,
            }}>
                {/* Logo */}
                <div style={{
                    padding: collapsed ? "20px 0" : "20px 20px",
                    display: "flex", alignItems: "center", gap: 10,
                    borderBottom: "1px solid #F0F0F0",
                    justifyContent: collapsed ? "center" : "flex-start",
                    minHeight: 64,
                }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: GREEN_MUTED, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 20, flexShrink: 0,
                    }}>🥐</div>
                    {!collapsed && (
                        <div>
                            <div style={{ color: GREEN_DARK, fontWeight: 800, fontSize: 16, lineHeight: 1 }}>
                                Rotte<span style={{ color: GREEN }}>.</span>
                            </div>
                            <div style={{ color: "#AAA", fontSize: 11, marginTop: 2 }}>Bakery CRM</div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "16px 10px" }}>
                    {!collapsed && (
                        <div style={{
                            fontSize: 10, fontWeight: 700, color: "#B0B7C3",
                            letterSpacing: 1.2, textTransform: "uppercase",
                            padding: "0 10px 10px",
                        }}>Main menu</div>
                    )}
                    {NAV_ITEMS.map(item => (
                        <NavLink key={item.path} to={item.path} end={item.path === "/"}
                            style={({ isActive }) => ({
                                display: "flex", alignItems: "center",
                                gap: 10,
                                padding: collapsed ? "11px 0" : "10px 12px",
                                justifyContent: collapsed ? "center" : "flex-start",
                                borderRadius: 10, marginBottom: 2,
                                textDecoration: "none", fontSize: 13,
                                fontWeight: isActive ? 700 : 500,
                                transition: "all 0.15s",
                                background: isActive ? GREEN_MUTED : "transparent",
                                color: isActive ? GREEN : "#6B7280",
                            })}
                        >
                            <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: "12px 10px", borderTop: "1px solid #F0F0F0" }}>
                    <button onClick={handleLogout}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            justifyContent: collapsed ? "center" : "flex-start",
                            padding: collapsed ? "11px 0" : "10px 12px",
                            background: "none", border: "none", cursor: "pointer", borderRadius: 10,
                            color: "#9CA3AF", fontSize: 13, fontWeight: 500,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9CA3AF"; }}
                    >
                        <FaSignOutAlt size={14} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

                {/* Topbar */}
                <header style={{
                    background: "#fff",
                    borderBottom: "1px solid #EAECF0",
                    padding: "0 24px",
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 30,
                    gap: 16,
                }}>
                    {/* Hamburger */}
                    <button onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "#6B7280", display: "flex", alignItems: "center",
                            padding: 6, borderRadius: 8, flexShrink: 0,
                        }}>
                        <FaBars size={16} />
                    </button>

                    {/* Search Bar */}
                    <div
                        style={{
                            position: "relative", flex: 1, maxWidth: 360,
                            cursor: "pointer",
                        }}
                        onClick={() => setSearchOpen(true)}
                    >
                        <FaSearch style={{
                            position: "absolute", left: 12,
                            top: "50%", transform: "translateY(-50%)",
                            color: "#9CA3AF", fontSize: 13, pointerEvents: "none",
                        }} />
                        <input
                            readOnly
                            type="text"
                            placeholder="Search data, users, or reports"
                            style={{
                                width: "100%", paddingLeft: 36, paddingRight: 12,
                                paddingTop: 9, paddingBottom: 9,
                                border: "1px solid #E5E7EB", borderRadius: 10,
                                fontSize: 13, outline: "none",
                                boxSizing: "border-box", color: "#9CA3AF",
                                background: "#FAFAFA", cursor: "pointer",
                            }}
                        />
                        <span style={{
                            position: "absolute", right: 10, top: "50%",
                            transform: "translateY(-50%)",
                            background: "#F0F0F0", color: "#AAA",
                            fontSize: 10, padding: "2px 6px", borderRadius: 4,
                        }}>⌘K</span>
                    </div>

                    {/* Right side */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Bell */}
                        <button style={{
                            background: "none", border: "none", cursor: "pointer",
                            position: "relative", color: "#6B7280",
                            display: "flex", padding: 6, borderRadius: 8,
                        }}>
                            <FaBell size={16} />
                            <span style={{
                                position: "absolute", top: 4, right: 4,
                                width: 8, height: 8, background: "#EF4444",
                                borderRadius: "50%", border: "1.5px solid #fff",
                            }} />
                        </button>

                        {/* Settings */}
                        <button style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "#6B7280", display: "flex", padding: 6, borderRadius: 8,
                        }}>
                            <FaCog size={15} />
                        </button>

                        {/* Divider */}
                        <div style={{ width: 1, height: 24, background: "#E5E7EB" }} />

                        {/* Avatar */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: "50%",
                                background: GREEN_MUTED, display: "flex",
                                alignItems: "center", justifyContent: "center",
                            }}>
                                <FaUser size={13} style={{ color: GREEN }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", lineHeight: 1 }}>Admin</div>
                                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Rotte Bakery</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, padding: "24px 28px", minWidth: 0 }}>
                    <Outlet />
                </main>
            </div>

            {/* Search Modal */}
            {searchOpen && (
                <div
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(4px)", display: "flex",
                        alignItems: "center", justifyContent: "center", zIndex: 100,
                    }}
                    onClick={() => setSearchOpen(false)}
                >
                    <div
                        style={{
                            background: "#fff", borderRadius: 16, padding: "24px",
                            width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#111827" }}>
                            Search
                        </h2>
                        <div style={{ position: "relative" }}>
                            <FaSearch style={{
                                position: "absolute", left: 12, top: "50%",
                                transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13,
                            }} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Type something..."
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                style={{
                                    width: "100%", paddingLeft: 36, paddingRight: 12,
                                    paddingTop: 10, paddingBottom: 10,
                                    border: `1.5px solid ${GREEN}`, borderRadius: 10,
                                    fontSize: 13, outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>
                        {keyword && (
                            <div style={{ marginTop: 12, fontSize: 13, color: "#6B7280" }}>
                                Searching: <strong style={{ color: "#111827" }}>{keyword}</strong>
                            </div>
                        )}
                        <button
                            onClick={() => setSearchOpen(false)}
                            style={{
                                marginTop: 16, width: "100%", background: GREEN_DARK,
                                color: "#fff", border: "none", borderRadius: 10,
                                padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                            }}
                        >Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}