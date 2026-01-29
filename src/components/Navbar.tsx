import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Menu, X, LogOut, User, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600 hover:text-blue-700">
            <Car className="w-6 h-6" />
            <span>CarSwap</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link to="/list-car" className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <Plus className="w-4 h-4" />
                  <span>List Car</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 py-2">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 py-2">
                  Dashboard
                </Link>
                <Link to="/list-car" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  List Car
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
                >
                  Sign Out
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 py-2">
                  Login
                </Link>
                <Link to="/signup" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
