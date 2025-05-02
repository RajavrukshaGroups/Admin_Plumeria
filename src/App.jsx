import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AdminLogin from "../../Admin_Plumeria/src/pages/adminlogin";
import Dashboard from "./components/dashboard";
import AddRoomdetails from "./components/addRoomdetails";
import RoomsTable from "./components/roomsTable";
import EditRoomDetails from "./components/EditRoomDetails";
import Sidebar from "./components/sidebar";
import AddRoomTypeForm from "./components/addroomType";
import PrivateRoute from "./components/PrivateRoute";
import RoomAvailability from "./pages/updateRoomAvailability";
import UpdateRoomAvailability from "./components/updateRoomAvailability";
import RoomAvailabilityMain from "./pages/updateRoomAvailability";
import EditRoomAvailability from "./components/editRoomAvailability";
import EditRoomAvailabilityForm from "./components/editRoomAvailability";
import AdminCreateBooking from "./components/adminCreateBooking";
import ViewBookingDetails from "./components/viewBookingDetails";
import BookingListByDate from "./components/bookingDetailsByDate";
import EditBookingDetails from "./components/editBookingDetails";
import ContactForm from "./components/mailPilot";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <Router>
      <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}
function MainLayout({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/adminlogin";
  return (
    <div className="flex">
      {/* Conditionally render Sidebar */}
      {!isLoginPage && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <div
        className={`flex-1 transition-all duration-300 ${
          !isLoginPage && sidebarOpen ? "ml-56" : "ml-0"
        }`}
        // Adjust margin based on sidebar state
>
        <Routes>
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/addRoomdetails"
            element={
              <PrivateRoute>
                <AddRoomdetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/roomsTable"
            element={
              <PrivateRoute>
                <RoomsTable />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-room/:roomId"
            element={
              <PrivateRoute>
                <EditRoomDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/addRoomType"
            element={
              <PrivateRoute>
                <AddRoomTypeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/room-availability"
            element={
              <PrivateRoute>
                <RoomAvailabilityMain />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-room-availability/:id"
            element={
              <PrivateRoute>
                <EditRoomAvailabilityForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-create-booking"
            element={
              <PrivateRoute>
                <AdminCreateBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/view-booking-details"
            element={
              <PrivateRoute>
                <ViewBookingDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/bookings/by-checkin-date"
            element={
              <PrivateRoute>
                <BookingListByDate />
              </PrivateRoute>
            }
          />
          <Route
            path="/editBookingDetails/:id"
            element={
              <PrivateRoute>
                <EditBookingDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/mailpilot"
            element={
              <PrivateRoute>
                <ContactForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
