import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch ,useSelector } from 'react-redux';
import axios from 'axios';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice.js';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('SignIn - Starting sign in process'); // Debug log
    dispatch(signInStart());

    try {
      console.log('SignIn - Making API call to /api/auth/signin'); // Debug log
      const res = await axios.post('/api/auth/signin', formData, { withCredentials: true });
      console.log('SignIn - API Response:', res.data); // Debug log

      if (res.data.success === false) {
        dispatch(signInFailure(res.data.message));
        return;
      }

      // Dispatch only the user data, not the entire response
      console.log('SignIn - Dispatching signInSuccess with user:', res.data.user); // Debug log
      dispatch(signInSuccess(res.data.user));
      navigate('/');
    } catch (error) {
      console.log('SignIn - Error:', error); // Debug log
      dispatch(signInFailure(error.response?.data?.message || error.message));
    }
  };

  // re
  
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="bg-slate-900 text-center py-6">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Welcome back
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Sign in to your Stayly account
        </p>
      </div>

      {/* FORM */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <button
            disabled={loading}
            className="mt-2 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-slate-600">
          Don’t have an account?{' '}
          <Link
            to="/sign-up"
            className="font-semibold text-slate-900 hover:underline"
          >
            Sign up
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">
            {error}
          </p>
        )}
      </div>

    </div>
  </div>
);

}
