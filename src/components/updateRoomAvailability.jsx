import React, { useEffect, useState } from "react";
import axiosInstance from "../api/interceptors";

function RoomAvailabilityForm() {
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    roomType: "",
    date: "",
    availableRooms: "",
  });

  const [isExisting, setIsExisting] = useState(false); // tracks if availability already exists
  const [maxLimit, setMaxLimit] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/rooms")
      .then((data) => setRoomTypes(data.data)) // data already contains response body
      .catch((err) => console.error("Failed to fetch room types:", err));
  }, []);

  useEffect(() => {
    const { roomType, date } = formData;

    const selectedRoom = roomTypes.find((r) => r.roomType === roomType);
    setMaxLimit(selectedRoom?.maxRoomsAvailable || null);

    if (roomType && date) {
      setLoadingAvailability(true);
      axiosInstance
        .get(`admin/checkroomsavailability?roomType=${roomType}&date=${date}`)
        .then((res) => {
          console.log("response", res);
          const available = res?.availableRooms;
          if (available !== undefined) {
            setIsExisting(true);
            setFormData((prev) => ({ ...prev, availableRooms: available }));
          } else {
            setIsExisting(false);
            setFormData((prev) => ({ ...prev, availableRooms: "" }));
          }
        })
        .catch((err) => {
          console.error("failed to fetch availability:", err);
          setIsExisting(false);
          setFormData((prev) => ({ ...prev, availableRooms: "" }));
        })
        .finally(() => setLoadingAvailability(false));
    }
  }, [formData.roomType, formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const roomsEntered = parseInt(formData.availableRooms);
    if (maxLimit !== null && roomsEntered > maxLimit) {
      alert(
        `You can't set the availability beyond the maximum of ${maxLimit} rooms.`
      );
      return;
    }
    axiosInstance
      .put("/admin/updateroomsavailability", formData)
      .then(() => {
        alert("Room availability added!");
        setFormData({ roomType: "", date: "", availableRooms: "" });
      })
      .catch((err) => {
        console.error("Submission failed:", err);
        alert("Something went wrong.");
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Add Room Availability
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Room Type</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select a room type</option>
            {roomTypes.map((room) => (
              <option key={room._id} value={room.roomType}>
                {room.roomType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Available Rooms
            {maxLimit && (
              <span className="text-sm text-gray-500 ml-2">
                (Max:{maxLimit})
              </span>
            )}
          </label>
          <input
            type="number"
            name="availableRooms"
            value={loadingAvailability ? "" : formData.availableRooms}
            placeholder={loadingAvailability ? "Loading..." : ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            max={maxLimit || undefined}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={
            !formData.roomType ||
            !formData.date ||
            formData.availableRooms === ""
          }
        >
          {isExisting ? "Update Availability" : "Add Availability"}
        </button>
      </form>
    </div>
  );
}

export default RoomAvailabilityForm;
