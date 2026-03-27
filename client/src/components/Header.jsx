// components/Header.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getImageUrl } from '../config';

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?searchTerm=${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-wide text-white">
            Stayly
          </span>
          <span className="hidden sm:inline text-xs text-slate-300 tracking-widest">
            REAL ESTATE
          </span>
        </Link>

        {/* SEARCH */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-3 bg-slate-700/60 px-5 py-2 rounded-full border border-slate-600 focus-within:ring-2 focus-within:ring-slate-400 transition">
          <button type="submit" className="cursor-pointer">
            <FaSearch className="text-slate-300 text-sm hover:text-white transition" />
          </button>
          <input
            type="text"
            placeholder="Search homes, cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none text-sm w-56 text-slate-100 placeholder-slate-400"
          />
        </form>

        {/* NAVIGATION */}
        <ul className="flex items-center gap-6">

          {/* Mobile Search Icon */}
          <button 
            onClick={() => {
              const userInput = prompt('Search homes, cities, users...');
              if (userInput && userInput.trim()) {
                navigate(`/search?searchTerm=${userInput}`);
              }
            }}
            className="md:hidden text-slate-300 hover:text-white transition"
          >
            <FaSearch className="text-lg" />
          </button>

          <Link to="/">
            <li className="hidden sm:inline text-sm font-medium text-slate-300 hover:text-white transition">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-sm font-medium text-slate-300 hover:text-white transition">
              About
            </li>
          </Link>

          <Link to="/profile" className="flex items-center">
            {currentUser ? (
              <img
                className="h-10 w-10 rounded-full object-cover border-2 border-slate-500 hover:border-slate-300 transition"
                src={`${getImageUrl(currentUser.avatar)}?t=${Date.now()}`}
                alt="profile"
              />
            ) : (
              <li className="text-sm font-semibold text-slate-900 bg-slate-200 px-4 py-2 rounded-full hover:bg-white transition">
                Sign in
              </li>
            )}
          </Link>

        </ul>
      </div>
    </header>
  );
}

  

export default Header;

