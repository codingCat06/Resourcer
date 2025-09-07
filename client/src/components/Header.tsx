import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          const response = await authAPI.verifyToken();
          setUser(response.user);
        } catch (error) {
          // Token invalid, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Resourcer
            </Link>
          </div>

          <nav className="flex items-center space-x-8">
            <Link to="/search" className="text-gray-700 hover:text-gray-900">
              Search
            </Link>

            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/create-post" className="text-gray-700 hover:text-gray-900">
                  Create Post
                </Link>
                {user?.isAdmin && (
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-gray-900 flex items-center">
                      관리자
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          관리자 대시보드
                        </Link>
                        <Link
                          to="/admin/posts"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          포스트 관리
                        </Link>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          사용자 관리
                        </Link>
                        <Link
                          to="/admin/contacts"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          문의 관리
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;