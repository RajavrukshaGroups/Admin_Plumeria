import { useNavigate } from "react-router-dom";

const MainRoomAvailability = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
        <div
          onClick={() => navigate("/room-availability")}
          className="cursor-pointer border rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300 bg-white max-w-md w-full"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Update Room Availability
          </h3>
          <p className="text-gray-600">
            Click here to manage or update room availability details.
          </p>
        </div>

        <div
          onClick={() => navigate("/admin-create-booking")}
          className="cursor-pointer border rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300 bg-white max-w-md w-full"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Create Booking
          </h3>
          <p className="text-gray-600">
            Click here to create the booking details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainRoomAvailability;
