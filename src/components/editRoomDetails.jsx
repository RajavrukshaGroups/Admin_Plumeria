import { useEffect, useState } from "react";
import axiosInstance from "../api/interceptors";
import { useParams, useNavigate } from "react-router-dom";
import { editRoomDetails,getRoomById ,getAllRoomTypes} from "../api/auth";

function EditRoomDetails() {
  const [roomTypes, setRoomTypes] = useState([]);

  const { roomId } = useParams(); // assuming you're passing :roomId in your route
  const navigate = useNavigate();
  // State declarations same as AddRoomdetails
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [maxRoomsAvailable, setMaxRoomsAvailable] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxPersons, setMaxPersons] = useState("");
  const [maxAdults, setMaxAdults] = useState("");
  const [maxChildren, setMaxChildren] = useState("");
  const [roomInfo, setRoomInfo] = useState("");
  const [bedType, setBedType] = useState("");
  const [terms, setTerms] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [plans, setPlans] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  console.log(plans,'plans in edit room details');
  
  
useEffect(() => {
  async function fetchData() {
    try {
      const roomTypeRes = await getAllRoomTypes();
      setRoomTypes(roomTypeRes);
      console.log(roomTypeRes, "roomTypeRes in useEffect");

      const room = await getRoomById(roomId);
      console.log(room, "room in useEffect");
      if (room) {
        setRoomType(room.roomType || "");
        setMaxRoomsAvailable(room.maxRoomsAvailable || "");
        setCheckIn(room.checkIn || "");
        setCheckOut(room.checkOut || "");
        setMaxPersons(room.capacity?.maxPersons || "");
        setMaxAdults(room.capacity?.maxAdults || "");
        setMaxChildren(room.capacity?.maxChildren || "");
        setRoomInfo(room.roomInfo?.description || "");
        setBedType(room.roomInfo?.bed || "");
        setTerms(room.roomInfo?.terms || []);
        setAmenities(room.roomInfo?.amenities || []);
        // setPlans(room.plans || []);
        const transformedPlans = (room.plans || []).map((plan) => {
          const serviceObj = plan.services || {};
          const serviceArray = Object.entries(serviceObj)
            .filter(([_, value]) => value)
            .map(([key]) => key);
          
          return {
            ...plan,
            services: serviceArray,
          };
        });
        setPlans(transformedPlans);
        
        if (room.images) setPreviews(room.images);
      } else {
        console.error("Room not found");
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  }

  if (roomId) {
    console.log(roomId, 'roomId in useEffect');
    fetchData();
  }
}, [roomId]);



  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...previewUrls]);
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
    if (inputValue.trim()) {
      setAmenities([...amenities, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveAmenity = (index) => {
    const updated = [...amenities];
    updated.splice(index, 1);
    setAmenities(updated);
  };

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value,
    };
    setPlans(updatedPlans);
  };
  
  
const handleNestedPlanChange = (index, path, value) => {
  const updatedPlans = [...plans];
  let current = updatedPlans[index];

  // Traverse the path to update the nested field
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    current[key] = current[key] || {};
    current = current[key];
  }

  current[path[path.length - 1]] = value;
  setPlans(updatedPlans);
};


  const handleRemovePlan = (index) => {
    const updated = [...plans];
    updated.splice(index, 1);
    setPlans(updated);
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
          snacks: [],
        },
        services: [],
      },
    ]);
  };

  const validateFields = () => {
    // if (!roomType.trim()) return "Room type is required.";
    if (!maxRoomsAvailable || isNaN(maxRoomsAvailable)) return "Max rooms available must be a valid number.";
    if (!checkIn.trim() || !checkOut.trim()) return "Check-in and check-out times are required.";
    if (!maxPersons || isNaN(maxPersons)) return "Max persons must be a valid number.";
    if (!maxAdults || isNaN(maxAdults)) return "Max adults must be a valid number.";
    if (!maxChildren || isNaN(maxChildren)) return "Max children must be a valid number.";
    if (!roomInfo.trim()) return "Room description is required.";
    if (!bedType.trim()) return "Bed type is required.";
    if (!Array.isArray(plans) || plans.length === 0) return "At least one plan is required.";
    return null;
  };

  const handleUpdate = async (e) => {

    e.preventDefault();
    const error = validateFields();
    if (error) {
      alert(error);
      return;
    }
    
    setLoading(true);  // Show loader

    const updatedRoomData = {
      // roomType,
      maxRoomsAvailable: parseInt(maxRoomsAvailable),
      checkIn,
      checkOut,
      capacity: {
        maxPersons: parseInt(maxPersons),
        maxAdults: parseInt(maxAdults),
        maxChildren: parseInt(maxChildren),
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
            withGst: parseFloat(plan.price?.twoGuests?.withGst) || 0,
            withoutGst: parseFloat(plan.price?.twoGuests?.withoutGst) || 0,
          },
          extraAdult: {
            withGst: parseFloat(plan.price?.extraAdult?.withGst) || 0,
            withoutGst: parseFloat(plan.price?.extraAdult?.withoutGst) || 0,
          },
        },
        complimentary: Array.isArray(plan.complimentary)
          ? plan.complimentary
          : (plan.complimentary || "").split(",").map(item => item.trim()),
        services: plan.services || [],
        menuDetails: plan.menuDetails || {},
      }))
   
    };

    const formData = new FormData();
    formData.append("roomData", JSON.stringify(updatedRoomData));
    files.forEach((file) => formData.append("images", file));

    try {
      const response = await editRoomDetails(roomId, formData);
      alert("Room updated successfully!");
      navigate("/roomsTable");
    } catch (err) {
      console.error("Error updating room:", err.response || err.message);
      alert("Failed to update room.");
    } finally {
      setLoading(false); // Hide loader
    }
  };
