import { useState } from "react";
import { Link } from "react-router-dom";
import { CIcon } from '@coreui/icons-react';
import { cilList, cilShieldAlt } from '@coreui/icons';
import { FaHome, FaBed, FaPlusSquare, FaListAlt } from "react-icons/fa";
import { MdRoomPreferences } from "react-icons/md";


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  console.log("sidebaropen",sidebarOpen);
  return (
    <div className="relative flex items-start">
      {/* Toggle Button */}
      <div className="fixed top-0 z-40 transition-all duration-300">
        <div className="flex justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`transition-all duration-300 w-8 p-1 mx-3 my-2 rounded-full focus:outline-none ${
              sidebarOpen ? "hover:bg-gray-700" : "hover:bg-gray-300"
            }`}
          >
            
             <svg
              viewBox="0 0 20 20"
              className={`w-6 h-6 fill-current ${
                sidebarOpen ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {!sidebarOpen ? (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              )}
            </svg> 
           
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-30 h-full min-h-screen overflow-y-auto overflow-x-hidden text-gray-400 transition-all duration-300 ease-in-out bg-gray-900 shadow-lg ${
          sidebarOpen ? "w-56" : "w-0"
        }`}
      >
        
        <div className="flex flex-col items-stretch justify-between h-full">
          {/* Header */}
          <div className="flex flex-col flex-shrink-0 w-full">
            <div className="flex items-center justify-center px-8 py-3 text-center">
              <a href="#" className="text-lg leading-normal text-gray-200">
                My App
              </a>
            </div>

            {/* Navigation */}
            <nav>
              <div
                className={`flex-grow md:block md:overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${
                  sidebarOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Dashboard Link */}
                <Link
                    className="flex justify-start items-center px-4 py-3 hover:bg-gray-800 hover:text-gray-400 focus:bg-gray-800 focus:outline-none focus:ring"
                    to="/"
                  >
                    <FaHome className="text-lg text-white" />
                    <span className="mx-4 text-white">Dashboard</span>
                  </Link>
              </div>


              <div
                className={`flex-grow md:block md:overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${
                  sidebarOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Dashboard Link */}
                <Link
                      className="flex justify-start items-center px-4 py-3 hover:bg-gray-800 hover:text-gray-400 focus:bg-gray-800 focus:outline-none focus:ring"
                      to="/addRoomType"
                    >
                      <MdRoomPreferences className="text-lg text-white" />
                      <span className="mx-4 text-white">Add Rooms Type</span>
                    </Link>

                    <Link
                          className="flex justify-start items-center px-4 py-3 hover:bg-gray-800 hover:text-gray-400 focus:bg-gray-800 focus:outline-none focus:ring"
                          to="/addRoomdetails"
                        >
                          <FaPlusSquare className="text-lg text-white" />
                          <span className="mx-4 text-white">Add Room</span>
                        </Link>
                        <Link
                          className="flex justify-start items-center px-4 py-3 hover:bg-gray-800 hover:text-gray-400 focus:bg-gray-800 focus:outline-none focus:ring"
                          to="/roomsTable"
                        >
                          <FaListAlt className="text-lg text-white" />
                          <span className="mx-4 text-white">Rooms Table</span>
                        </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
