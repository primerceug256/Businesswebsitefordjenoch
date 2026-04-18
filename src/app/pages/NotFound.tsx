import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
        <p className="text-2xl text-white mb-8">Page Not Found</p>
        <Link to="/" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
          Go Home
        </Link>
      </div>
    </div>
  );
}