const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-200 outline-none text-sm";


  return (
    // <div className="bg-gray-100 flex bg-local">
    //   <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
    <div className="bg-gradient-to-tr from-gray-100 via-white to-gray-100 min-h-screen py-12">
    <div className="max-w-6xl mx-auto bg-white rounded-1xl shadow-2xl px-8 md:px-16 py-12">
      <div className="text-center mb-8">
    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-purple-700 to-yellow-400 drop-shadow-lg tracking-wide underline decoration-wavy decoration-2 underline-offset-8">
      Edit Room
    </h1>
  </div>
        {/* <h1 className="text-3xl font-bold justify-center items-center m-auto flex underline">
          Edit Room
        </h1> */}
        <form onSubmit={handleUpdate}>
      
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
                {roomTypes.map((type, index) => (
                  <option key={index} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div> */}
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
              {/* Room Info and Max Rooms */}
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Info
              </label>
                <input
                   className={inputClass}
                  type="text"
                  placeholder="Room Info"
                  value={roomInfo}
                  onChange={(e) => setRoomInfo(e.target.value)}
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Rooms
              </label>
                <input
                   className={inputClass}
                  type="number"
                  placeholder="Max Rooms Available"
                  value={maxRoomsAvailable}
                  onChange={(e) => setMaxRoomsAvailable(e.target.value)}
                />
                </div>
               

           
              </div>
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bed Info
            </label>
            <input
                  className={inputClass}
                  type="text"
                  placeholder="Bed Info"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                />
            </div>
              {/* Check-in and Check-out Time Inputs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  <input
                     className={inputClass}
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
                     className={inputClass}
                    type="time"
                    placeholder="Check-out Time"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                      <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition-all"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                      
                        {/* <input  type="file" multiple accept="image/*" onChange={handleFileChange} class="hidden" /> */}
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
                          value={maxPersons}
                          onChange={(e) => setMaxPersons(e.target.value)}
                        />
                        <input
                          className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                          type="number"
                          placeholder="Max Adults"
                          value={maxAdults}
                          onChange={(e) => setMaxAdults(e.target.value)}
                        />
                        <input
                          className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                          type="number"
                          placeholder="Max Children"
                          value={maxChildren}
                          onChange={(e) => setMaxChildren(e.target.value)}
                        />
                      </div>
                    </section>
              </div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Terms
              </label>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                  className={`${inputClass} `}
                  type="text"
                  placeholder="Terms (comma separated)"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
              </div>
              {/* Plans */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 border-b">Plans</h3>
                {plans.map((plan, index) => (
                  // <div key={index} className="border p-4 mb-4 rounded">
                  <div className="bg-gray-50 p-6 rounded-xl shadow-inner mb-6">

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
                    <div className="grid grid-cols-2 gap-4 mb-4">
                <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Two Guests With GST
                  </label>
                      <input
                         className={inputClass}
                        type="number"
                        placeholder="Two Guests With GST"
                        value={plan.price?.twoGuests?.withGst || ""}
                        onChange={(e) =>
                          handleNestedPlanChange(index, ["price", "twoGuests", "withGst"], e.target.value)
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
                        value={plan.price?.twoGuests?.withoutGst || ""}
                        onChange={(e) =>
                          handleNestedPlanChange(index, ["price", "twoGuests", "withoutGst"], e.target.value)
                        }
                      />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extra Adult With GST
                  </label>
                   <div>
                 <div>
               
                 <input
                         className={inputClass}
                        type="number"
                        placeholder="Extra Adult With GST"
                        value={plan.price?.extraAdult?.withGst || ""}
                        onChange={(e) =>
                          handleNestedPlanChange(index, ["price", "extraAdult", "withGst"], e.target.value)
                        }
                      />
                 </div>
                   </div>
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extra Adult Without GST
                  </label>
                    <input
                         className={inputClass}
                        type="number"
                        placeholder="Extra Adult Without GST"
                        value={plan.price?.extraAdult?.withoutGst || ""}
                       onChange={(e) =>
                         handleNestedPlanChange(index, ["price", "extraAdult", "withoutGst"], e.target.value)
                       }
                      />
                    </div>
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complimentary (comma separated)
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
                                  {type.replace(/([A-Z])/g, " $1")}
                                </label>
                                <input
                                  type="text"
                                  className={inputClass}
                                  placeholder={`Enter ${type} (comma separated)`}
                                  value={plan.menuDetails?.[type]?.join(", ") || ""}
                                  onChange={(e) =>
                                    handleNestedPlanChange(index, ["menuDetails", type], e.target.value.split(",").map((item) => item.trim()))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                  

                    <div className="flex gap-4 flex-wrap">
                      {["WiFi", "breakfast", "spa", "taxesIncluded"].map(
                        (service) => (
                          <label
                            key={service}
                            className="flex items-center gap-2 text-sm"
                          >
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={Array.isArray(plan.services) && plan.services.includes(service)}
                          onChange={(e) => {
                            const currentServices = Array.isArray(plan.services) ? plan.services : [];
                            const updatedServices = e.target.checked
                              ? [...currentServices, service]
                              : currentServices.filter((s) => s !== service);

                            handlePlanChange(index, "services", updatedServices);
                          }}
                        />
                            {service}
                          </label>
                        )
                      )}
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

          <button
            type="submit"
            className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
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

export default EditRoomDetails;
