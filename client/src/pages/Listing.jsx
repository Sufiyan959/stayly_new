import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);



  return (
  <main className="bg-slate-100 min-h-screen">
    {loading && (
      <p className="text-center py-20 text-2xl font-semibold text-slate-700">
        Loading property...
      </p>
    )}

    {error && (
      <p className="text-center py-20 text-2xl font-semibold text-red-600">
        Something went wrong!
      </p>
    )}

    {listing && !loading && !error && (
      <>
        {/* IMAGE SLIDER */}
        <Swiper navigation className="relative">
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[65vh] w-full"
                style={{
                  background: `url(${
                    url.startsWith('http')
                      ? url
                      : `http://localhost:3000${url}`
                  }) center / cover no-repeat`,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* SHARE BUTTON */}
        <div className="fixed top-24 right-6 z-20">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="bg-white/90 backdrop-blur-md border shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:scale-105 transition"
          >
            <FaShare className="text-slate-700" />
          </button>

          {copied && (
            <p className="mt-2 bg-white rounded-md px-3 py-1 text-sm shadow">
              Link copied!
            </p>
          )}
        </div>

        {/* DETAILS CARD */}
        <section className="max-w-5xl mx-auto -mt-20 relative z-10 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">

            {/* TITLE & PRICE */}
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">
                {listing.name}
              </h1>
              <p className="text-2xl font-semibold text-emerald-600 mt-2">
                $
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </p>
            </div>

            {/* ADDRESS */}
            <p className="flex items-center gap-2 text-slate-500 text-sm">
              <FaMapMarkerAlt className="text-emerald-600" />
              {listing.address}
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-1 rounded-full text-sm font-semibold bg-slate-900 text-white">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>

              {listing.offer && (
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-emerald-600 text-white">
                  $
                  {+listing.regularPrice -
                    +listing.discountPrice}{' '}
                  OFF
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">
                Description:{" "}
              </span>
              {listing.description}
            </p>

            {/* FEATURES */}
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <FaBed />
                {listing.bedrooms} Beds
              </li>
              <li className="flex items-center gap-2">
                <FaBath />
                {listing.bathrooms} Baths
              </li>
              <li className="flex items-center gap-2">
                <FaParking />
                {listing.parking ? 'Parking' : 'No Parking'}
              </li>
              <li className="flex items-center gap-2">
                <FaChair />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {/* CONTACT */}
            {currentUser && listing.userRef === currentUser._id && (
              <p className="mt-4 text-slate-500 italic text-center">
                This is your listing
              </p>
            )}
            {currentUser &&
              listing.userRef !== currentUser._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl uppercase font-semibold hover:bg-slate-800 transition"
                >
                  Contact Landlord
                </button>
              )}
            {!currentUser && (
              <p className="mt-4 text-slate-500 italic text-center">
                <a href="/sign-in" className="text-slate-900 underline">Sign in</a> to contact the landlord
              </p>
            )}

            {contact && <Contact listing={listing} />}
          </div>
        </section>
      </>
    )}
  </main>
);

}
