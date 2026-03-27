import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { persistor } from '../redux/store';
import { getImageUrl } from '../config';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileError, setFileError] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
        phone: currentUser.phone || ''
      });
      setIsInitialized(true);
    } else {
      const timer = setTimeout(() => setIsInitialized(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      setFileError(true);
      setFile(undefined);
      return;
    }
    setFileError(false);
    setFile(selectedFile);
    dispatch(updateUserFailure(null));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!currentUser?._id) {
        dispatch(updateUserFailure('User not authenticated. Please login again.'));
        return;
      }

      dispatch(updateUserStart());
      const dataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'password') {
          if (formData[key] && formData[key].trim() !== '') {
            dataToSend.append(key, formData[key]);
          }
        } else if (formData[key] && formData[key] !== currentUser[key]) {
          dataToSend.append(key, formData[key]);
        }
      });

      if (file) {
        dataToSend.append('avatar', file);
      }

      const hasChanges = file || (Object.keys(formData).some(key => 
        key === 'password' ? (formData[key] && formData[key].trim() !== '') : 
        (formData[key] && formData[key] !== currentUser[key])
      ));
      
      if (!hasChanges) {
        dispatch(updateUserFailure('No changes to update'));
        return;
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        credentials: 'include',
        body: dataToSend,
      });
      
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      const updatedUser = {
        ...currentUser,
        ...data,
        avatar: data.avatar ? (data.avatar.startsWith('http') ? data.avatar : data.avatar) : currentUser.avatar
      };

      dispatch(updateUserSuccess(updatedUser));
      setUpdateSuccess(true);
      setFile(undefined);
      setFormData({
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        password: '',
        phone: updatedUser.phone || ''
      });
      
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    
    try {
      if (!currentUser?._id) {
        dispatch(deleteUserFailure('User not authenticated'));
        return;
      }

      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
      try { await persistor.purge(); } catch (e) {}
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message || 'Delete failed'));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', { method: 'GET', credentials: 'include' });
      const data = await res.json().catch(() => ({ success: true }));
      
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
      try { await persistor.purge(); } catch (e) {}
      navigate('/sign-in');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      if (!currentUser?._id) {
        setShowListingsError(true);
        return;
      }

      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
      setActiveTab('listings');
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) return;
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!isInitialized || !currentUser) {
    return (
      <div className='p-3 max-w-lg mx-auto'>
        <div className='flex items-center justify-center h-32'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700'></div>
          <span className='ml-2'>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <p className="text-slate-300 text-sm mt-1">Manage your account & listings</p>
        </div>

        {/* TABS */}
        <div className="bg-slate-50 border-b flex overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'security', label: 'Security' },
            { id: 'listings', label: 'My Listings' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => tab.id === 'listings' ? handleShowListings() : setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition ${
                activeTab === tab.id
                  ? 'text-white bg-slate-700 border-b-2 border-slate-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-8">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileInput} />

              <div className="flex flex-col items-center gap-2 mb-4">
                <img
                  onClick={() => fileRef.current.click()}
                  src={file ? URL.createObjectURL(file) : getImageUrl(currentUser?.avatar)}
                  alt="profile"
                  className="h-24 w-24 rounded-full object-cover cursor-pointer border-4 border-slate-300 hover:border-slate-500 transition"
                />
                <span className="text-xs text-slate-500">Click to change avatar</span>
              </div>

              {fileError && <p className="text-red-600 text-sm text-center">Image must be less than 2MB</p>}
              {file && !fileError && <p className="text-green-600 text-sm text-center">Image ready to upload</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <input
                type="tel"
                id="phone"
                placeholder="Phone (e.g., 919876543210)"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {updateSuccess && <p className="text-green-600 text-sm">Profile updated successfully!</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-slate-700 text-white p-2 rounded-lg font-semibold hover:bg-slate-900 transition disabled:opacity-60"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                id="password"
                placeholder="New Password (leave blank to keep current)"
                value={formData.password}
                onChange={handleChange}
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {updateSuccess && <p className="text-green-600 text-sm">Password updated!</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-slate-700 text-white p-2 rounded-lg font-semibold hover:bg-slate-900 transition disabled:opacity-60"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* LISTINGS TAB */}
          {activeTab === 'listings' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Your Properties</h3>
                <Link
                  to="/create-listing"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  + Create New Listing
                </Link>
              </div>

              {showListingsError && <p className="text-red-600">Error loading listings</p>}
              
              {userListings.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed">
                  <p className="text-slate-500">No listings yet. Click the button above to create one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {userListings.map((listing) => (
                    <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center hover:shadow-lg transition">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{listing.name}</h3>
                        <p className="text-sm text-slate-500">{listing.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/update-listing/${listing._id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleListingDelete(listing._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-4">
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="bg-yellow-600 text-white p-3 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-60"
              >
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>

              <button
                onClick={handleDeleteUser}
                disabled={loading}
                className="bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
