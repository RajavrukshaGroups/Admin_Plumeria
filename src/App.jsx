import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminLogin from "../../Admin_Plumeria/src/pages/adminlogin";
import Dashboard from './components/dashboard';
import AddRoomdetails from './components/addRoomdetails';
import RoomsTable from './components/roomsTable';
import EditRoomDetails from './components/EditRoomDetails';
import Sidebar from './components/sidebar';
import AddRoomTypeForm from './components/addroomType';

// import React from "react";
// import { Toaster } from "react-hot-toast";
// import AdminLogin from './components/adminLogin'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminLogin from "../src/pages/adminlogin";
// import Dashboard from "./components/dashboard";
import RoomAvailability from "./pages/updateRoomAvailability";
import UpdateRoomAvailability from "./components/updateRoomAvailability";
import RoomAvailabilityMain from "./pages/updateRoomAvailability";
import EditRoomAvailability from "./components/editRoomAvailability";
import EditRoomAvailabilityForm from "./components/editRoomAvailability";
import AdminCreateBooking from "./components/adminCreateBooking";
import ViewBookingDetails from "./components/viewBookingDetails";
import BookingListByDate from "./components/bookingDetailsByDate";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to control sidebar visibility

  return (
    <Router>
      <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </Router>
  );
}

function MainLayout({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  // Check if the current route is "/adminlogin"
  const isLoginPage = location.pathname === "/adminlogin";

  return (
    <div className="flex">
      {/* Conditionally render Sidebar */}
      {!isLoginPage && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          !isLoginPage && sidebarOpen ? 'ml-56' : 'ml-0'
        }`} // Adjust margin based on sidebar state
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/addRoomdetails" element={<AddRoomdetails />} />
          <Route path="/roomsTable" element={<RoomsTable />} />
          <Route path="/edit-room/:roomId" element={<EditRoomDetails />} />
          <Route path="/addRoomType" element={<AddRoomTypeForm />} />
          <Route path="/room-availability" element={<RoomAvailabilityMain />} />
          <Route
            path="/edit-room-availability/:id"
            element={<EditRoomAvailabilityForm />}
          />
          <Route
            path="/admin-create-booking"
            element={<AdminCreateBooking />}
          />
          <Route
            path="/view-booking-details"
            element={<ViewBookingDetails />}
          />
          <Route
            path="/admin/bookings/by-checkin-date"
            element={<BookingListByDate />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

