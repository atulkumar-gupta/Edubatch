import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">EduBatch</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link to="/batches" className="text-gray-700 hover:text-indigo-600">Batches</Link>

              {user.role === 'student' && (
                <Link to="/my-enrollments" className="text-gray-700 hover:text-indigo-600">My Enrollments</Link>
              )}

              {(user.role === 'admin' || user.role === 'teacher') && (
                <Link to="/attendance" className="text-gray-700 hover:text-indigo-600">Attendance</Link>
              )}

              {user.role === 'student' && (
                <Link to="/attendance" className="text-gray-700 hover:text-indigo-600">My Attendance</Link>
              )}

              <Link to="/notices" className="text-gray-700 hover:text-indigo-600">Notices</Link>
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600">Profile</Link>
              <span className="text-sm text-gray-500">{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="text-red-600 hover:underline text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;