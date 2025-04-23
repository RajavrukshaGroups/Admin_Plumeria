import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import axiosInstance from "../api/interceptors";
import { useNavigate } from "react-router-dom";

const ViewBookingDetails = () => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchBookings = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/viewallbookings", {
        params: { page: pageNum, limit: 6 },
      });
      setBookingDetails(res.data);
      setTotalPages(res.totalPages);
      setPage(res.currentPage);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        View Booking Details
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookingDetails.map((booking) => (
            <div
              key={booking._id}
              className="relative bg-white shadow-lg rounded-xl p-4 border border-gray-200"
            >
              <button
                onClick={() => navigate(`/editBookingDetails/${booking._id}`)}
                className="absolute top-2 right-2 text-gray-500 hover:text-yellow-600"
                title="Edit Booking"
              >
                <FiEdit size={20} />
              </button>
              <div className="mb-2">
                <h2 className="text-xl font-semibold">
                  {booking.customerName}
                </h2>
                <p className="text-sm text-gray-500">{booking.bookingId}</p>
                <p className="text-sm text-gray-500">({booking.domainName})</p>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <strong>Check-In:</strong> {booking.checkInDate}
                </p>
                <p>
                  <strong>Check-Out:</strong> {booking.checkOutDate}
                </p>
                <p>
                  <strong>Total Rooms:</strong> {booking.totalRooms}
                </p>
                <p>
                  <strong>Room Types:</strong> {booking.roomTypes.join(", ")}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600 font-medium">
                    {booking.bookingStatus}
                  </span>
                </p>
                <p>
                  <strong>Total Cost:</strong> ₹{booking.totalCost}
                </p>
              </div>

              <div className="mt-2 text-sm">
                <p>
                  <strong>Email:</strong> {booking.contactInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {booking.contactInfo.phone}
                </p>
              </div>

              <div className="mt-2 text-sm">
                <p>
                  <strong>Payment:</strong> {booking.payment.method}
                </p>
                <p>
                  <strong>Paid:</strong> ₹{booking.payment.amountPaid}
                </p>
                <p>
                  <strong>Due:</strong> ₹{booking.payment.balanceDue}
                </p>
              </div>

              <div className="mt-2 text-sm">
                <p>
                  <strong>Guests:</strong>
                </p>
                <ul className="pl-4 list-disc">
                  {booking.totalGuests.map((guest) => (
                    <li key={guest._id}>
                      {guest.roomType} – {guest.persons} persons, {guest.adult}{" "}
                      adults, {guest.children} children, Plan: {guest.planName}
                    </li>
                  ))}
                </ul>
              </div>

              {booking.specialRequests?.length > 0 && (
                <div className="mt-2 text-sm">
                  <p>
                    <strong>Special Requests:</strong>{" "}
                    {booking.specialRequests.join(", ")}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <a
                  href={booking.invoicePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
                >
                  View Invoice
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewBookingDetails;
