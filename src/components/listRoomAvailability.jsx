import React, { useEffect, useState } from "react";
import axiosInstance from "../api/interceptors";
import { useNavigate } from "react-router-dom";

const ListRoomAvailability = () => {
  const navigate = useNavigate();
  const [availabilityList, setAvailabilityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalCount, setTotalCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterRoomType, setFilterRoomType] = useState("");
  const [filterError, setFilterError] = useState("");

  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(
        `/admin/listroomsavailable?page=${currentPage}&limit=${itemsPerPage}`
      )
      .then((res) => {
        setAvailabilityList(res.data);
        setTotalCount(res.totalCount);
      })
      .catch((err) => {
        console.error("Failed to fetch room availability:", err);
        setAvailabilityList([]);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    axiosInstance
      .get("/rooms")
      .then((data) => setRoomTypes(data.data)) // data already contains response body
      .catch((err) => console.error("Failed to fetch room types:", err));
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit clicked for ID:", id);
    navigate(`/edit-room-availability/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id); // Set the room ID to be deleted
    setShowModal(true); // Show the confirmation modal
  };

  const confirmDelete = () => {
    setDeleting(true);
    axiosInstance
      .delete(`/admin/deleteroomavailability/${deleteId}`)
      .then((res) => {
        console.log("Room deleted:", res.data);
        setShowModal(false);
        setDeleteId(null);

        // Refresh the list by refetching data
        setLoading(true);
        axiosInstance
          .get(
            `/admin/listroomsavailable?page=${currentPage}&limit=${itemsPerPage}`
          )
          .then((res) => {
            setAvailabilityList(res.data);
            setTotalCount(res.totalCount);

            // If no rooms are left on the current page, go to the previous page
            if (res.data.length === 0 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          })
          .catch((err) => {
            console.error("Failed to fetch room availability:", err);
            setAvailabilityList([]);
          })
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        console.error("Error deleting room availability:", err);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const cancelDelete = () => {
    setShowModal(false); // Close modal without deleting
  };

  const applyFilters = () => {
    const queryParams = [];

    if (filterDate) queryParams.push(`date=${filterDate}`);
    if (filterRoomType) queryParams.push(`roomType=${filterRoomType}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

    setLoading(true);
    setFilterError("");
    axiosInstance
      .get(`/admin/filterroomavailability${queryString}`)
      .then((res) => {
        console.log("res-filter", res);
        setAvailabilityList(res);
        setTotalCount(res.length);
        setCurrentPage(1);
        setShowFilterModal(false);
      })
      .catch((err) => {
        console.error("Failed to filter data:", err);
        if (err.response && err.response.data && err.response.data.error) {
          setFilterError(err.response.data.error);
        } else {
          setFilterError("Something went wrong.Please try again.");
        }
        setAvailabilityList([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Room Availability</h1>
      {/* Filter Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowFilterModal(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : availabilityList.length === 0 ? (
        <p className="text-center">No data available.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Room Type</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Available Rooms</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {availabilityList.map((item) => (
                <tr key={item._id} className="text-center">
                  <td className="border px-4 py-2">{item.roomType}</td>
                  <td className="border px-4 py-2">
                    {new Date(item.date)
                      .toLocaleDateString("en-GB")
                      .replaceAll("/", "-")}
                  </td>
                  <td className="border px-4 py-2">{item.availableRooms}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {/* Confirmation Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-gray-200 transform scale-100 opacity-100 transition duration-300 ease-out">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                  Are you sure?
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  Do you really want to delete this room availability? This
                  action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={cancelDelete}
                    className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className={`${
                      deleting
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white px-5 py-2 rounded-lg shadow-sm transition duration-200`}
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter Modal */}
          {showFilterModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Filter Rooms
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm">Select Date:</label>
                    <input
                      type="date"
                      className="w-full border px-3 py-2 rounded"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">
                      Select Room Type:
                    </label>
                    <select
                      className="w-full border px-3 py-2 rounded"
                      value={filterRoomType}
                      onChange={(e) => setFilterRoomType(e.target.value)}
                    >
                      <option value="All Types">All Types</option>
                      {roomTypes.map((room) => (
                        <option key={room._id} value={room.roomType}>
                          {room.roomType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={applyFilters}
                    disabled={!filterDate}
                    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                      !filterDate ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListRoomAvailability;
