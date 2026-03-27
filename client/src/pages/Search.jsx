import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };


  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col md:flex-row">

    {/* SIDEBAR */}
    <aside className="md:w-80 w-full bg-slate-900 text-slate-100 p-6 md:min-h-screen shadow-xl">
      <h2 className="text-xl font-bold mb-6 tracking-wide">
        Search Filters
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* SEARCH TERM */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            placeholder="City, address, keyword..."
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={sidebardata.searchTerm}
            onChange={handleChange}
          />
        </div>

        {/* TYPE */}
        <div>
          <p className="text-sm font-semibold mb-2">Type</p>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { id: 'all', label: 'Rent & Sale' },
              { id: 'rent', label: 'Rent' },
              { id: 'sale', label: 'Sale' },
              { id: 'offer', label: 'Offers only' },
            ].map((item) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id={item.id}
                  onChange={handleChange}
                  checked={sidebardata[item.id] || sidebardata.type === item.id}
                  className="accent-slate-400 w-4 h-4"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* AMENITIES */}
        <div>
          <p className="text-sm font-semibold mb-2">Amenities</p>
          <div className="flex flex-col gap-2 text-sm">
            {['parking', 'furnished'].map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id={amenity}
                  onChange={handleChange}
                  checked={sidebardata[amenity]}
                  className="accent-slate-400 w-4 h-4"
                />
                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* SORT */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Sort By
          </label>
          <select
            onChange={handleChange}
            defaultValue={'created_at_desc'}
            id="sort_order"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="regularPrice_desc">Price: High → Low</option>
            <option value="regularPrice_asc">Price: Low → High</option>
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>

        {/* BUTTON */}
        <button className="mt-4 bg-slate-200 text-slate-900 font-semibold py-3 rounded-lg hover:bg-white transition">
          Apply Filters
        </button>

      </form>
    </aside>

    {/* RESULTS */}
    <main className="flex-1 p-6">

      <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-3">
        Listing Results
      </h1>

      {/* STATES */}
      {loading && (
        <p className="text-lg text-slate-600 text-center w-full">
          Loading listings...
        </p>
      )}

      {!loading && listings.length === 0 && (
        <p className="text-lg text-slate-600">
          No listings found.
        </p>
      )}

      {/* LISTINGS */}
      <div className="flex flex-wrap gap-6">
        {!loading &&
          listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
      </div>

      {/* SHOW MORE */}
      {showMore && (
        <div className="mt-10 text-center">
          <button
            onClick={onShowMoreClick}
            className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition"
          >
            Load More
          </button>
        </div>
      )}

    </main>
  </div>
);

}
