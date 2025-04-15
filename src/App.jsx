import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from "../../Admin_Plumeria/src/pages/adminlogin"
import Dashboard from './components/dashboard';
import AddRoomdetails from './components/addRoomdetails';
import RoomsTable from './components/roomsTable';
function App() {
  return (
   <Router>
    <div>
      <Routes>  
        <Route path="/" element={<Dashboard/>} />
        <Route path="/adminlogin" element={<AdminLogin/>} />
        <Route path="/addRoomdetails" element={<AddRoomdetails/>} />
        <Route path="/roomsTable" element={<RoomsTable/>} />
      </Routes>
    </div>
   </Router>
  )
}

export default App
