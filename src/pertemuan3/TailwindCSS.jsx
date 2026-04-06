export function Card({ children }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-[400px]">
      {children}
    </div>
  );
}

export function Button({ children, type = "button" }) {
  return (
    <button
      type={type}
      className="w-full bg-green-500 text-white py-2 rounded-lg mt-3 hover:bg-green-600"
    >
      {children}
    </button>
  );
}

export function Alert({ children }) {
  return (
    <div className="text-red-500 text-sm bg-red-100 p-2 mt-1 rounded">
      {children}
    </div>
  );
}

export function ResultBox({ children }) {
  return (
    <div className="mt-5 p-3 bg-green-100 rounded">
      {children}
    </div>
  );
}