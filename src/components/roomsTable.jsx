
import React, { useEffect, useState } from 'react';
import axiosInstance from ".././api/interceptors";

const RoomsTable = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/admin/roomsdata');
        console.log(response, 'Fetched rooms data');
        setRooms(response || []); // Ensure rooms is always an array
      } catch (error) {
        console.error('Error fetching rooms data:', error);
      }
    };
    fetchRooms();
  }, []);

  return (
    

<div classNames="p-20 relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                Room Type
                </th>
                <th scope="col" className="px-6 py-3">
                Max Rooms
                </th>
                <th scope="col" className="px-6 py-3">
                Capacity
                </th>
                <th scope="col" className="px-6 py-3">
                Check In
                </th>
                <th scope="col" className="px-6 py-3">
                Check Out
                </th>
                <th scope="col" className="px-6 py-3">
                Plans
                </th>
            </tr>
        </thead>
        <tbody>
  {rooms.map((room, i) => (
    <tr
      key={i}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {room.roomType}
      </th>
      <td className="px-6 py-4">{room.maxRoomsAvailable}</td>
      {/* <td className="px-6 py-4">{room.capacity}</td> */}
      <td className="px-6 py-4">
  {room.capacity
    ? `Adults: ${room.capacity.maxAdults}, Children: ${room.capacity.maxChildren}, Total: ${room.capacity.maxPersons}`
    : "N/A"}
</td>

      <td className="px-6 py-4">{room.checkIn}</td>
      <td className="px-6 py-4">{room.checkOut}</td>
      <td className="px-6 py-4">
        {Array.isArray(room.plans) && room.plans.length > 0 ? (
          room.plans.map((plan, j) => (
            <div
              key={j}
              className="mb-3 p-2 rounded bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
            >
               <p className="font-semibold">{plan.name}</p>
        <p>2 Guests (With GST): ₹{plan.price?.twoGuests?.withGst ?? "N/A"}</p>
        <p>2 Guests (Without GST): ₹{plan.price?.twoGuests?.withoutGst ?? "N/A"}</p>
        <p>Extra Adult (With GST): ₹{plan.price?.extraAdult?.withGst ?? "N/A"}</p>
        <p>Extra Adult (Without GST): ₹{plan.price?.extraAdult?.withoutGst ?? "N/A"}</p>
        <p>
          <strong>Complimentary:</strong>{" "}
          {plan.complimentary?.length > 0 ? plan.complimentary.join(", ") : "N/A"}
        </p>
              {/* <p>
                <strong>Services:</strong>{" "}
                {plan.services
                  ? Object.entries(plan.services)
                      .filter(([_, value]) => value)
                      .map(([key]) => key)
                      .join(", ")
                  : "N/A"}
              </p> */}
              
            </div>
          ))
        ) : (
          <span className="text-gray-500">No plans</span>
        )}
      </td>
    </tr>
  ))}
</tbody>

    </table>
</div>

  );
};

export default RoomsTable;
