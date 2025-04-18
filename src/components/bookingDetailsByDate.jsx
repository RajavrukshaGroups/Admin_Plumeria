import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/interceptors";

const BookingListByDate = () => {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const checkInDate = searchParams.get("checkInDate");

  useEffect(() => {
    if (!checkInDate) return;

    axiosInstance
      .get(`/admin/bookings/by-checkin-date?checkInDate=${checkInDate}`)
      .then((res) => {
        console.log("response-data", res.data);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        Bookings for <span className="text-yellow-600">{checkInDate}</span>
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-red-500 text-lg">
          No bookings found for this date.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-yellow-100 text-gray-800 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Booking ID</th>
                <th className="px-4 py-3 text-left">Customer Name</th>
                <th className="px-4 py-3 text-left">Room Types</th>
                <th className="px-4 py-3 text-center">Total Guests</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
                <th className="px-4 py-3 text-left">Payment Method</th>
                <th className="px-4 py-3 text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bookings.map((b) => {
                const guestCount = b.totalGuests.reduce(
                  (sum, g) => sum + g.persons + g.adult + g.children,
                  0
                );

                return (
                  <tr key={b._id} className="hover:bg-yellow-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {b.bookingId}
                    </td>
                    <td className="px-4 py-3">{b.customerName}</td>
                    <td className="px-4 py-3">
                      {b.roomTypes?.join(", ") || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">{guestCount}</td>
                    <td className="px-4 py-3 text-center font-semibold text-green-600">
                      ₹{b.totalCost}
                    </td>
                    <td className="px-4 py-3">{b.payment?.method || "N/A"}</td>
                    <td className="px-4 py-3 text-center">
                      {b.invoicePdfUrl ? (
                        <a
                          href={b.invoicePdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs font-semibold"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          Not available
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingListByDate;
