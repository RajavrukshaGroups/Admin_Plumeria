import React, { useState, useEffect } from "react";
import axiosInstance from "../api/interceptors";
const ViewBookingDetails = () => {
  const [bookingDetails, setBookingDetails] = useState([]);

  console.log("booking details", bookingDetails);

  useEffect(() => {
    axiosInstance
      .get("/admin/viewallbookings")
      .then((data) => setBookingDetails(data.data)) // data already contains response body
      .catch((err) => console.error("Failed to fetch room types:", err));
  }, []);
  return <h1>View Booking Details</h1>;
};

export default ViewBookingDetails;
