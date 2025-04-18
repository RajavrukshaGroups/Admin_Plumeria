// PlanModalComponent.jsx

import React from 'react';

const PlanModal = ({ isOpen, onClose, planData, onSave }) => {
  if (!isOpen || !planData) return null;

  const {
    name,
    price,
    complimentary,
    roomInfo,
    checkIn,
    checkOut,
    capacity,
  } = planData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm px-4 py-6">
      <div className="bg-white :bg-gray-900 rounded-xl w-full max-w-3xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-4 text-blue-700 :text-blue-300">{name}</h2>

        {/* Description */}
        {roomInfo?.description && (
          <p className="mb-4 text-gray-700 :text-gray-200 text-lg">{roomInfo.description}</p>
        )}

        {/* Capacity */}
        {capacity && (
          <div className="mb-4 text-gray-700 :text-gray-300">
            <h3 className="font-semibold mb-1">Capacity:</h3>
            <ul className="list-disc pl-6">
              <li>Adults: {capacity.maxAdults}</li>
              <li>Children: {capacity.maxChildren}</li>
              <li>Total Persons: {capacity.maxPersons}</li>
            </ul>
          </div>
        )}

        {/* Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 :text-gray-200 text-base mb-4">
          <div className="p-4 bg-blue-50 :bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2 text-lg">2 Guests</h4>
            <p>With GST: ₹{price?.twoGuests?.withGst ?? "N/A"}</p>
            <p>Without GST: ₹{price?.twoGuests?.withoutGst ?? "N/A"}</p>
          </div>
          <div className="p-4 bg-blue-50 :bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2 text-lg">Extra Adult</h4>
            <p>With GST: ₹{price?.extraAdult?.withGst ?? "N/A"}</p>
            <p>Without GST: ₹{price?.extraAdult?.withoutGst ?? "N/A"}</p>
          </div>
        </div>

        {/* Complimentary */}
        <div className="mb-4 text-gray-800 :text-gray-200">
          <h3 className="font-semibold mb-1">Complimentary:</h3>
          <p>{complimentary?.length > 0 ? complimentary.join(', ') : 'N/A'}</p>
        </div>

        {/* Amenities */}
        {roomInfo?.amenities?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1 text-gray-800 :text-gray-200">Amenities:</h3>
            <ul className="list-disc pl-6 text-gray-700 :text-gray-300">
              {roomInfo.amenities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Terms */}
        {roomInfo?.terms?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1 text-gray-800 :text-gray-200">Terms:</h3>
            <ul className="list-disc pl-6 text-gray-700 :text-gray-300">
              {roomInfo.terms.map((term, idx) => (
                <li key={idx}>{term}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Check-in/out */}
        <div className="grid grid-cols-2 gap-4 text-gray-800 :text-gray-200 mb-6">
          <div>
            <h4 className="font-semibold">Check-in Time:</h4>
            <p>{checkIn || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-semibold">Check-out Time:</h4>
            <p>{checkOut || "N/A"}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSave(planData);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;


// const PlanModal = ({ isOpen, onClose, planData, onSave }) => {
//   if (!isOpen || !planData) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white :bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">{planData.name}</h2>
//         <p className='mb-2'>2 Guests (With GST): ₹{planData.price?.twoGuests?.withGst ?? "N/A"}</p>
//         <p className='mb-2'>2 Guests (Without GST): ₹{planData.price?.twoGuests?.withoutGst ?? "N/A"}</p>
//         <p className='mb-2'>Extra Adult (With GST): ₹{planData.price?.extraAdult?.withGst ?? "N/A"}</p>
//         <p className='mb-2'>Extra Adult (Without GST): ₹{planData.price?.extraAdult?.withoutGst ?? "N/A"}</p>
//         <p className='mb-2'>
//           <strong>Complimentary:</strong> {planData.complimentary?.length > 0 ? planData.complimentary.join(", ") : "N/A"}
//         </p>

//         <div className="mt-6 flex justify-end space-x-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//           >
//             Close
//           </button>
//           <button
//             onClick={() => {
//               // Handle save/edit logic
//               onSave(planData);
//               onClose();
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlanModal;



// // components/PlanModal.jsx
// import React, { useState,useEffect} from "react";

// const PlanModal = ({ isOpen, onClose, planData, onSave }) => {
//     console.log(planData,'this is plan data')
//   const [editedPlan, setEditedPlan] = useState({ ...planData });

//   const handleChange = (field, subField, value) => {

//     setEditedPlan((prev) => ({
//       ...prev,
//       price: {
//         ...prev.price,
//         [field]: {
//           ...prev.price?.[field],
//           [subField]: value,
//         },
//       },
//     }));
//   };
//   useEffect(() => {
//     if (planData) {
//       setEditedPlan(planData);
//     }
//   }, [planData]);
  

//   const handleSave = () => {
//     onSave(editedPlan);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-blend-saturation bg-opacity-40 flex items-center justify-center">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
//         <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
//           Edit Plan: {planData.name}
//         </h2>

//         <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
//           {[
//             { label: "2 Guests (With GST)", field: "twoGuests", key: "withGst" },
//             { label: "2 Guests (Without GST)", field: "twoGuests", key: "withoutGst" },
//             { label: "Extra Adult (With GST)", field: "extraAdult", key: "withGst" },
//             { label: "Extra Adult (Without GST)", field: "extraAdult", key: "withoutGst" },
//           ].map(({ label, field, key }) => (
//             <div key={label} className="flex justify-between items-center">
//               <label>{label}</label>
//               <input
//                 type="number"
//                 value={editedPlan.price?.[field]?.[key] || ""}
//                 onChange={(e) => handleChange(field, key, e.target.value)}
//                 className="ml-4 px-3 py-1 border rounded-md w-40 bg-white dark:bg-gray-700 dark:border-gray-600"
//               />
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlanModal;
