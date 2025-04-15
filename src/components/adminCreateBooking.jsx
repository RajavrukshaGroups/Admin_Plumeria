import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";

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
    totalRooms: 1,
    roomTypes: [""],
    totalGuests: [
      {
        roomType: "",
        persons: 0,
        adult: 0,
        children: 0,
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
    specialRequest: [""],
    discount: {
      code: "",
      amount: 0,
    },
    invoicePdfUrl: "",
  });

  const handleChange = () => {};
  const handleGuestChange = () => {};
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
            />
            {/* <TextInput
              label="Booking ID"
              name="bookingId"
              value={formData.bookingId}
            /> */}
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
            />
            <TextInput
              icon={<FaPhone />}
              label="Phone"
              name="contactInfo.phone"
              value={formData.contactInfo.phone}
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
            />
            <TextInput
              icon={<FaCalendarAlt />}
              type="date"
              label="Check-Out Date"
              name="checkOutDate"
              value={formData.checkOutDate}
            />
          </div>
        </div>

        {/* Room & Guest Info */}
        <div className="space-y-4">
          <SectionTitle title="Room Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Total Rooms"
              type="number"
              name="totalRooms"
              value={formData.totalRooms}
            />
            <TextInput
              label="Room Type"
              name="roomTypes.0"
              value={formData.roomTypes[0]}
            />
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle title="Guest Information" />
          {formData.totalGuests.map((guest, index) => (
            <div
              key={index}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border"
            >
              <TextInput label="Room Type" value={guest.roomType} />
              <TextInput label="Persons" type="number" value={guest.persons} />
              <TextInput label="Adults" type="number" value={guest.adult} />
              <TextInput
                label="Children"
                type="number"
                value={guest.children}
              />
            </div>
          ))}
        </div>

        {/* Cost & Payment */}
        <div className="space-y-4">
          <SectionTitle title="Payment Details" />
          <TextInput
            label="Total Cost"
            type="number"
            name="totalCost"
            value={formData.totalCost}
          />
          <TextInput
            label="Booking Status"
            name="bookingStatus"
            value={formData.bookingStatus}
          />
          <TextInput
            icon={<FaCreditCard />}
            label="Payment Method"
            name="payment.method"
            value={formData.payment.method}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Amount Paid"
              type="number"
              name="payment.amountPaid"
              value={formData.payment.amountPaid}
            />
            <TextInput
              label="Balance Due"
              type="number"
              name="payment.balanceDue"
              value={formData.payment.balanceDue}
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
          />
          <TextInput
            label="Special Requests"
            name="specialRequests.0"
            value={formData.specialRequest[0]}
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
            />
            <TextInput
              label="Discount Amount"
              type="number"
              name="discount.amount"
              value={formData.discount.amount}
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
const TextInput = ({
  label,
  type = "text",
  icon,
  value = "",
  name = "",
  onChange = () => {},
}) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-600">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border border-gray-300 rounded-lg p-2 ${
          icon ? "pl-10" : "pl-3"
        } focus:outline-none focus:ring-2 focus:ring-blue-400`}
      />
    </div>
  </div>
);

export default AdminCreateBooking;
