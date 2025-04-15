// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import axiosInstance from ".././api/interceptors";
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
    // <div className="container mt-5">
    //   <h2 className="mb-4">🛏️ Room Types & Pricing Plans</h2>
    //   <table className="table table-bordered">
    //     <thead>
    //       <tr>
    //         <th>Room Type</th>
    //         <th>Max Rooms</th>
    //         <th>Capacity</th>
    //         <th>Check In</th>
    //         <th>Check Out</th>
    //         <th>Plans</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {rooms.length > 0 ? (
    //         rooms.map((room, i) => (
    //           <tr key={i}>
    //             <td>{room.roomType || 'N/A'}</td>
    //             <td>{room.maxRoomsAvailable || 'N/A'}</td>
    //             <td>{room.capacity?.maxPersons || 'N/A'}</td>
    //             <td>{room.checkIn || 'N/A'}</td>
    //             <td>{room.checkOut || 'N/A'}</td>
    //             <td>
    //               {Array.isArray(room.plans) && room.plans.length > 0 ? (
    //                 room.plans.map((plan, j) => (
    //                   <div key={j} className="mb-3 p-2 border rounded bg-light">
    //                     <strong>{plan.name || 'Unnamed Plan'}</strong><br />
    //                     2 Guests (With GST): ₹{plan.twoGuestsWithGST || 'N/A'}<br />
    //                     2 Guests (Without GST): ₹{plan.twoGuestsWithoutGST || 'N/A'}<br />
    //                     Extra Adult (With GST): ₹{plan.extraAdultWithGST || 'N/A'}<br />
    //                     Extra Adult (Without GST): ₹{plan.extraAdultWithoutGST || 'N/A'}<br />
    //                     <strong>Complimentary:</strong> {Array.isArray(plan.complimentary) ? plan.complimentary.join(', ') : 'None'}<br />
    //                     <strong>Services:</strong> {plan.services ? Object.entries(plan.services).filter(([k, v]) => v).map(([k]) => k).join(', ') : 'None'}
    //                   </div>
    //                 ))
    //               ) : (
    //                 'No Plans Available'
    //               )}
    //             </td>
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="6" className="text-center">No Rooms Available</td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>
    // </div>
    

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
      <td className="px-6 py-4">{room.capacity}</td>
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
              <p>2 Guests (With GST): ₹{plan.twoGuestsWithGST}</p>
              <p>2 Guests (Without GST): ₹{plan.twoGuestsWithoutGST}</p>
              <p>Extra Adult (With GST): ₹{plan.extraAdultWithGST}</p>
              <p>Extra Adult (Without GST): ₹{plan.extraAdultWithoutGST}</p>
              <p>
                <strong>Complimentary:</strong>{" "}
                {plan.complimentary?.join(", ") || "N/A"}
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
// const RoomsTable = () => {
//   const [rooms, setRooms] = useState([]);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       const response = await axiosInstance.get('/admin/roomsdata');
//       console.log(rooms,'roommsssssssss');
      
//       setRooms(response.data);
//     };
//     fetchRooms();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">🛏️ Room Types & Pricing Plans</h2>
//       <table className="table table-bordered">
//         <thead className="table-">
//           <tr>
//             <th>Room Type</th>
//             <th>Max Rooms</th>
//             <th>Capacity</th>
//             <th>Check In</th>
//             <th>Check Out</th>
//             <th>Plans</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rooms.map((room, i) => (
//             <tr key={i}>
//               <td>{room.roomType}</td>
//               <td>{room.maxRoomsAvailable}</td>
//               <td>{room.capacity}</td>
//               <td>{room.checkIn}</td>
//               <td>{room.checkOut}</td>
//               <td>
//                     {Array.isArray(room.plans) && room.plans.map((plan, j) => (
//                         <div key={j} className="mb-3 p-2 border rounded bg-light">
//                         <strong>{plan.name}</strong><br />
//                         2 Guests (With GST): ₹{plan.twoGuestsWithGST}<br />
//                         2 Guests (Without GST): ₹{plan.twoGuestsWithoutGST}<br />
//                         Extra Adult (With GST): ₹{plan.extraAdultWithGST}<br />
//                         Extra Adult (Without GST): ₹{plan.extraAdultWithoutGST}<br />
//                         <strong>Complimentary:</strong> {plan.complimentary?.join(', ')}<br />
//                         <strong>Services:</strong> {
//                             plan.services
//                             ? Object.entries(plan.services)
//                                 .filter(([_, v]) => v)
//                                 .map(([k]) => k)
//                                 .join(', ')
//                             : 'N/A'
//                         }
//                         </div>
//                     ))}
//                     </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>


