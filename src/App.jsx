import React from 'react'
// import AdminLogin from './components/adminLogin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from "../../Admin_Plumeria/src/pages/adminlogin"
import Dashboard from './components/dashboard';
import RoomManagement from './pages/roomManagement';
import CreateRoom from './components/createRoom';
import AddRoomdetails from './components/addRoomdetails';
import RoomsTable from './components/roomsTable';
function App() {
  return (
   <Router>
    <div>
      <Routes>  
        <Route path="/" element={<Dashboard/>} />
        <Route path="/adminlogin" element={<AdminLogin/>} />
        <Route path="/roomManagement" element={<RoomManagement/>} />
        <Route path="/createRoom" element={<CreateRoom/>} />
        <Route path="/roomsTable" element={<RoomsTable/>} />
      </Routes>
    </div>
   </Router>
  )
}

export default App
