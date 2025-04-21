import { useEffect, useState } from "react";
import {
  addRoomType,
  getAllRoomTypes,
  updateRoomType,
  deleteRoomType,
} from "../api/auth"; // adjust path if needed

import { Pencil, Trash2, Check, X } from "lucide-react"; 

const AddRoomTypeForm = () => {
  const [roomTypeName, setRoomTypeName] = useState("");
  const [message, setMessage] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const fetchRoomTypes = async () => {
    try {
      const data = await getAllRoomTypes();
      setRoomTypes(data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleAddRoomType = async (e) => {
    e.preventDefault();
    try {
      const response = await addRoomType(roomTypeName);
      setMessage(`Room type "${response.name}" added successfully!`);
      setRoomTypeName("");
      await fetchRoomTypes(); 
    } catch (error) {
      console.error(error);
      setMessage("Error adding room type. It may already exist.");
    }
  };

  // Delete room type
  const handleDelete = async (id) => {
    try {
      await deleteRoomType(id);
      setRoomTypes(roomTypes.filter((type) => type._id !== id));
    } catch (error) {
      console.error("Error deleting room type:", error);
    }
  };

  // Update room type
  const handleUpdate = async (id) => {
    try {
      const updated = await updateRoomType(id, editedName);
      setRoomTypes(
        roomTypes.map((type) =>
          type._id === id ? { ...type, name: updated.name } : type
        )
      );
      setEditingId(null);
      setEditedName("");
    } catch (error) {
      console.error("Error updating room type:", error);
    }
  };

  return (

    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8">
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Add New Room Type</h2>

    <form onSubmit={handleAddRoomType} className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <input
        type="text"
        value={roomTypeName}
        onChange={(e) => setRoomTypeName(e.target.value)}
        placeholder="Enter room type name"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
      >
        Add
      </button>
    </form>

    {message && (
      <div className="mb-4 text-sm font-medium px-4 py-2 rounded-md bg-green-100 text-green-700 border border-green-300">
        {message}
      </div>
    )}

    <h3 className="text-lg font-semibold mb-2 text-gray-800">All Room Types</h3>

    <ul className="space-y-3">
      {roomTypes.map((type) => (
        <li
          key={type._id}
          className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg shadow-sm transition duration-200"
        >
          {editingId === type._id ? (
            <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2">
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 border border-gray-300 px-3 py-2 rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(type._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditedName("");
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
              <span className="text-gray-700 font-medium">{type.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(type._id);
                    setEditedName(type.name);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(type._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>

    // <div className="max-w-md mx-auto mt-6 bg-white shadow-md rounded-lg p-6">
    //   <h2 className="text-xl font-semibold mb-4">Add New Room Type</h2>
    //   <form onSubmit={handleAddRoomType}>
    //     <input
    //       type="text"
    //       value={roomTypeName}
    //       onChange={(e) => setRoomTypeName(e.target.value)}
    //       placeholder="Enter room type name"
    //       className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
    //       required
    //     />
    //     <button
    //       type="submit"
    //       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    //     >
    //       Add Room Type
    //     </button>
    //   </form>

    //   {message && (
    //     <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
    //   )}

    //   <h3 className="text-lg font-semibold mt-6">All Room Types</h3>
    //   <ul className="mt-2 space-y-2">
    //     {roomTypes.map((type) => (
    //       <li
    //         key={type._id}
    //         className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
    //       >
    //         {editingId === type._id ? (
    //           <>
    //             <input
    //               value={editedName}
    //               onChange={(e) => setEditedName(e.target.value)}
    //               className="border px-2 py-1 rounded w-full mr-2"
    //             />
    //             <button
    //               onClick={() => handleUpdate(type._id)}
    //               className="bg-green-500 text-white px-2 py-1 rounded mr-1"
    //             >
    //               Save
    //             </button>
    //             <button
    //               onClick={() => {
    //                 setEditingId(null);
    //                 setEditedName("");
    //               }}
    //               className="bg-gray-400 text-white px-2 py-1 rounded"
    //             >
    //               Cancel
    //             </button>
    //           </>
    //         ) : (
    //           <>
    //             <span>{type.name}</span>
    //             <div className="flex space-x-2">
    //               <button
    //                 onClick={() => {
    //                   setEditingId(type._id);
    //                   setEditedName(type.name);
    //                 }}
    //                 className="bg-yellow-500 text-white px-2 py-1 rounded"
    //               >
    //                 Edit
    //               </button>
    //               <button
    //                 onClick={() => handleDelete(type._id)}
    //                 className="bg-red-600 text-white px-2 py-1 rounded"
    //               >
    //                 Delete
    //               </button>
    //             </div>
    //           </>
    //         )}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default AddRoomTypeForm;
