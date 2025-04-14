// /admin/components/RoomForm.jsx
import React, { useState } from 'react';

const RoomForm = ({ onSubmit, initialData = {} }) => {
    if (!initialData) initialData = {}; // ✅ fallback to empty object
  const [formData, setFormData] = useState({
    roomType: initialData.roomType || '',
    maxRoomsAvailable: initialData.maxRoomsAvailable || 1,
    checkIn: initialData.checkIn || '',
    checkOut: initialData.checkOut || '',
    images: initialData.images || [],
    capacity: {
      maxPersons: initialData.capacity?.maxPersons || 2,
      maxAdults: initialData.capacity?.maxAdults || 2,
      maxChildren: initialData.capacity?.maxChildren || 0,
    },
    roomInfo: {
      description: initialData.roomInfo?.description || '',
      amenities: initialData.roomInfo?.amenities || [],
      terms: initialData.roomInfo?.terms || [],
      bed: initialData.roomInfo?.bed || '',
    },
    plans: initialData.plans || {
      lite: {
        price: {
          twoGuests: { withGst: 0, withoutGst: 0 },
          extraAdult: { withGst: 0, withoutGst: 0 },
        },
        complimentary: [],
        services: {
          WiFi: false,
          breakfast: false,
          spa: false,
          taxesIncluded: false,
        },
      },
      plus: {
        price: {
          twoGuests: { withGst: 0, withoutGst: 0 },
          extraAdult: { withGst: 0, withoutGst: 0 },
        },
        complimentary: [],
        menuDetails: {
          welcomeDrinks: [],
          breakFast: [],
        },
        services: {
          WiFi: false,
          breakfast: false,
          spa: false,
          taxesIncluded: false,
        },
      },
      max: {
        price: {
          twoGuests: { withGst: 0, withoutGst: 0 },
          extraAdult: { withGst: 0, withoutGst: 0 },
        },
        complimentary: [],
        menuDetails: {
          welcomeDrinks: [],
          breakFast: [],
          dinner: [],
          snacks: [],
        },
        services: {
          WiFi: false,
          breakfast: false,
          spa: false,
          taxesIncluded: false,
        },
      },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <div className="mb-4">
        <label>Room Type</label>
        <input
          type="text"
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label>Max Rooms Available</label>
        <input
          type="number"
          name="maxRoomsAvailable"
          value={formData.maxRoomsAvailable}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      {/* Add more fields modularly (check-in, check-out, capacity, etc.) */}

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData._id ? 'Update Room' : 'Create Room'}
      </button>
    </form>
  );
};

export default RoomForm;

