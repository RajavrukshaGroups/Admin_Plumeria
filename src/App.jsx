import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminLogin from "../../Admin_Plumeria/src/pages/adminlogin";
import Dashboard from './components/dashboard';
import AddRoomdetails from './components/addRoomdetails';
import RoomsTable from './components/roomsTable';
import EditRoomDetails from './components/EditRoomDetails';
import Sidebar from './components/sidebar';

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
        </Routes>
      </div>
    </div>
  );
}

export default App;

