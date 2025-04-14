import React, { useState } from "react";
import axios from "axios";

const CreateRoom = () => {
  const [roomData, setRoomData] = useState({
    roomType: "",
    maxRoomsAvailable: 0,
    checkIn: "",
    checkOut: "",
    images: [""],
    capacity: {
      maxPersons: 0,
      maxAdults: 0,
      maxChildren: 0,
    },
    roomInfo: {
      description: "",
      amenities: [],
      terms: [],
      bed: "",
    },
    plans: {
      lite: {
        price: { twoGuests: {}, extraAdult: {} },
        complimentary: [],
        services: { WiFi: true, breakfast: false, spa: false, taxesIncluded: false },
      },
      plus: {
        price: { twoGuests: {}, extraAdult: {} },
        complimentary: [],
        services: { WiFi: true, breakfast: true, spa: false, taxesIncluded: false },
        menuDetails: { welcomeDrinks: [], breakFast: [] },
      },
      max: {
        price: { twoGuests: {}, extraAdult: {} },
        complimentary: [],
        services: { WiFi: true, breakfast: true, spa: false, taxesIncluded: false },
        menuDetails: { welcomeDrinks: [], breakFast: [], dinner: [], snacks: [] },
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/rooms/create", roomData);
      alert("Room Created Successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room Type"
          value={roomData.roomType}
          onChange={(e) => setRoomData({ ...roomData, roomType: e.target.value })}
          className="form-control mb-3"
        />

        <input
          type="number"
          placeholder="Max Rooms Available"
          value={roomData.maxRoomsAvailable}
          onChange={(e) => setRoomData({ ...roomData, maxRoomsAvailable: +e.target.value })}
          className="form-control mb-3"
        />

        <input
          type="text"
          placeholder="Check-in Time"
          value={roomData.checkIn}
          onChange={(e) => setRoomData({ ...roomData, checkIn: e.target.value })}
          className="form-control mb-3"
        />

        <input
          type="text"
          placeholder="Check-out Time"
          value={roomData.checkOut}
          onChange={(e) => setRoomData({ ...roomData, checkOut: e.target.value })}
          className="form-control mb-3"
        />

        {/* Extend form inputs for capacity, plans, images, etc. as needed */}

        <button className="btn  btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CreateRoom;
