import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaWhatsapp } from 'react-icons/fa';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleWhatsAppContact = () => {
    if (!landlord || !landlord.phone) {
      alert('Owner has not provided phone number');
      return;
    }

    // Get buyer name
    const buyerName = currentUser?.username || 'Interested Buyer';

    // Create message
    const message = `Hi ${landlord.username},\n\nI'm interested in your property listing:\n\n"${listing.name}"\n\nCould you please provide more details?\n\nRegards,\n${buyerName}`;

    // Encode message
    const encodedMessage = encodeURIComponent(message);

    // Phone format: should be 919876543210 (no + or -)
    const phoneNumber = landlord.phone.replace(/[^\d]/g, '');

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {loading ? (
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
          <p className="text-slate-600">Loading landlord info...</p>
        </div>
      ) : landlord ? (
        <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">

          {/* HEADER */}
          <div className="mb-4">
            <p className="text-lg font-semibold text-slate-800 mb-1">
              Contact{' '}
              <span className="text-slate-900 font-bold">
                {landlord.username}
              </span>
            </p>
            <p className="text-sm text-slate-600">
              Interested in{' '}
              <span className="font-semibold text-slate-800">
                {listing.name.toLowerCase()}
              </span>
              ?
            </p>
          </div>

          {/* PHONE STATUS */}
          {landlord.phone ? (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ Owner available on WhatsApp
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm text-red-700">
                ✗ Owner has not provided phone number
              </p>
            </div>
          )}

          {/* MESSAGE INFO */}
          <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-2">
              MESSAGE PREVIEW:
            </p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              Hi {landlord.username},

I'm interested in your property listing:

"{listing.name}"

Could you please provide more details?

Regards,
{currentUser?.username || 'Interested Buyer'}
            </p>
          </div>

          {/* WHATSAPP BUTTON */}
          <button
            onClick={handleWhatsAppContact}
            disabled={!landlord.phone}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold uppercase hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <FaWhatsapp size={22} />
            <span>Send via WhatsApp</span>
          </button>

        </div>
      ) : (
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
          <p className="text-slate-600">Could not load landlord information</p>
        </div>
      )}
    </>
  );
}
