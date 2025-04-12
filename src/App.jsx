import React from 'react'
// import AdminLogin from './components/adminLogin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from "../../PlumeriaAdminpanel/src/pages/adminlogin"
import Dashboard from './components/dashboard';
function App() {
  return (
   <Router>
    <div>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/adminlogin" element={<AdminLogin/>} />
      </Routes>
    </div>
   </Router>
  )
}

export default App
