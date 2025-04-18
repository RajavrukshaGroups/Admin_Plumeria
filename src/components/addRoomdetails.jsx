import { useState } from "react";
import axiosInstance from "../api/interceptors";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";


function AddRoomdetails() {
  const navigate = useNavigate();
  // Basic Room fields
  const [roomType, setRoomType] = useState("");
  const [maxRoomsAvailable, setMaxRoomsAvailable] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  // Capacity
  const [maxPersons, setMaxPersons] = useState("");
  const [maxAdults, setMaxAdults] = useState("");
  const [maxChildren, setMaxChildren] = useState("");
  // Room Info
  const [roomInfo, setRoomInfo] = useState("");
  const [bedType, setBedType] = useState("");
  const [terms, setTerms] = useState("");
  // Amenities and Plans
  const [amenities, setAmenities] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [plans, setPlans] = useState([]);
  
  // File Upload
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [menuDetails, setMenuDetails] = useState({
    welcomeDrinks: [],
    breakFast: [],
    dinner: [],
    snacks: []
  });
  

  console.log(amenities,'amenities check')

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);
  //   const totalFiles = files.length + selectedFiles.length;
  //   if (totalFiles > 4) {
  //     alert("You can only upload up to 4 images.");
  //     return;
  //   }
  //   const updatedFiles = [...files, ...selectedFiles];
  //   const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
  //   setFiles(updatedFiles);
  //   setPreviews((prev) => [...prev, ...newPreviews]);
  // };v

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = files.length + selectedFiles.length;
  
    if (totalFiles > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
  
    setFiles(prev => [...prev, ...selectedFiles]);
  
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };
  
  const removeImage = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];
  
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
  
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };
  

  const handleAddAmenity = () => {
    if (inputValue.trim() !== "" && !amenities.includes(inputValue.trim())) {
      setAmenities([...amenities, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveAmenity = (index) => {
    const newAmenities = [...amenities];
    newAmenities.splice(index, 1);
    setAmenities(newAmenities);
  };

  const handleAddPlan = () => {
    setPlans([
      ...plans,
      {
        name: "",
        twoGuestsWithGST: "",
        twoGuestsWithoutGST: "",
        extraAdultWithGST: "",
        extraAdultWithoutGST: "",
        complimentary: "",
        menuDetails: {
          welcomeDrinks: [],
          breakFast: [],
          dinner: [],
          snacks: []
        },
        services: [],
      },
    ]);
  };

  const handleRemovePlan = (index) => {
    const updatedPlans = plans.filter((_, i) => i !== index);
    setPlans(updatedPlans);
  };

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index][field] = value;
    setPlans(updatedPlans);
  };
  const handleMenuChange = (e, type) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setMenuDetails(prev => ({
      ...prev,
      [type]: values
    }));
  };
  const handleMenuDetailChange = (index, type, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index].menuDetails[type] = value.split(',').map(item => item.trim());
    setPlans(updatedPlans);
  };
  
  

