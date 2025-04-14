import React from "react";
// import AdminLogin from './components/adminLogin'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "../src/pages/adminlogin";
import Dashboard from "./components/dashboard";
import RoomAvailability from "./pages/updateRoomAvailability";
import UpdateRoomAvailability from "./components/updateRoomAvailability";
import RoomAvailabilityMain from "./pages/updateRoomAvailability";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/room-availability" element={<RoomAvailabilityMain />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
