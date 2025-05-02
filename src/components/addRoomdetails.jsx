import { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { addRoomDetails,getAllRoomTypes } from "../api/auth";
import axiosInstance from "../api/interceptors";
import { showSuccessToast,showErrorToast  } from "../../src/components/utils/toastHelper"; // Adjust path as needed

function AddRoomdetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  // Basic Room fields
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
  const [roomDatas, setRoomDatas] = useState([]);
  const [menuDetails, setMenuDetails] = useState({
    welcomeDrinks: [],
    breakFast: [],
    dinner: [],
    snacks: []
  });
  
  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        const data = await getAllRoomTypes();
        const response = await axiosInstance.get("/rooms");
        setRoomDatas(response.data); // Save rooms to state
        setRoomTypes(data);
      } catch (err) {
        console.error("Failed to load room types", err);
      }
    }
    fetchRoomTypes();
  }, []);
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > 4) {
      showErrorToast("You can only upload up to 4 images.");
      return;
    }
    const updatedFiles = [...files, ...selectedFiles];
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFiles(updatedFiles);
    setPreviews((prev) => [...prev, ...newPreviews]);
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

  const handleMenuDetailChange = (index, type, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index].menuDetails[type] = value.split(',').map(item => item.trim());
    setPlans(updatedPlans);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
    // Basic frontend validation
    if (!roomType || !roomInfo || !maxRoomsAvailable || !checkIn || !checkOut) {
      showErrorToast("Please fill out all required fields.");
      return;
    }
  if (files.length === 0) {
    showErrorToast("Please upload at least one image.");
    return;
  }
  if (plans.length === 0) {
    showErrorToast("Please add at least one plan.");
    return;
  }
   if (isNaN(maxRoomsAvailable) || maxRoomsAvailable <= 0) {
    showErrorToast("Max rooms must be a positive number.");
    return;
  }
  setLoading(true) ; 
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
    const response =await addRoomDetails(formData)
    console.log(response.data, "this is the data");
    showSuccessToast("Room added successfully!");
    navigate("/roomsTable")
  } catch (error) {
    console.error("Error saving room data:", error.response || error.message);
    showErrorToast("Failed to save room data.");
  } finally {
    setLoading(false); // Hide loader
  }
};
const inputClass = "w-full bg-gray-200 border border-gray-300 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-4 py-3 transition-all duration-300 shadow-sm";
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex items-center justify-center p-4">
  <div className="bg-white w-full max-w-6xl mx-auto rounded-3xl border border-gray-200 shadow-2xl px-10 py-16">
  <div className="text-center mb-8">
    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-purple-700 to-yellow-400 drop-shadow-lg tracking-wide underline decoration-wavy decoration-2 underline-offset-8">
      Add Room
    </h1>
  </div>
        <form onSubmit={handleSubmit}>
            <div className="mb-6 w-full lg:w-1/2 mx-auto bg-white border border-gray-200 shadow-md rounded-xl p-6">
              <label className="block text-base font-semibold text-gray-700 :text-gray-900 mb-2">
                Room Type
              </label>
                <div>
                  <select
                    className="appearance-none w-full bg-white dark:bg-gray-200 border border-gray-300 text-gray-800 rounded-lg px-4 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="">Select Room Type</option>
                    
                            {roomTypes.map((type, index) => {
                          const isDisabled = roomDatas.some(room => room.roomType === type.name);
                          return (
                            <option key={index} value={type.name} disabled={isDisabled}>
                              {type.name} {isDisabled ? '(Already Added)' : ''}
                            </option>
                          );
                        })}
                          </select>
                        </div>
                            </div>
                            {loading ? (
                    <div className="text-center py-4">
                      <svg
                        className="animate-spin h-6 w-6 text-blue-600 mx-auto mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      <p className="text-gray-700">Submitting, please wait...</p>
                    </div>
                  ) : (
                    <>
                     <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Room Info</label>
                          <input
                            className={`${inputClass} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="text"
                            placeholder="Room Info"
                            value={roomInfo}
                            onChange={(e) => setRoomInfo(e.target.value)}
                            disabled={!roomType}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bed</label>
                          <input
                            className={`${inputClass} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="text"
                            placeholder="Bed Type"
                            value={bedType}
                            onChange={(e) => setBedType(e.target.value)}
                            disabled={!roomType}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Rooms</label>
                          <input
                            className={`${inputClass} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="number"
                            placeholder="Max Rooms Available"
                            value={maxRoomsAvailable}
                            onChange={(e) => setMaxRoomsAvailable(e.target.value)}
                            disabled={!roomType}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                          <input
                            className={`${inputClass} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="time"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            disabled={!roomType}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
                          <input
                            className={`${inputClass} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="time"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            disabled={!roomType}
                          />
                        </div>
                      </div>
              <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images
                    </label>
                  <div className="flex items-center justify-center w-full">
                      <label for="dropzone-file"
                      className={`${'flex  flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 :hover:bg-gray-800 :bg-gray-700 hover:bg-gray-300 :border-gray-600 :hover:border-gray-500 :hover:bg-gray-600'} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-500 :text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 :text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-gray-500 :text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                          </div>
                          <input id="dropzone-file" type="file" multiple accept="image/*" onChange={handleFileChange} class="hidden" />
                      </label>
                  </div> 
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
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Amenities
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                   className={`${inputClass} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  className={`${inputClass} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="text"
                  placeholder="Terms (comma separated)"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
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
                          // className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                          className={`${'w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3'} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                        
                          type="number"
                          placeholder="Max Persons"
                          onChange={(e) => setMaxPersons(e.target.value)}
                        />
                        <input
                          // className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                          className={`${'w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3'} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                          type="number"
                          placeholder="Max Adults"
                          onChange={(e) => setMaxAdults(e.target.value)}
                        />
                        <input
                          className={`${'w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3'} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                          type="number"
                          placeholder="Max Children"
                          onChange={(e) => setMaxChildren(e.target.value)}
                        />
                      </div>
                    </section>
              {/* Plans */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Plans</h3>
                {plans.map((plan, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-inner mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name
                    </label>
                    <div className="flex justify-between items-center mb-4">
                      <input
                        className={inputClass}
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
                    <div className="grid grid-cols-2 gap-4 mb-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Two Guests With GST
                  </label>
                  <input
                    className={inputClass}
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
                    className={inputClass}
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
                        className={inputClass}
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
                        className={inputClass}
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
                      className={inputClass}
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
                        className={inputClass}
                        placeholder={`Enter ${type} (comma separated)`}
                        value={plans[index].menuDetails[type]?.join(", ") || ""}
                        onChange={(e) =>
                          handleMenuDetailChange(index, type, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
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
                  className={`${'bg-green-500 text-white px-4 py-2 rounded'} ${!roomType ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Add Plan
                </button>
              </div>
            </>
          <button
            type="submit"
            className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold flex m-auto py-3 px-6 rounded-lg"
          >
            Save Room
          </button>
             </>
            )}
        </form>
      </div>
    </div>
  );
}
export default AddRoomdetails;