const handleSubmit = async (e) => {
  e.preventDefault();
  const roomData = {
    roomType,
    maxRoomsAvailable: parseInt(maxRoomsAvailable, 10),
    checkIn,
    checkOut,
    capacity: {
      maxPersons: parseInt(maxPersons, 10),
      maxAdults: parseInt(maxAdults, 10),
      maxChildren: parseInt(maxChildren, 10),
    },
    roomInfo: {
      description: roomInfo,
      bed: bedType,
    },
    terms,
    amenities,
    plans: plans.map((plan) => ({
      name: plan.name,
      price: {
        twoGuests: {
          withGst: parseFloat(plan.twoGuestsWithGST),
          withoutGst: parseFloat(plan.twoGuestsWithoutGST),
        },
        extraAdult: {
          withGst: parseFloat(plan.extraAdultWithGST),
          withoutGst: parseFloat(plan.extraAdultWithoutGST),
        },
      },
      complimentary: plan.complimentary.split(",").map((item) => item.trim()),
      services: plan.services,
      menuDetails: plan.menuDetails,
    })),
  };

  const formData = new FormData();
  formData.append("roomData", JSON.stringify(roomData));
  files.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await axiosInstance.post("/admin/rooms", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data, "this is the data");
    alert("Room added successfully!");
    navigate("/roomsTable")
  } catch (error) {
    console.error("Error saving room data:", error.response || error.message);
    alert("Failed to save room data.");
  }
};


  return (
    <div className="bg-gray-100 flex bg-local">
      <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
        <h1 className="text-3xl font-bold justify-center items-center m-auto flex underline">
          Add Room
        </h1>
        <form onSubmit={handleSubmit}>
       

          {/* Room Type */}
          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type
            </label>
            <select
              className="w-full bg-gray-200 border border-gray-300 rounded py-3 px-4"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">Select Room Type</option>
              <option value="Deluxe Rooms">Deluxe Rooms</option>
              <option value="Villa Rooms">Villa Rooms</option>
            </select>
          </div> */}


            <div className="mb-6 w-full lg:w-1/2 mx-auto">
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-900 mb-2">
                Room Type
              </label>
                      
              <div className="relative">
                <select
                  className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="">Select Room Type</option>
                  <option value="Deluxe Rooms">Deluxe Rooms</option>
                  <option value="Villa Rooms">Villa Rooms</option>
                </select>
                      
                <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

          {roomType && (
            <>
              {/* Room Info and Max Rooms */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Info
            </label>
              <div className="grid grid-cols-2 gap-4 mb-6">
            
                <input
                  className="input"
                  type="text"
                  placeholder="Room Info"
                  value={roomInfo}
                  onChange={(e) => setRoomInfo(e.target.value)}
                />
                
                <input
                  className="input"
                  type="number"
                  placeholder="Max Rooms Available"
                  value={maxRoomsAvailable}
                  onChange={(e) => setMaxRoomsAvailable(e.target.value)}
                />
              </div>

              {/* Check-in and Check-out Time Inputs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  <input
                    className="input"
                    type="time"
                    placeholder="Check-in Time"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Time
                  </label>
                  <input
                    className="input"
                    type="time"
                    placeholder="Check-out Time"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

           
              <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                      <input
                        className="input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-wrap gap-4 mt-4">
                        {previews.map((src, index) => (
                          <div key={index} className="relative w-24 h-24">
                            <img
                              src={src}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Amenities
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    className="flex-1 bg-gray-200 border border-gray-300 rounded py-3 px-4"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add an amenity"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}{" "}
                      <button
                        onClick={() => handleRemoveAmenity(i)}
                        className="ml-1 text-red-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                  Terms
                </label>
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <input
                  className="input"
                  type="text"
                  placeholder="Terms (comma separated)"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
                {/* <input
                  className="input"
                  type="text"
                  placeholder="Bed Type (King/Queen)"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                /> */}
              </div>

              {/* Plans */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Plans</h3>
                {plans.map((plan, index) => (
                  <div key={index} className="border p-4 mb-4 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name
                    </label>
                    <div className="flex justify-between items-center mb-4">
                      
                      <input
                        className="input flex-1"
                        type="text"
                        placeholder="Plan Name (e.g., Lite, Plus, Max)"
                        value={plan.name}
                        onChange={(e) =>
                          handlePlanChange(index, "name", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePlan(index)}
                        className="ml-4 text-red-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Two Guests With GST
                    </label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      
                      <input
                        className="input"
                        type="number"
                        placeholder="Two Guests With GST"
                        value={plan.twoGuestsWithGST}
                        onChange={(e) =>
                          handlePlanChange(index, "twoGuestsWithGST", e.target.value)
                        }
                      />
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                      Two Guests Without GST
                    </label>
                      <input
                        className="input"
                        type="number"
                        placeholder="Two Guests Without GST"
                        value={plan.twoGuestsWithoutGST}
                        onChange={(e) =>
                          handlePlanChange(index, "twoGuestsWithoutGST", e.target.value)
                        }
                      />
                      <input
                        className="input"
                        type="number"
                        placeholder="Extra Adult With GST"
                        value={plan.extraAdultWithGST}
                        onChange={(e) =>
                          handlePlanChange(index, "extraAdultWithGST", e.target.value)
                        }
                      />
                      <input
                        className="input"
                        type="number"
                        placeholder="Extra Adult Without GST"
                        value={plan.extraAdultWithoutGST}
                        onChange={(e) =>
                          handlePlanChange(index, "extraAdultWithoutGST", e.target.value)
                        }
                      />
                    </div> */}
                    <div className="grid grid-cols-2 gap-4 mb-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Two Guests With GST
                  </label>
                  <input
                    className="input"
                    type="number"
                    placeholder="Two Guests With GST"
                    value={plan.twoGuestsWithGST}
                    onChange={(e) =>
                      handlePlanChange(index, "twoGuestsWithGST", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Two Guests Without GST
                  </label>
                  <input
                    className="input"
                    type="number"
                    placeholder="Two Guests Without GST"
                    value={plan.twoGuestsWithoutGST}
                    onChange={(e) =>
                      handlePlanChange(index, "twoGuestsWithoutGST", e.target.value)
                    }
                    />
                    </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Two Guests With GST
                  </label>
                  <input
                        className="input"
                        type="number"
                        placeholder="Extra Adult With GST"
                        value={plan.extraAdultWithGST}
                        onChange={(e) =>
                          handlePlanChange(index, "extraAdultWithGST", e.target.value)
                        }
                      />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Two Guests Without GST
                  </label>
                 <input
                        className="input"
                        type="number"
                        placeholder="Extra Adult Without GST"
                        value={plan.extraAdultWithoutGST}
                        onChange={(e) =>
                          handlePlanChange(index, "extraAdultWithoutGST", e.target.value)
                        }
                      /> 
                    </div>


                    
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                   complimentary
                  </label>
                    <input
                      className="input mb-4"
                      type="text"
                      placeholder="Complimentary (comma separated)"
                      value={plan.complimentary}
                      onChange={(e) =>
                        handlePlanChange(index, "complimentary", e.target.value)
                      }
                    />
                <div className="mt-4">
                  <label className="block font-medium mb-1">Menu Details</label>
                  {["welcomeDrinks", "breakFast", "dinner", "snacks"].map((type) => (
                    <div className="mb-2" key={type}>
                      <label className="block text-sm capitalize text-gray-700 mb-1">
                        {type.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type="text"
                        className="input w-full"
                        placeholder={`Enter ${type} (comma separated)`}
                        value={plans[index].menuDetails[type]?.join(", ") || ""}
                        onChange={(e) =>
                          handleMenuDetailChange(index, type, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>

                    <section>
                      <label
                        className="uppercase tracking-wide text-black text-xs font-bold mb-2"
                        htmlFor="capacity"
                      >
                        Capacity
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                          type="number"
                          placeholder="Max Persons"
                          onChange={(e) => setMaxPersons(e.target.value)}
                        />
                        <input
                          className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                          type="number"
                          placeholder="Max Adults"
                          onChange={(e) => setMaxAdults(e.target.value)}
                        />
                        <input
                          className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                          type="number"
                          placeholder="Max Children"
                          onChange={(e) => setMaxChildren(e.target.value)}
                        />
                      </div>
                    </section>
                    <div className="flex gap-4 flex-wrap">
                      {["WiFi", "Breakfast", "Spa", "Taxes Included"].map((service) => (
                        <label key={service} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={plan.services.includes(service)}
                            onChange={(e) => {
                              const updatedServices = e.target.checked
                                ? [...plan.services, service]
                                : plan.services.filter((s) => s !== service);
                              handlePlanChange(index, "services", updatedServices);
                            }}
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPlan}
                  className="bg-blue-300 text-white px-4 py-2 rounded"
                >
                  Add Plan
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Save Room
          </button>
        </form>
      </div>
    </div>
  );
}

const style = document.createElement("style");
style.textContent = `.input { 
  width: 100%; padding: 0.75rem 1rem; 
  border: 1px solid #d1d5db; 
  border-radius: 0.5rem; 
  background-color: #f3f4f6; 
  outline: none; 
  font-size: 0.875rem; 
}`;
document.head.appendChild(style);

export default AddRoomdetails;