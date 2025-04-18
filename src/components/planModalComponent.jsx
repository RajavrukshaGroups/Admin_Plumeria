// PlanModalComponent.jsx

import React from 'react';

const PlanModal = ({ isOpen, onClose, planData, onSave }) => {
  if (!isOpen || !planData) return null;

  console.log(planData,'this is the plan data')
  
  const {
    name,
    price,
    complimentary,
    roomInfo,
    checkIn,
    checkOut,
    capacity,
    menuDetails
  } = planData;
  
  console.log(menuDetails,'this is menu details');
  

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
          {/* <button
            onClick={() => {
              onSave(planData);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Save
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PlanModal;
