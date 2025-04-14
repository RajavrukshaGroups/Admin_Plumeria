// // /admin/components/RoomList.jsx
import React from 'react';

const RoomList = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">All Rooms</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Room Type</th>
            <th className="border px-2 py-1">Check In</th>
            <th className="border px-2 py-1">Check Out</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room._id}>
              <td className="border px-2 py-1">{room.roomType}</td>
              <td className="border px-2 py-1">{room.checkIn}</td>
              <td className="border px-2 py-1">{room.checkOut}</td>
              <td className="border px-2 py-1">
                <button onClick={() => onEdit(room)} className="mr-2 text-blue-500">Edit</button>
                <button onClick={() => onDelete(room._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
