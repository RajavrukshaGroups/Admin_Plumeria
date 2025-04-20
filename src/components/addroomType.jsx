import { useState } from "react";
// import axios from "axios";
import axiosInstance from "../api/interceptors";

const AddRoomTypeForm = () => {

  const [roomTypeName, setRoomTypeName] = useState("");
  const [message, setMessage] = useState("");

  const handleAddRoomType = async(e) => {
    e.preventDefault();
    try {
        const response = await axiosInstance.post("/admin/addRoomtype", {
        name: roomTypeName,
      });
      setMessage(`Room type "${response.data.name}" added successfully!`);
      setRoomTypeName("");
    } catch (error) {
      setMessage("Error adding room type. It may already exist.");
    }
  };

  return (
    <form
      onSubmit={handleAddRoomType}
      className="max-w-md mx-auto mt-6 bg-white shadow-md rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Room Type</h2>

      <input
        type="text"
        value={roomTypeName}
        onChange={(e) => setRoomTypeName(e.target.value)}
        placeholder="Enter room type name"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Room Type
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </form>
  );
};

export default AddRoomTypeForm;
