import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";
import axiosInstance from "../api/interceptors";

const AdminCreateBooking = () => {
  const [formData, setFormData] = useState({
    bookingId: "",
    customerName: "",
    contactInfo: {
      email: "",
      phone: "",
    },
    checkInDate: "",
    checkOutDate: "",
    totalRooms: 0,
    roomTypes: [""],
    totalGuests: [
      {
        roomType: "",
        persons: 0,
        adult: 0,
        children: 0,
        planName: "",
      },
    ],
    totalCost: 0,
    bookingStatus: "Confirmed",
    payment: {
      method: "",
      amountPaid: 0,
      balanceDue: 0,
    },
    assignedStaff: "",
    specialRequests: [""],
    discount: {
      code: "",
      amount: 0,
    },
    invoicePdfUrl: "",
  });

  const [roomTypes, setRoomTypes] = useState([]);
  const [plans, setPlans] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/rooms")
      .then((res) => {
        const roomTypesData = res.data || [];
        setRoomTypes(roomTypesData);

        const roomPlans = roomTypesData.reduce((acc, room) => {
          acc[room.roomType] = Object.keys(room.plans || {});
          return acc;
        }, {});
        setPlans(roomPlans);
      })
      .catch((err) => console.error("Failed to fetch room types:", err));
  }, []);

  console.log("plans", plans);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "totalRooms") {
      const roomCount = parseInt(value, 10) || 0;

      setFormData((prev) => {
        const currentGuests = [...prev.totalGuests];
        let updatedGuests;

        if (roomCount > currentGuests.length) {
          const additionalGuests = Array.from(
            { length: roomCount - currentGuests.length },
            () => ({
              roomType: "",
              persons: 0,
              adult: 0,
              children: 0,
              planName: "",
            })
          );
          updatedGuests = [...currentGuests, ...additionalGuests];
        } else {
          updatedGuests = currentGuests.slice(0, roomCount);
        }

        return {
          ...prev,
          totalRooms: roomCount,
          totalGuests: updatedGuests,
        };
      });
    }
  };

  const handleGuestChange = (index, field, value) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    // Prevent multiple leading zeros
    if (value.length > 1 && value.startsWith("0")) return;

    const updatedGuests = [...formData.totalGuests];
    updatedGuests[index][field] = value; // store as string temporarily

    setFormData((prev) => ({
      ...prev,
      totalGuests: updatedGuests,
    }));
  };

  const handleRoomTypeChange = (index, roomType) => {
    const updatedGuests = [...formData.totalGuests];
    updatedGuests[index].roomType = roomType;
    updatedGuests[index].planName = ""; // Reset plan when room type changes
    setFormData((prev) => ({
      ...prev,
      totalGuests: updatedGuests,
    }));
  };

  const handlePlanChange = (index, planName) => {
    const updatedGuests = [...formData.totalGuests];
    updatedGuests[index].planName = planName;
    setFormData((prev) => ({
      ...prev,
      totalGuests: updatedGuests,
    }));
  };

  const handleRoomCountChange = (action) => {
    setFormData((prev) => {
      const updatedRoomCount =
        action === "increment" ? prev.totalRooms + 1 : prev.totalRooms - 1;

      if (updatedRoomCount >= 0) {
        const currentGuests = [...prev.totalGuests];
        let updatedGuests;

        if (updatedRoomCount > currentGuests.length) {
          // Add more guests if rooms increased
          const additionalGuests = Array.from(
            { length: updatedRoomCount - currentGuests.length },
            () => ({
              roomType: "",
              persons: 0,
              adult: 0,
              children: 0,
              planName: "",
            })
          );
          updatedGuests = [...currentGuests, ...additionalGuests];
        } else {
          // Remove guests if rooms decreased
          updatedGuests = currentGuests.slice(0, updatedRoomCount);
        }

        return {
          ...prev,
          totalRooms: updatedRoomCount,
          totalGuests: updatedGuests,
        };
      }
      return prev;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const keys = name.split(".");
      if (keys.length === 1) {
        return { ...prev, [name]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      } else if (keys.length === 3) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: {
              ...prev[keys[0]][keys[1]],
              [keys[2]]: value,
            },
          },
        };
      }
      return prev;
    });
  };

  const handleSubmit = () => {};

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        ✍️ Admin Booking Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Booking Info */}
        <div className="space-y-4">
          <SectionTitle title="Booking Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              icon={<FaUser />}
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <SectionTitle title="Contact Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              icon={<FaEnvelope />}
              type="email"
              label="Email"
              name="contactInfo.email"
              value={formData.contactInfo.email}
              onChange={handleInputChange}
            />
            <TextInput
              icon={<FaPhone />}
              label="Phone"
              name="contactInfo.phone"
              value={formData.contactInfo.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4">
          <SectionTitle title="Stay Dates" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              icon={<FaCalendarAlt />}
              type="date"
              label="Check-In Date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleInputChange}
            />
            <TextInput
              icon={<FaCalendarAlt />}
              type="date"
              label="Check-Out Date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Room & Guest Info */}
        <div className="space-y-4">
          <SectionTitle title="Room Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-600 mr-4">
                Total Rooms
              </label>
              <button
                type="button"
                onClick={() => handleRoomCountChange("decrement")}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white p-4 rounded-full hover:from-red-600 hover:to-red-800 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                disabled={formData.totalRooms <= 0}
              >
                -
              </button>
              <input
                type="number"
                name="totalRooms"
                value={formData.totalRooms}
                readOnly
                className="w-20 text-center mx-2 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => handleRoomCountChange("increment")}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-full hover:from-green-600 hover:to-green-800 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {formData.totalRooms > 0 && (
          <div className="space-y-4">
            <SectionTitle title="Guest Information" />
            {formData.totalGuests.map((guest, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-xl border"
              >
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">
                    Room Type (Room {index + 1})
                  </label>
                  <select
                    value={guest.roomType}
                    onChange={(e) =>
                      handleRoomTypeChange(index, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select a room type</option>
                    {roomTypes.map((room) => (
                      <option key={room._id} value={room.roomType}>
                        {room.roomType}
                      </option>
                    ))}
                  </select>
                </div>

                <TextInput
                  label="Persons"
                  type="number"
                  min={0}
                  value={guest.persons}
                  onChange={(e) =>
                    handleGuestChange(index, "persons", e.target.value)
                  }
                />
                <TextInput
                  label="Adults"
                  type="number"
                  min={0}
                  value={guest.adult}
                  onChange={(e) =>
                    handleGuestChange(index, "adult", e.target.value)
                  }
                />
                <TextInput
                  label="Children"
                  type="number"
                  min={0}
                  value={guest.children}
                  onChange={(e) =>
                    handleGuestChange(index, "children", e.target.value)
                  }
                />

                {/* Plan Name Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">
                    Plan Name
                  </label>
                  <select
                    value={guest.planName}
                    onChange={(e) => handlePlanChange(index, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={!guest.roomType}
                  >
                    <option value="">Select a plan</option>
                    {guest.roomType &&
                      plans[guest.roomType]?.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cost & Payment */}
        <div className="space-y-4">
          <SectionTitle title="Payment Details" />
          <TextInput
            label="Total Cost"
            type="number"
            name="totalCost"
            value={formData.totalCost}
            onChange={handleInputChange}
          />
          <TextInput
            label="Booking Status"
            name="bookingStatus"
            value={formData.bookingStatus}
            onChange={handleInputChange}
          />
          <TextInput
            icon={<FaCreditCard />}
            label="Payment Method"
            name="payment.method"
            value={formData.payment.method}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Amount Paid"
              type="number"
              name="payment.amountPaid"
              value={formData.payment.amountPaid}
              onChange={handleInputChange}
            />
            <TextInput
              label="Balance Due"
              type="number"
              name="payment.balanceDue"
              value={formData.payment.balanceDue}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Extras */}
        <div className="space-y-4">
          <SectionTitle title="Additional Info" />
          <TextInput
            label="Assigned Staff"
            name="assignedStaff"
            value={formData.assignedStaff}
            onChange={handleInputChange}
          />
          <TextInput
            label="Special Requests"
            name="specialRequests.0"
            value={formData.specialRequests[0]}
            onChange={handleInputChange}
          />
        </div>

        {/* Discounts */}
        <div className="space-y-4">
          <SectionTitle title="Discount" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Discount Code"
              name="discount.code"
              value={formData.discount.code}
              onChange={handleInputChange}
            />
            <TextInput
              label="Discount Amount"
              type="number"
              name="discount.amount"
              value={formData.discount.amount}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="text-center pt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
          >
            ✅ Create Booking
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Section Title
const SectionTitle = ({ title }) => (
  <h3 className="text-xl font-semibold border-b pb-1 text-gray-700">{title}</h3>
);

// Reusable Input
// const TextInput = ({
//   label,
//   type = "text",
//   icon,
//   value = "",
//   name = "",
//   onChange = () => {},
// }) => (
//   <div>
//     <label className="block text-sm font-medium mb-1 text-gray-600">
//       {label}
//     </label>
//     <div className="relative">
//       {icon && (
//         <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>
//       )}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className={`w-full border border-gray-300 rounded-lg p-2 ${
//           icon ? "pl-10" : "pl-3"
//         } focus:outline-none focus:ring-2 focus:ring-blue-400`}
//       />
//     </div>
//   </div>
// );

const TextInput = ({ icon, label, name, value, type = "text", onChange }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium mb-1 text-gray-600">
        {label}
      </label>
    )}
    <div className="flex items-center border border-gray-300 rounded-lg p-2">
      {icon && <div className="mr-2 text-gray-500">{icon}</div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full focus:outline-none"
      />
    </div>
  </div>
);

export default AdminCreateBooking;
