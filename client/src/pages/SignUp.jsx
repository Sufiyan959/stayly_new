
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  axios  from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/signup', formData, { withCredentials: true });

      if (res.data.success === false) {
        setError(res.data.message);
      } else {
        setError(null);
        navigate('/sign-in');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }

    setLoading(false); 
  };


  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="bg-slate-900 text-center py-6">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Create your account
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Join Stayly and find your perfect place
        </p>
      </div>

      {/* FORM */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Your name"
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="font-semibold text-slate-900 hover:underline"
          >
            Sign in
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