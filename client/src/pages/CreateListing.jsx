import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const formDataFiles = new FormData();
      
      [...files].forEach((file) => {
        formDataFiles.append('images', file);
      });

      try {
        const res = await fetch('api/listing/upload', {
          method: 'POST',
          credentials: 'include',
          body: formDataFiles,
        });

        const data = await res.json();
        if (data.success === false) {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
          return;
        }

        const imageUrls = data.imageUrls;
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...imageUrls],
        }));
        setImageUploadError(false);
        setUploading(false);
        setFiles([]);
      } catch (error) {
        setImageUploadError('Error uploading images');
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (['number', 'text', 'textarea'].includes(type)) {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');

      setLoading(true);
      setError(false);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Create New Listing</h1>
          <p className="text-slate-300 text-sm mt-1">Add property details to publish</p>
        </div>

        {/* TABS */}
        <div className="bg-slate-50 border-b flex overflow-x-auto">
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'details', label: 'Details' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'images', label: 'Images' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        <form onSubmit={handleSubmit} className="p-8">

          {/* BASIC INFO TAB */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Property Title</label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g., Cozy 2 bedroom apartment"
                  required
                  minLength="10"
                  maxLength="62"
                  onChange={handleChange}
                  value={formData.name}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Address</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Street, City, State, Zip"
                  required
                  onChange={handleChange}
                  value={formData.address}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  id="description"
                  placeholder="Describe the property..."
                  required
                  onChange={handleChange}
                  value={formData.description}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400 h-24 resize-none"
                />
              </div>
            </div>
          )}

          {/* DETAILS TAB */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Property Type</label>
                <div className="flex gap-4">
                  {['rent', 'sale'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        id={type}
                        onChange={handleChange}
                        checked={formData.type === type}
                        className="accent-slate-700"
                      />
                      <span className="capitalize font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    onChange={handleChange}
                    value={formData.bedrooms}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    onChange={handleChange}
                    value={formData.bathrooms}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Amenities</label>
                <div className="grid grid-cols-3 gap-3">
                  {['parking', 'furnished', 'offer'].map(item => (
                    <label key={item} className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-200">
                      <input
                        type="checkbox"
                        id={item}
                        onChange={handleChange}
                        checked={formData[item]}
                        className="accent-slate-700"
                      />
                      <span className="capitalize text-sm font-medium">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Regular Price</label>
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder={formData.type === 'rent' ? '$ / month' : '$'}
                />
              </div>

              {formData.offer && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Discounted Price</label>
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    required
                    onChange={handleChange}
                    value={formData.discountPrice}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Discounted price"
                  />
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                {formData.offer ? '✓ Offer enabled - discount price required' : 'Enable offer to add discounted price'}
              </div>
            </div>
          )}

          {/* IMAGES TAB */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Images (Max 6)</label>
                <p className="text-xs text-slate-500 mb-2">First image will be the cover</p>
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFiles(e.target.files)}
                    className="flex-1 border rounded-lg p-2"
                  />
                  <button
                    type="button"
                    onClick={handleImageSubmit}
                    disabled={uploading}
                    className="bg-emerald-600 text-white px-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>

                {imageUploadError && <p className="text-red-600 text-sm">{imageUploadError}</p>}
              </div>

              {formData.imageUrls.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Uploaded Images ({formData.imageUrls.length}/6)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.imageUrls.map((url, index) => (
                      <div key={url} className="relative group">
                        <img
                          src={url}
                          alt="listing"
                          className="h-32 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="mt-6 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:opacity-60"
            >
              {loading ? 'Creating listing...' : 'Create Listing'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
