export default function Container({ children }) {
  return (
    <div className="card">
      <h1>Framework Lanjutan</h1>
      <hr />

      <main>
        {children}
      </main>

      <hr />
      <footer>
        <p>2026 - Sistem Informasi</p>
      </footer>
    </div>
  );
}