// // <div class="p-36 relative overflow-x-auto shadow-md sm:rounded-lg">
// //    <h1 className="mb-4 text-4xl justify-center items-center font-bold flex pb">🛏️ Room Types & Pricing Plans</h1>

// //     <table class="w-full text-sm text-left rtl:text-right text-gray-500 :text-gray-400">
// //         <thead class="text-xs text-gray-700 uppercase bg-gray-50 :bg-gray-700 :text-gray-400">
// //             <tr>
// //                 <th scope="col" class="px-6 py-3">
// //                     Product name
// //                 </th>
// //                 <th scope="col" class="px-6 py-3">
// //                     Color
// //                 </th>
// //                 <th scope="col" class="px-6 py-3">
// //                     Category
// //                 </th>
// //                 <th scope="col" class="px-6 py-3">
// //                     Price
// //                 </th>
// //                 <th scope="col" class="px-6 py-3">
// //                     Action
// //                 </th>
// //             </tr>
// //         </thead>
// //         <tbody>
// //             <tr class="odd:bg-white odd::bg-gray-900 even:bg-gray-50 even::bg-gray-800 border-b :border-gray-700 border-gray-200">
// //                 <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap :text-white">
// //                     Apple MacBook Pro 17"
// //                 </th>
// //                 <td class="px-6 py-4">
// //                     Silver
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     Laptop
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     $2999
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     <a href="#" class="font-medium text-blue-600 :text-blue-500 hover:underline">Edit</a>
// //                 </td>
// //             </tr>
// //             <tr class="odd:bg-white odd::bg-gray-900 even:bg-gray-50 even::bg-gray-800 border-b :border-gray-700 border-gray-200">
// //                 <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap :text-white">
// //                     Microsoft Surface Pro
// //                 </th>
// //                 <td class="px-6 py-4">
// //                     White
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     Laptop PC
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     $1999
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     <a href="#" class="font-medium text-blue-600 :text-blue-500 hover:underline">Edit</a>
// //                 </td>
// //             </tr>
// //             <tr class="odd:bg-white odd::bg-gray-900 even:bg-gray-50 even::bg-gray-800 border-b :border-gray-700 border-gray-200">
// //                 <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap :text-white">
// //                     Magic Mouse 2
// //                 </th>
// //                 <td class="px-6 py-4">
// //                     Black
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     Accessories
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     $99
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     <a href="#" class="font-medium text-blue-600 :text-blue-500 hover:underline">Edit</a>
// //                 </td>
// //             </tr>
// //             <tr class="odd:bg-white odd::bg-gray-900 even:bg-gray-50 even::bg-gray-800 border-b :border-gray-700 border-gray-200">
// //                 <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap :text-white">
// //                     Google Pixel Phone
// //                 </th>
// //                 <td class="px-6 py-4">
// //                     Gray
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     Phone
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     $799
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     <a href="#" class="font-medium text-blue-600 :text-blue-500 hover:underline">Edit</a>
// //                 </td>
// //             </tr>
// //             <tr>
// //                 <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap :text-white">
// //                     Apple Watch 5
// //                 </th>
// //                 <td class="px-6 py-4">
// //                     Red
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     Wearables
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     $999
// //                 </td>
// //                 <td class="px-6 py-4">
// //                     <a href="#" class="font-medium text-blue-600 :text-blue-500 hover:underline">Edit</a>
// //                 </td>
// //             </tr>
// //         </tbody>
// //     </table>
// // </div>

//   );
// };

// export default RoomsTable;
