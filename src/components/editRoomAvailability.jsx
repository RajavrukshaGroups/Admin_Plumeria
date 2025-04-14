import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/interceptors";
import toast from "react-hot-toast";

function EditRoomAvailabilityForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    roomType: "",
    date: "",
    availableRooms: "",
  });

  const [maxAvailable, setMaxAvailable] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all room types
  useEffect(() => {
    axiosInstance
      .get("/rooms")
      .then((res) => {
        setRoomTypes(res.data.data || res.data); // Handles both your provided JSON and fallback
      })
      .catch((err) => console.error("Failed to fetch room types", err));
  }, []);

  // Fetch data for editing
  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/admin/editroomsinfo/${id}`)
        .then((res) => {
          const data = res.data;
          setFormData({
            roomType: data.roomType,
            date: new Date(data.date).toISOString().split("T")[0],
            availableRooms: data.availableRooms,
          });

          // Set maxAvailable based on roomType info
          const roomTypeInfo = res.data.roomType;
          const matched = (resRoomTypes) => {
            return resRoomTypes.find((r) => r.roomType === data.roomType);
          };

          setTimeout(() => {
            setMaxAvailable(matched(roomTypes)?.maxRoomsAvailable ?? null);
          }, 0);
        })
        .catch((err) => {
          console.error("Failed to fetch room availability", err);
          toast.error("Could not load availability data");
        })
        .finally(() => setLoading(false));
    }
  }, [id, roomTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "availableRooms") {
      if (maxAvailable !== null && +value > maxAvailable) {
        toast.error(`Cannot exceed maximum of ${maxAvailable} rooms`);
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put("/admin/updateroomsavailability", formData);
      toast.success("Room availability updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Edit Room Availability
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="roomType" className="block mb-1 font-medium">
            Room Type
          </label>
          <input
            id="roomType"
            name="roomType"
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            value={formData.roomType}
            disabled
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-1 font-medium">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            value={formData.date}
            disabled
          />
        </div>

        <div>
          <label htmlFor="availableRooms" className="block mb-1 font-medium">
            Available Rooms
          </label>
          <input
            id="availableRooms"
            name="availableRooms"
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={formData.availableRooms}
            onChange={handleChange}
            required
            min={0}
            max={maxAvailable ?? undefined}
          />
          {maxAvailable !== null && (
            <p className="text-sm text-gray-500 mt-1">
              Max allowed: {maxAvailable} rooms
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default EditRoomAvailabilityForm;
