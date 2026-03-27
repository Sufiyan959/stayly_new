import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log("offerListings:", offerListings);
  console.log("rentListings:", rentListings);
  console.log("saleListings:", saleListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        console.log("Fetched offers:", data);
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        console.log("Fetched rent listings:", data);
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        console.log("Fetched sale listings:", data);
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="bg-slate-50">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-indigo-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-28 flex flex-col gap-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight">
            Stop searching.{" "}
            <span className="text-indigo-600">Start living.</span>
          </h1>

          <p className="text-slate-500 max-w-2xl text-sm sm:text-base">
            Stayly helps you discover homes that match your lifestyle. Explore
            verified listings for rent and sale with confidence.
          </p>

          <Link
            to="/search"
            className="w-fit bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* SWIPER / FEATURED OFFERS */}
      {offerListings && offerListings.length > 0 && (
        <section className="max-w-6xl mx-auto mt-16 px-4">
          <Swiper navigation className="rounded-2xl overflow-hidden shadow-lg">
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  className="h-[420px] sm:h-[500px]"
                  style={{
                    background: `url(${listing.imageUrls[0]}) center / cover no-repeat`,
                  }}
                >
                  <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h3 className="text-white text-xl font-semibold">
                      {listing.name}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* LISTINGS SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-14">
        {/* OFFERS */}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-slate-700">
                Recent Offers
              </h2>
              <Link
                to="/search?offer=true"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* RENT */}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-slate-700">
                Places for Rent
              </h2>
              <Link
                to="/search?type=rent"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* SALE */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-slate-700">
                Places for Sale
              </h2>
              <Link
                to="/search?type=sale"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );

}
