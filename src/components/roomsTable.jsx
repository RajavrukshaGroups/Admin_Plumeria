import React, { useEffect, useState } from 'react';
import axiosInstance from '.././api/interceptors';
import PlanModal from '../components/planModalComponent';
import { Link } from 'react-router-dom';
import { fetchRoomsData ,deleteRoom} from '../api/auth';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css



const RoomsTable = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

console.log(rooms,'this is the rooms data')

  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await fetchRoomsData();
        setRooms(response || []); // or response.data if you're returning only data
      } catch (error) {
        console.error("Error fetching rooms data:", error);
      }
    };
    getRooms();
  }, []);


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



  const handleDeleteRoom = (roomId) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to delete this room?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteRoom(roomId);
              setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
            } catch (error) {
              console.error("Error deleting room:", error);
              // Optional: toast or alert
            }
          }
        },
        {
          label: 'No',
          onClick: () => {} // Do nothing
        }
      ]
    });
  };
  
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className='custom-ui'>
          <h1>Are you sure?</h1>
          <p>You want to delete this file?</p>
          <button onClick={onClose}>No</button>
          <button
            onClick={() => {
              this.handleClickDelete();
              onClose();
            }}
          >
            Yes, Delete it!
          </button>
        </div>
      );
    }
  });



  return (
    <div className="p-8 bg-white :bg-gray-900 rounded-2xl shadow-2xl overflow-x-auto">
    
      <h2 className="text-3xl flex items-center m-auto justify-center underline font-extrabold mb-8 text-gray-800 :text-white tracking-wide">
        Rooms Overview
      </h2>

      <table className="min-w-full text-sm text-left text-gray-700 :text-gray-300 border border-gray-300 :border-gray-600 rounded-lg">
        <thead className="text-sm uppercase bg-gradient-to-r from-blue-200 to-blue-400 :from-gray-800 :to-gray-700 text-white">
          <tr>
            {['Room Type', 'Max Rooms', 'Capacity', 'Check In', 'Check Out', 'Plans','Edit','Delete'].map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 border-r border-gray-300 :border-gray-600 text-sm font-bold tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rooms.map((room, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 :border-gray-700 hover:bg-blue-50 :hover:bg-gray-800 transition duration-200"
            >
              <td className="px-6 py-4 font-bold text-lg text-gray-900 :text-white border-r border-gray-200 :border-gray-700">
                {room.roomType}
              </td>
              <td className="px-6 py-4 text-base font-medium border-r border-gray-200 :border-gray-700">
                {room.maxRoomsAvailable}
              </td>
              <td className="px-6 py-4 text-base font-medium border-r border-gray-200 :border-gray-700">
                {room.capacity
                  ? `Persons: ${room.capacity.maxPersons} , Adults: ${room.capacity.maxAdults}, Children: ${room.capacity.maxChildren} `
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 text-base font-medium border-r border-gray-200 :border-gray-700">
                {room.checkIn}
              </td>
              <td className="px-6 py-4 text-base font-medium border-r border-gray-200 :border-gray-700">
                {room.checkOut}
              </td>

              <td className="px-6 py-4 space-y-2 text-base font-medium border-r border-gray-200 :border-gray-700">
               
                <div className="mt-2 space-y-1">
                  {room.plans.map((plan, j) => (
                    <button
                      key={j}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowModal(true);
                      }}
                      className="block w-full text-left text-blue-900 :text-blue-400 hover:underline font-semibold text-base cursor-pointer"
                    >
                      {plan.name}
                    </button>
                  ))}
                </div>
              </td>
            <td className='px-6 py-4 space-y-2'>
            <Link
                  to={`/edit-room/${room._id}`}
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded shadow"
                >
                  Edit
                </Link>
              

            </td>
            <td className='px-6 py-4 space-y-2'>
            <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="ml-2 inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded shadow"
                  >
                    Delete
                  </button>
               </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PlanModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        planData={selectedPlan}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default RoomsTable;


