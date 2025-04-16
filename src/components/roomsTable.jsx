
import React, { useEffect, useState } from 'react';
import axiosInstance from ".././api/interceptors";
import PlanModal from '../components/planModalComponent'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';
import EditRoomDetails from './EditRoomDetails';
const RoomsTable = () => {
  const [rooms, setRooms] = useState([]);
// Inside your RoomsTable component
const [selectedPlan, setSelectedPlan] = useState(null);
const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/admin/roomsdata');
        console.log(response, 'Fetched rooms data');
        setRooms(response || []);
      } catch (error) {
        console.error('Error fetching rooms data:', error);
      }
    };
    fetchRooms();
  }, []);
  
  // Handler to update room plan
const handleSavePlan = (updatedPlan) => {
  setRooms((prevRooms) =>
    prevRooms.map((room) => ({
      ...room,
      plans: room.plans.map((plan) =>
        plan.name === updatedPlan.name ? updatedPlan : plan
      ),
    }))
  );
};

  return (
    <div className="p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Rooms Overview</h2>
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse">
        <thead className="text-xs uppercase bg-gradient-to-r from-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-300">
          <tr>
            {["Room Type", "Max Rooms", "Capacity", "Check In", "Check Out", "Plans"].map((header, index) => (
              <th key={index} className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-sm font-semibold tracking-wide">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, i) => (
            <tr
              key={i}
              className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{room.roomType}</td>
              <td className="px-6 py-4">{room.maxRoomsAvailable}</td>
              <td className="px-6 py-4">
                {room.capacity
                  ? `Adults: ${room.capacity.maxAdults}, Children: ${room.capacity.maxChildren}, Total: ${room.capacity.maxPersons}`
                  : "N/A"}
              </td>
              <td className="px-6 py-4">{room.checkIn}</td>
              <td className="px-6 py-4">{room.checkOut}</td>
              <td className="px-6 py-4">
              <Link to={`/edit-room/${room._id}`}>Edit</Link>

              {room.plans.map((plan, j) => (
                      <div
                        key={j}
                        className="mb-3 p-3 rounded bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 shadow  hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                       
                      >
                        <p className="font-semibold text-blue-800 dark:text-blue-300">{plan.name}</p>
                        <p>2 Guests (With GST): ₹{plan.price?.twoGuests?.withGst ?? "N/A"}</p>
                        <p>2 Guests (Without GST): ₹{plan.price?.twoGuests?.withoutGst ?? "N/A"}</p>
                        <p>Extra Adult (With GST): ₹{plan.price?.extraAdult?.withGst ?? "N/A"}</p>
                        <p>Extra Adult (Without GST): ₹{plan.price?.extraAdult?.withoutGst ?? "N/A"}</p>
                        <p>
                          <strong>Complimentary:</strong>{" "}
                          {plan.complimentary?.length > 0 ? plan.complimentary.join(", ") : "N/A"}
                        </p>
                        {/* <button className='bg-blue-600 text-white border-r-2 rounded-3xl cursor-pointer w-52 border ' onClick={() => {
                          setSelectedPlan(plan);
                          setShowModal(true);
                        }}>Edit
                        </button> */}
                      </div>

                    ))}
                    <PlanModal
                          isOpen={showModal}
                          onClose={() => setShowModal(false)}
                          planData={selectedPlan}
                          onSave={handleSavePlan}
                        />

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsTable;




// import React, { useEffect, useState } from 'react';
// import axiosInstance from ".././api/interceptors";

// const RoomsTable = () => {
//   const [rooms, setRooms] = useState([]);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await axiosInstance.get('/admin/roomsdata');
//         console.log(response, 'Fetched rooms data');
//         setRooms(response || []); // Ensure rooms is always an array
//       } catch (error) {
//         console.error('Error fetching rooms data:', error);
//       }
//     };
//     fetchRooms();
//   }, []);

//   return (
    

// <div classNames="p-20 relative overflow-x-auto shadow-md sm:rounded-lg">
//     <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//         <thead className="text-xs h-20 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//             <tr className='border-2 border-gray-500'>
//                 <th scope="col" className="px-6 py-3 border-r-2 border-gray-500" >
//                 Room Type
//                 </th>
//                 <th scope="col" className="px-6 py-3 border-r-2 border-gray-500">
//                 Max Rooms
//                 </th>
//                 <th scope="col" className="px-6 py-3 border-r-2 border-gray-500">
//                 Capacity
//                 </th>
//                 <th scope="col" className="px-6 py-3 border-r-2 border-gray-500">
//                 Check In
//                 </th>
//                 <th scope="col" className="px-6 py-3 border-r-2 border-gray-500">
//                 Check Out
//                 </th>
//                 <th scope="col" className="px-6 py-3 border-r-2 border-gray-500">
//                 Plans
//                 </th>
//             </tr>
//         </thead>
//         <tbody>
//   {rooms.map((room, i) => (
//     <tr
//       key={i}
//       className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
//     >
//       <th
//         scope="row"
//         className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
//       >
//         {room.roomType}
//       </th>
//       <td className="px-6 py-4">{room.maxRoomsAvailable}</td>
//       {/* <td className="px-6 py-4">{room.capacity}</td> */}
//       <td className="px-6 py-4">
//   {room.capacity
//     ? `Adults: ${room.capacity.maxAdults}, Children: ${room.capacity.maxChildren}, Total: ${room.capacity.maxPersons}`
//     : "N/A"}
// </td>

//       <td className="px-6 py-4">{room.checkIn}</td>
//       <td className="px-6 py-4">{room.checkOut}</td>
//       <td className="px-6 py-4">
//         {Array.isArray(room.plans) && room.plans.length > 0 ? (
//           room.plans.map((plan, j) => (
//             <div
//               key={j}
//               className="mb-3 p-2 rounded bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
//             >
//                <p className="font-semibold">{plan.name}</p>
//         <p>2 Guests (With GST): ₹{plan.price?.twoGuests?.withGst ?? "N/A"}</p>
//         <p>2 Guests (Without GST): ₹{plan.price?.twoGuests?.withoutGst ?? "N/A"}</p>
//         <p>Extra Adult (With GST): ₹{plan.price?.extraAdult?.withGst ?? "N/A"}</p>
//         <p>Extra Adult (Without GST): ₹{plan.price?.extraAdult?.withoutGst ?? "N/A"}</p>
//         <p>
//           <strong>Complimentary:</strong>{" "}
//           {plan.complimentary?.length > 0 ? plan.complimentary.join(", ") : "N/A"}
//         </p>
//               {/* <p>
//                 <strong>Services:</strong>{" "}
//                 {plan.services
//                   ? Object.entries(plan.services)
//                       .filter(([_, value]) => value)
//                       .map(([key]) => key)
//                       .join(", ")
//                   : "N/A"}
//               </p> */}
              
//             </div>
//           ))
//         ) : (
//           <span className="text-gray-500">No plans</span>
//         )}
//       </td>
//     </tr>
//   ))}
// </tbody>

//     </table>
// </div>

//   );
// };

// export default RoomsTable;
