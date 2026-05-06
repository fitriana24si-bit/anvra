export default function PageHeader({ title, breadcrumb, children }) {
    const renderBreadcrumb = () => {
        if (Array.isArray(breadcrumb)) {
            return breadcrumb.join(" / ");
        }
        return breadcrumb;
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <div className="text-xl font-bold">
                        {title || "Dashboard"}
                    </div>
                    <div className="text-gray-400 text-sm">
                        {breadcrumb ? renderBreadcrumb() : "Dashboard"}
                    </div>
                </div>

                {/* ❌ BUTTON DEFAULT DIHAPUS */}
                {/* Hanya tampil kalau memang dikirim dari halaman */}
                {children && children}
            </div>
        </div>
    );
}