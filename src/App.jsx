import React from "react";
import { Toaster } from "react-hot-toast";
// import AdminLogin from './components/adminLogin'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "../src/pages/adminlogin";
import Dashboard from "./components/dashboard";
import RoomAvailability from "./pages/updateRoomAvailability";
import UpdateRoomAvailability from "./components/updateRoomAvailability";
import RoomAvailabilityMain from "./pages/updateRoomAvailability";
import EditRoomAvailability from "./components/editRoomAvailability";
import EditRoomAvailabilityForm from "./components/editRoomAvailability";
function App() {
  return (
    <Router>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/room-availability" element={<RoomAvailabilityMain />} />
          <Route
            path="/edit-room-availability/:id"
            element={<EditRoomAvailabilityForm />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
