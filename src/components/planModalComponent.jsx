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
      menuDetails,
      services,
      plans
    } = planData;
    
    console.log(menuDetails,'this is menu details');
    

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm px-4 py-6">
  {/* <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"> */}

  <div className="relative bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
  <button
  onClick={onClose}
  className="absolute top-4 right-4 text-4xl font-bold text-red-400  hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition"
  aria-label="Close"
>
  ×
</button>
    {/* Title */}
    <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300">{name}</h2>

    {/* Description */}
    {roomInfo?.description && (
      <p className="mb-6 text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
        {roomInfo.description}
      </p>
    )}

    {/* Capacity */}
    {capacity && (
      <div className="mb-6 text-gray-700 dark:text-gray-300">
        <h3 className="font-semibold text-lg mb-2">Capacity</h3>
        <ul className="list-disc list-inside">
          <li>Adults: {capacity.maxAdults}</li>
          <li>Children: {capacity.maxChildren}</li>
          <li>Total Persons: {capacity.maxPersons}</li>
        </ul>
      </div>
    )}

    {/* Pricing */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-200">
        <h4 className="font-semibold mb-2 text-lg">2 Guests</h4>
        <p>With GST: ₹{price?.twoGuests?.withGst ?? "N/A"}</p>
        <p>Without GST: ₹{price?.twoGuests?.withoutGst ?? "N/A"}</p>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-200">
        <h4 className="font-semibold mb-2 text-lg">Extra Adult</h4>
        <p>With GST: ₹{price?.extraAdult?.withGst ?? "N/A"}</p>
        <p>Without GST: ₹{price?.extraAdult?.withoutGst ?? "N/A"}</p>
      </div>
    </div>

    {/* Complimentary */}
    <div className="mb-6 text-gray-800 dark:text-gray-200">
      <h3 className="font-semibold text-lg mb-2">Complimentary</h3>
      <p>{complimentary?.length > 0 ? complimentary.join(', ') : 'N/A'}</p>
    </div>
    <div className="mb-4 p-2  border-gray-300 dark:border-gray-700 rounded-md shadow-md">
  <h4 className="text-sm font-semibold mb-2">Menu Details</h4>
  <div className="space-y-1 text-xs leading-tight">
    {Object.entries(menuDetails).map(([key, items]) => {
      const filteredItems = items.filter(item => item && item.trim() !== "");
      if (filteredItems.length === 0) return null;
      return (
        <div key={key}>
          <p>
            <span className="font-semibold capitalize">{key}:</span>{" "}
            {filteredItems.join(", ")}
          </p>
        </div>
      );
    })}
  </div>
</div>

    {/* Amenities */}
    {roomInfo?.amenities?.length > 0 && (
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Amenities</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {roomInfo.amenities.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Terms */}
    {roomInfo?.terms?.length > 0 && (
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Terms</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {roomInfo.terms.map((term, idx) => (
            <li key={idx}>{term}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Services + Menu in Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-800 dark:text-gray-200">
      
      {/* Services */}
      <div>
        <h4 className="font-semibold text-lg mb-2">Services</h4>
        <ul className="list-disc list-inside">
          {Object.entries(services)
            .filter(([_, value]) => value === true)
            .map(([key]) => (
              <li key={key}>{key}</li>
            ))}
        </ul>
      </div>
    </div>

    {/* Close Button */}
    {/* <div className="flex justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition"
      >
        Close
      </button>
    </div> */}

  </div>
</div>

    );
  };

  export default PlanModal;
