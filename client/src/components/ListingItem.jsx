import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  


  return (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden w-full sm:w-[330px] group">
    <Link to={`/listing/${listing._id}`}>

      {/* IMAGE */}
      <div className="relative h-[230px] overflow-hidden">
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg'
          }
          alt="listing cover"
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* TYPE BADGE */}
        <span className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
        </span>

        {/* OFFER BADGE */}
        {listing.offer && (
          <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Offer
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3">

        {/* TITLE */}
        <h3 className="text-lg font-bold text-slate-800 truncate">
          {listing.name}
        </h3>

        {/* LOCATION */}
        <div className="flex items-center gap-1 text-slate-500 text-sm">
          <MdLocationOn className="text-emerald-600 text-base" />
          <span className="truncate">{listing.address}</span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-slate-600 line-clamp-2">
          {listing.description}
        </p>

        {/* PRICE */}
        <div className="mt-1">
          <p className="text-xl font-extrabold text-slate-900">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && (
              <span className="text-sm font-medium text-slate-500">
                {' '} / month
              </span>
            )}
          </p>
        </div>

        {/* FEATURES */}
        <div className="flex gap-6 text-xs font-semibold text-slate-600">
          <span>
            {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
          </span>
          <span>
            {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
          </span>
        </div>
      </div>
    </Link>
  </div>
);

}
