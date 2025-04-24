import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCreditCard,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import axiosInstance from "../api/interceptors";
import { toast } from "react-hot-toast";

const AdminCreateBooking = () => {
  const initialFormState = {
    bookingId: "",
    customerName: "",
    contactInfo: {
      email: "",
      phone: "",
    },
    domainName: "",
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
  };

  const [formData, setFormData] = useState(initialFormState);
  const [roomTypes, setRoomTypes] = useState([]);
  const [plans, setPlans] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await axiosInstance.get("/rooms");
        const roomTypesData = response.data || [];
        setRoomTypes(roomTypesData);

        const roomPlans = roomTypesData.reduce((acc, room) => {
          acc[room.roomType] = room.plans || {};
          return acc;
        }, {});
        setPlans(roomPlans);
      } catch (err) {
        console.error("Failed to fetch room types:", err);
        toast.error("Failed to load room types. Please refresh the page.");
      }
    };

    fetchRoomTypes();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }

    if (!formData.contactInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contactInfo.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.checkInDate) {
      errors.checkInDate = "Check-in date is required";
    }

    if (!formData.checkOutDate) {
      errors.checkOutDate = "Check-out date is required";
    } else if (
      formData.checkInDate &&
      new Date(formData.checkOutDate) < new Date(formData.checkInDate)
    ) {
      errors.checkOutDate = "Check-out date cannot be before check-in date";
    }

    if (formData.totalRooms <= 0) {
      errors.totalRooms = "At least one room is required";
    }

    // Validate each room's details
    formData.totalGuests.forEach((guest, index) => {
      if (!guest.roomType) {
        errors[`roomType_${index}`] = `Room type for Room ${
          index + 1
        } is required`;
      }
      if (guest.persons <= 0) {
        errors[`persons_${index}`] = `Number of persons for Room ${
          index + 1
        } must be at least 1`;
      }
    });

    if (formData.totalCost <= 0) {
      errors.totalCost = "Total cost must be greater than 0";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalRooms") {
      const roomCount = parseInt(value, 10) || 0;
      updateRoomCount(roomCount);
    } else {
      handleInputChange(e);
    }
  };

  const updateRoomCount = (roomCount) => {
    setFormData((prev) => {
      const currentGuests = [...prev.totalGuests];
      let updatedGuests;

      if (roomCount > currentGuests.length) {
        const additionalGuests = Array.from(
          { length: roomCount - currentGuests.length },
          () => ({
            roomType: "",
            persons: 1,
            adult: 1,
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
  };

  const handleGuestChange = (index, field, value) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    // Prevent multiple leading zeros
    if (value.length > 1 && value.startsWith("0")) return;

    const updatedGuests = [...formData.totalGuests];
    updatedGuests[index][field] = value === "" ? "" : parseInt(value, 10) || 0;

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
          const additionalGuests = Array.from(
            { length: updatedRoomCount - currentGuests.length },
            () => ({
              roomType: "",
              persons: 1,
              adult: 1,
              children: 0,
              planName: "",
            })
          );
          updatedGuests = [...currentGuests, ...additionalGuests];
        } else {
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

    if (name === "contactInfo.phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          phone: numericValue,
        },
      }));
      return;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating booking..."); // Add loading toast

    try {
      // Split customer name into first and last name
      const [firstName, ...lastNameParts] = formData.customerName.split(" ");
      const lastName = lastNameParts.join(" ") || "";

      // Transform room data to match backend structure
      const selectedRooms = formData.totalGuests.map((guest) => ({
        roomType: guest.roomType,
        count: 1, // Assuming 1 room per entry
        persons: Number(guest.persons),
        adults: Number(guest.adult),
        children: Number(guest.children),
        planName: guest.planName,
      }));

      // Prepare the request body
      const requestBody = {
        domainName: formData.domainName,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        selectedRooms: selectedRooms,
        guestDetails: {
          firstName,
          lastName,
          email: formData.contactInfo.email,
          phone: formData.contactInfo.phone,
          specialRequests: formData.specialRequests[0] || "",
        },
        advancePayment: Number(formData.payment.amountPaid),
        remainingAmount: Number(formData.payment.balanceDue),
        totalAmount: Number(formData.totalCost),
        paymentMethod: formData.payment.method,
      };

      const response = await axiosInstance.post("/rooms/booking", requestBody);

      toast.success("Booking created successfully!", {
        id: toastId,
        duration: 4000,
      });
      // Reset form after successful submission
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create booking";
      toast.error(`Error: ${errorMessage}`, {
        id: toastId,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-md w-full">
            <div className="inline-flex items-center justify-center mb-4">
              <FaSpinner className="animate-spin text-4xl text-blue-500 mr-3" />
              <span className="text-xl font-semibold">
                Processing Booking...
              </span>
            </div>
            <p className="text-gray-600">
              Please wait while we save your booking details
            </p>
          </div>
        </div>
      )}
      <div
        className={`max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-200 ${
          isSubmitting ? "opacity-50" : ""
        }`}
      >
        {" "}
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
                error={validationErrors.customerName}
                required
              />
              <TextInput
                icon={<FaUser />}
                label="Domain Name"
                name="domainName"
                value={formData.domainName}
                onChange={handleInputChange}
                // error={validationErrors.customerName}
                // required
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
                error={validationErrors.email}
                required
              />
              <TextInput
                icon={<FaPhone />}
                label="Phone"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleInputChange}
                error={
                  formData.contactInfo.phone.length > 0 &&
                  formData.contactInfo.phone.length !== 10
                    ? "Phone number must be 10 digits"
                    : null
                }
                required
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
                error={validationErrors.checkInDate}
                required
              />
              <TextInput
                icon={<FaCalendarAlt />}
                type="date"
                label="Check-Out Date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                error={validationErrors.checkOutDate}
                min={
                  formData.checkInDate
                    ? new Date(formData.checkInDate).toISOString().split("T")[0]
                    : ""
                }
                required
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
              {validationErrors.totalRooms && (
                <p className="text-red-500 text-sm">
                  {validationErrors.totalRooms}
                </p>
              )}
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
                      className={`w-full border ${
                        validationErrors[`roomType_${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      required
                    >
                      <option value="">Select a room type</option>
                      {roomTypes.map((room) => (
                        <option key={room._id} value={room.roomType}>
                          {room.roomType}
                        </option>
                      ))}
                    </select>
                    {validationErrors[`roomType_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors[`roomType_${index}`]}
                      </p>
                    )}
                  </div>

                  <TextInput
                    label="Persons"
                    type="number"
                    min={1}
                    value={guest.persons}
                    onChange={(e) =>
                      handleGuestChange(index, "persons", e.target.value)
                    }
                    error={validationErrors[`persons_${index}`]}
                    required
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
                          <option key={plan} value={plan.name}>
                            {plan.name}
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
              min={0}
              step="0.01"
              value={formData.totalCost}
              onChange={handleInputChange}
              error={validationErrors.totalCost}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                icon={<FaCreditCard />}
                label="Payment Method"
                name="payment.method"
                value={formData.payment.method}
                onChange={handleInputChange}
              />
              <TextInput
                label="Amount Paid"
                type="number"
                name="payment.amountPaid"
                min={0}
                step="0.01"
                value={formData.payment.amountPaid}
                onChange={handleInputChange}
              />
            </div>
            <TextInput
              label="Balance Due"
              type="number"
              name="payment.balanceDue"
              min={0}
              step="0.01"
              value={formData.payment.balanceDue}
              onChange={handleInputChange}
            />
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
                min={0}
                step="0.01"
                value={formData.discount.amount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300 flex items-center justify-center mx-auto min-w-[180px] ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Create Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Section Title
const SectionTitle = ({ title }) => (
  <h3 className="text-xl font-semibold border-b pb-1 text-gray-700">{title}</h3>
);

// Reusable Input Component
const TextInput = ({
  icon,
  label,
  name,
  value,
  type = "text",
  onChange,
  error,
  required = false,
  min,
  step,
  ...props
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium mb-1 text-gray-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
    )}
    <div
      className={`flex items-center border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-lg p-2`}
    >
      {icon && <div className="mr-2 text-gray-500">{icon}</div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full focus:outline-none"
        min={min}
        step={step}
        {...props}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default AdminCreateBooking;
