import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300">
      <h1 className="text-5xl font-bold text-blue-700 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold">
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;