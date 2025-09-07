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
                {user?.is_admin && (
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-gray-900 flex items-center">
               