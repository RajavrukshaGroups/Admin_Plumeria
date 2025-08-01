import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/interceptors";
import { FaInfoCircle } from "react-icons/fa";

const BookingListByDate = () => {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const checkInDate = searchParams.get("checkInDate");

  console.log("booking details", bookings);

  useEffect(() => {
    if (!checkInDate) return;

    axiosInstance
      .get(`/admin/bookings/by-checkin-date?checkInDate=${checkInDate}`)
      .then((res) => {
        if (res.success) {
          setBookings(res.data);
        } else {
          setBookings([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [checkInDate]);

  const handleShowGuestDetails = (booking) => {
    setSelectedBooking(booking);
    setShowGuestDetails(true);
  };

  const handleViewInvoice = (bookingId) => {
    // const url = `http://localhost:3000/rooms/receipt/${bookingId}`;
    const url = `https://server.plumeriaresort.in/rooms/receipt/${bookingId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
        Bookings for <span className="text-yellow-600">{checkInDate}</span>
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-red-500">
          No bookings found for this date.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="px-2 py-2 text-left whitespace-nowrap">
                    Booking ID
                  </th>
                  <th className="px-2 py-2 text-left whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-2 py-2 text-left whitespace-nowrap">
                    Rooms
                  </th>
                  <th className="px-2 py-2 text-center whitespace-nowrap">
                    Guests
                  </th>
                  <th className="px-2 py-2 text-right whitespace-nowrap">
                    Total
                  </th>
                  <th className="px-2 py-2 text-right whitespace-nowrap">
                    Paid
                  </th>
                  <th className="px-2 py-2 text-right whitespace-nowrap">
                    Due
                  </th>
                  <th className="px-2 py-2 text-left whitespace-nowrap">
                    Payment
                  </th>
                  <th className="px-2 py-2 text-left whitespace-nowrap">
                    Domain
                  </th>
                  <th className="px-2 py-2 text-center whitespace-nowrap">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {bookings.map((b) => {
                  const guestCount = b.totalGuests.reduce(
                    (sum, g) => sum + g.persons + g.adult + g.children,
                    0
                  );

                  return (
                    <tr key={b._id} className="hover:bg-yellow-50">
                      <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {b.bookingId}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {b.customerName}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {b.roomTypes?.join(", ") || "-"}
                      </td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <span>{guestCount}</span>
                          <button
                            onClick={() => handleShowGuestDetails(b)}
                            className="ml-1 text-blue-600 focus:outline-none"
                          >
                            <FaInfoCircle className="inline-block" />
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap font-medium text-green-600">
                        ₹{b.totalCost}
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap font-medium text-green-600">
                        ₹{b.payment?.amountPaid}
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap font-medium text-green-600">
                        ₹{b.payment?.balanceDue}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {b.payment?.method || "N/A"}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {b.domainName || "-"}
                      </td>
                      {/* <td className="px-2 py-2 text-center whitespace-nowrap">
                        {b.invoicePdfUrl ? (
                          <a
                            href={b.invoicePdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs font-semibold"
                          >
                            PDF
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">-</span>
                        )}
                      </td> */}
                      <td className="px-2 py-2 text-center whitespace-nowrap">
                        <button
                          className="inline-block px-4 py-2 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
                          onClick={() => handleViewInvoice(b.bookingId)}
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guest Details Modal */}
      {showGuestDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-yellow-700">
                  Guest Details for Booking #{selectedBooking.bookingId}
                </h3>
                <button
                  onClick={() => setShowGuestDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {selectedBooking.totalGuests.map((guest, index) => (
                  <div
                    key={guest._id || index}
                    className="border border-gray-200 rounded-lg p-3 bg-yellow-50"
                  >
                    <div className="font-semibold text-gray-800">
                      🛏 {guest.roomType} —{" "}
                      <span className="italic text-yellow-700">
                        Plan: {guest.planName}
                      </span>
                    </div>
                    <ul className="mt-2 pl-4 text-gray-700 list-disc text-sm">
                      <li>Persons: {guest.persons}</li>
                      <li>Adults: {guest.adult}</li>
                      <li>Children: {guest.children}</li>
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowGuestDetails(false)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingListByDate;
