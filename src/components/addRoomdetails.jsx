import { useState } from "react";
import axiosInstance from "../api/interceptors";


function AddRoomdetails() {
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

  console.log(amenities,'amenities check')

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
    const updatedFiles = [...files, ...selectedFiles];
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFiles(updatedFiles);
    setPreviews((prev) => [...prev, ...newPreviews]);
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Build the roomData object using state variables
//     const roomData = {
//       roomType,
//       maxRoomsAvailable: parseInt(maxRoomsAvailable, 10),
//       checkIn,
//       checkOut,
//       capacity: {
//         maxPersons: parseInt(maxPersons, 10),
//         maxAdults: parseInt(maxAdults, 10),
//         maxChildren: parseInt(maxChildren, 10),
//       },
//       roomInfo: {
//         description: roomInfo,
//         bed: bedType,
//       },
//       terms, // assume comma separated if needed, or as a string
//       amenities,
//       plans: plans.map((plan) => ({
//         name: plan.name,
//         price: {
//           twoGuests: {
//             withGst: parseFloat(plan.twoGuestsWithGST),
//             withoutGst: parseFloat(plan.twoGuestsWithoutGST),
//           },
//           extraAdult: {
//             withGst: parseFloat(plan.extraAdultWithGST),
//             withoutGst: parseFloat(plan.extraAdultWithoutGST),
//           },
//         },
//         complimentary: plan.complimentary.split(",").map((item) => item.trim()),
//         services: plan.services,
//       })),
//     };

//     // Build FormData to send JSON data and images
//     const formData = new FormData();
//     formData.append("roomData", JSON.stringify(roomData));
//     files.forEach((file) => {
//       formData.append("images", file);
//     });

//       // Log FormData for debugging
//   console.log("FormData contents:");
//   for (let [key, value] of formData.entries()) {
//     console.log(`${key}:`, value);
//   }
//   try {
//     const response = await axiosInstance.post("/admin/rooms", formData);
//     console.log(response.data, 'this is the data');
//     alert("Room added successfully!");
//   } catch (error) {
//     console.error("Error saving room data:", error.response || error.message);
//     alert("Failed to save room data.");
//   }
  
// };

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
          <div className="mb-6">
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
          </div>

          {roomType && (
            <>
              {/* Room Info and Max Rooms */}
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

              {/* File Upload */}
              <div className="mb-6">
                <input
                  className="input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="flex flex-wrap gap-4 mt-4">
                  {previews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
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

              {/* Plans */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Plans</h3>
                {plans.map((plan, index) => (
                  <div key={index} className="border p-4 mb-4 rounded">
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
                    </div>
                    <input
                      className="input mb-4"
                      type="text"
                      placeholder="Complimentary (comma separated)"
                      value={plan.complimentary}
                      onChange={(e) =>
                        handlePlanChange(index, "complimentary", e.target.value)
                      }
                    />
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


// import { useState } from "react";
// import axiosInstance from ".././api/interceptors";

// function AddRoomdetails() {
//   const [roomType, setRoomType] = useState("");
//   const [amenities, setAmenities] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [terms, setTerms] = useState("");
//   const [bedType, setBedType] = useState("");
//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [plans, setPlans] = useState([]); // State to store plans

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);

//     // Check total count including new files
//     const totalFiles = files.length + selectedFiles.length;
//     if (totalFiles > 4) {
//       alert("You can only upload up to 4 images.");
//       return;
//     }

//     // Add new files and generate previews
//     const updatedFiles = [...files, ...selectedFiles];
//     const newPreviews = selectedFiles.map((file) =>
//       URL.createObjectURL(file)
//     );

//     setFiles(updatedFiles);
//     setPreviews((prev) => [...prev, ...newPreviews]);
//   };

//   const handleAddAmenity = () => {
//     if (inputValue.trim() !== "" && !amenities.includes(inputValue.trim())) {
//       setAmenities([...amenities, inputValue.trim()]);
//       setInputValue("");
//     }
//   };

//   const handleRemoveAmenity = (index) => {
//     const newAmenities = [...amenities];
//     newAmenities.splice(index, 1);
//     setAmenities(newAmenities);
//   };

//   const handleAddPlan = () => {
//     setPlans([
//       ...plans,
//       {
//         name: "",
//         twoGuestsWithGST: "",
//         twoGuestsWithoutGST: "",
//         extraAdultWithGST: "",
//         extraAdultWithoutGST: "",
//         complimentary: "",
//         services: [],
//       },
//     ]);
//   };

//   const handleRemovePlan = (index) => {
//     const updatedPlans = plans.filter((_, i) => i !== index);
//     setPlans(updatedPlans);
//   };

//   const handlePlanChange = (index, field, value) => {
//     const updatedPlans = [...plans];
//     updatedPlans[index][field] = value;
//     setPlans(updatedPlans);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate required fields
//     // if (!roomType || !terms || !bedType || plans.length === 0) {
//     //   alert("Please fill all required fields.");
//     //   return;
//     // }

//     // Prepare the data
//     const roomData = {
//       roomType,
//       maxRoomsAvailable: parseInt(document.querySelector('input[placeholder="Max Rooms Available"]').value, 10),
//       checkIn: document.querySelector('input[placeholder="Check-in Time"]').value,
//       checkOut: document.querySelector('input[placeholder="Check-out Time"]').value,
//       images: [], // This will be populated with uploaded image URLs
//       capacity: {
//         maxPersons: parseInt(document.querySelector('input[placeholder="Max Persons"]').value, 10),
//         maxAdults: parseInt(document.querySelector('input[placeholder="Max Adults"]').value, 10),
//         maxChildren: parseInt(document.querySelector('input[placeholder="Max Children"]').value, 10),
//       },
//       roomInfo: {
//         description: document.querySelector('input[placeholder="Room Info"]').value,
//         amenities,
//         terms: terms.split(",").map((term) => term.trim()),
//         bed: bedType,
//       },
//       plans: plans.map((plan) => ({
//         name: plan.name,
//         price: {
//           twoGuests: {
//             withGst: parseFloat(plan.twoGuestsWithGST),
//             withoutGst: parseFloat(plan.twoGuestsWithoutGST),
//           },
//           extraAdult: {
//             withGst: parseFloat(plan.extraAdultWithGST),
//             withoutGst: parseFloat(plan.extraAdultWithoutGST),
//           },
//         },
//         complimentary: plan.complimentary.split(",").map((item) => item.trim()),
//         services: plan.services,
//       })),
//     };

//     // Add files to the form data
//     const formData = new FormData();
//     formData.append("roomData", JSON.stringify(roomData));
//     files.forEach((file) => {
//       formData.append("images", file);
//     });

//     try {
//       // Send the data to the backend
//       const response = await axiosInstance.post("/admin/rooms", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       alert("Room added successfully!");
//     } catch (error) {
//       console.error("Error saving room data:", error);
//       alert("Failed to save room data.");
//     }
//   };

//   return (
//     <div className="bg-gray-100 flex bg-local">
//       <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
//         <h1 className="text-3xl font-bold justify-center items-center m-auto flex underline">
//           Add Room
//         </h1>
//         <form onSubmit={handleSubmit}>
//           {/* Room Type */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Room Type
//             </label>
//             <select
//               className="w-full bg-gray-200 border border-gray-300 rounded py-3 px-4"
//               value={roomType}
//               onChange={(e) => setRoomType(e.target.value)}
//             >
//               <option value="">Select Room Type</option>
//               <option value="Deluxe Rooms">Deluxe Rooms</option>
//               <option value="Villa Rooms">Villa Rooms</option>
//             </select>
//           </div>

//           {roomType && (
//             <>
//               {/* Room Info */}
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <input
//                   className="input"
//                   type="text"
//                   placeholder="Room Info"
//                 />
//                 <input
//                   className="input"
//                   type="number"
//                   placeholder="Max Rooms Available"
//                 />
//               </div>

// {/* Check-in and Check-out Time Inputs */}
// <div className="grid grid-cols-2 gap-4 mb-6">
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       Check-in Time
//     </label>
//     <input
//       className="input"
//       type="time"
//       placeholder="Check-in Time"
//       name="checkIn"
//     />
//   </div>

//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       Check-out Time
//     </label>
//     <input
//       className="input"
//       type="time"
//       placeholder="Check-out Time"
//       name="checkOut"
//     />
//   </div>
// </div>
//               {/* File Upload */}
//               <div className="mb-6">
//                 <input
//                   className="input"
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleFileChange}
//                 />
//                 <div className="flex flex-wrap gap-4 mt-4">
//                   {previews.map((src, index) => (
//                     <img
//                       key={index}
//                       src={src}
//                       alt={`Preview ${index}`}
//                       className="w-24 h-24 object-cover rounded border"
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Amenities */}
//               <div className="mb-6">
//                 <label className="block mb-2 text-sm font-medium text-gray-700">Amenities</label>
//                 <div className="flex gap-2 mb-3">
//                   <input
//                     className="flex-1 bg-gray-200 border border-gray-300 rounded py-3 px-4"
//                     type="text"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     placeholder="Add an amenity"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddAmenity}
//                     className="bg-blue-500 text-white px-4 py-2 rounded"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {amenities.map((amenity, i) => (
//                     <span
//                       key={i}
//                       className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
//                     >
//                       {amenity}{" "}
//                       <button onClick={() => handleRemoveAmenity(i)} className="ml-1 text-red-600 font-bold">×</button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

        

//               {/* Plans */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-bold mb-4">Plans</h3>
//                 {plans.map((plan, index) => (
//                   <div key={index} className="border p-4 mb-4 rounded">
//                     <div className="flex justify-between items-center mb-4">
//                       <input
//                         className="input flex-1"
//                         type="text"
//                         placeholder="Plan Name (e.g., Lite, Plus, Max)"
//                         value={plan.name}
//                         onChange={(e) =>
//                           handlePlanChange(index, "name", e.target.value)
//                         }
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemovePlan(index)}
//                         className="ml-4 text-red-600 font-bold hover:underline"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 mb-4">
//                       <input
//                         className="input"
//                         type="number"
//                         placeholder="Two Guests With GST"
//                         value={plan.twoGuestsWithGST}
//                         onChange={(e) =>
//                           handlePlanChange(index, "twoGuestsWithGST", e.target.value)
//                         }
//                       />
//                       <input
//                         className="input"
//                         type="number"
//                         placeholder="Two Guests Without GST"
//                         value={plan.twoGuestsWithoutGST}
//                         onChange={(e) =>
//                           handlePlanChange(index, "twoGuestsWithoutGST", e.target.value)
//                         }
//                       />
//                       <input
//                         className="input"
//                         type="number"
//                         placeholder="Extra Adult With GST"
//                         value={plan.extraAdultWithGST}
//                         onChange={(e) =>
//                           handlePlanChange(index, "extraAdultWithGST", e.target.value)
//                         }
//                       />
//                       <input
//                         className="input"
//                         type="number"
//                         placeholder="Extra Adult Without GST"
//                         value={plan.extraAdultWithoutGST}
//                         onChange={(e) =>
//                           handlePlanChange(index, "extraAdultWithoutGST", e.target.value)
//                         }
//                       />
//                     </div>
//                     <input
//                       className="input mb-4"
//                       type="text"
//                       placeholder="Complimentary (comma separated)"
//                       value={plan.complimentary}
//                       onChange={(e) =>
//                         handlePlanChange(index, "complimentary", e.target.value)
//                       }
//                     />
//                           <section>
//         <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="title">
//         Capacity
//                     </label>
//         <div className="grid grid-cols-3 gap-4">
//         <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="description"
//                       type="number"
//                       placeholder="Max Persons"
//                     />
//         <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="description"
//                       type="number"
//                       placeholder="Max Adults"
//                     />
//         <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="description"
//                       type="number"
//                       placeholder="Max Children"
//                     />
//           {/* <input type="number" placeholder="Max Persons" className="input" /> */}
//           {/* <input type="number" placeholder="Max Adults" className="input" />
//           <input type="number" placeholder="Max Children" className="input" /> */}
//         </div>
//       </section>
//                     <div className="flex gap-4 flex-wrap">
//                       {["WiFi", "Breakfast", "Spa", "Taxes Included"].map((service) => (
//                         <label key={service} className="flex items-center gap-2 text-sm">
//                           <input
//                             type="checkbox"
//                             className="form-checkbox"
//                             checked={plan.services.includes(service)}
//                             onChange={(e) => {
//                               const updatedServices = e.target.checked
//                                 ? [...plan.services, service]
//                                 : plan.services.filter((s) => s !== service);
//                               handlePlanChange(index, "services", updatedServices);
//                             }}
//                           />
//                           {service}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={handleAddPlan}
//                   className="bg-blue-300 text-white px-4 py-2 rounded"
//                 >
//                   Add Plan
//                 </button>
//               </div>
//             </>
//           )}

//           <button
//             type="submit"
//             className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
//           >
//             Save Room
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const style = document.createElement("style");
// style.textContent = `.input { 
//   width: 100%; padding: 0.75rem 1rem; 
//   border: 1px solid #d1d5db; 
//   border-radius: 0.5rem; 
//   background-color: #f3f4f6; 
//   outline: none; 
//   font-size: 0.875rem; 
// }`;
// document.head.appendChild(style);


// export default AddRoomdetails;


// import { useState } from "react";

// function AddRoomdetails() {
//   const [roomType, setRoomType] = useState("");
//   const [amenities, setAmenities] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [terms, setTerms] = useState("");
//   const [bedType, setBedType] = useState("");
//   // const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);

//   const [plans, setPlans] = useState({
//     lite: {
//       twoWithGST: "",
//       twoWithoutGST: "",
//       extraWithGST: "",
//       extraWithoutGST: "",
//       complimentary: "",
//       services: {
//         WiFi: false,
//         Breakfast: false,
//         Spa: false,
//         "Taxes Included": false,
//       },
//     },
//     plus: { /* same as lite */ },
//     max: { /* same as lite */ }
//   });

//   const handlePlanChange = (planType, field, value) => {
//     setPlans((prev) => ({
//       ...prev,
//       [planType]: {
//         ...prev[planType],
//         [field]: value
//       }
//     }));
//   };
  
//   const handleServiceToggle = (planType, service) => {
//     setPlans((prev) => ({
//       ...prev,
//       [planType]: {
//         ...prev[planType],
//         services: {
//           ...prev[planType].services,
//           [service]: !prev[planType].services[service],
//         }
//       }
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);

//     // Check total count including new files
//     const totalFiles = files.length + selectedFiles.length;
//     if (totalFiles > 4) {
//       alert("You can only upload up to 4 images.");
//       return;
//     }

//     // Add new files and generate previews
//     const updatedFiles = [...files, ...selectedFiles];
//     const newPreviews = selectedFiles.map((file) =>
//       URL.createObjectURL(file)
//     );

//     setFiles(updatedFiles);
//     setPreviews((prev) => [...prev, ...newPreviews]);
//   };


//   const handleAddAmenity = () => {
//     if (inputValue.trim() !== "" && !amenities.includes(inputValue.trim())) {
//       setAmenities([...amenities, inputValue.trim()]);
//       setInputValue("");
//     }
//   };

//   const handleRemoveAmenity = (index) => {
//     const newAmenities = [...amenities];
//     newAmenities.splice(index, 1);
//     setAmenities(newAmenities);
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     for (const plan in plans) {
//       const p = plans[plan];
//       if (!p.twoWithGST || !p.twoWithoutGST || !p.extraWithGST || !p.extraWithoutGST || !p.complimentary) {
//         alert(`Please complete all fields in the ${plan} plan`);
//         return;
//       }
//     }
  
//     // Submit logic...
//     console.log("Room data with plans:", plans);
//   };
  

//   return (
//     <div className="bg-gray-100 flex bg-local">
//       <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
//         <h1 className="text-3xl font-bold justify-center items-center m-auto flex underline">
//           Add Room
//         </h1>
//         <form>
//           {/* Room Type */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Room Type
//             </label>
//             <select
//               className="w-full bg-gray-200 border border-gray-300 rounded py-3 px-4"
//               value={roomType}
//               onChange={(e) => setRoomType(e.target.value)}
//             >
//               <option value="">Select Room Type</option>
//               <option value="Deluxe Rooms">Deluxe Rooms</option>
//               <option value="Villa Rooms">Villa Rooms</option>
//             </select>
//           </div>

//           {roomType && (
//             <>
//               {/* Room Info */}
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <input
//                   className="input"
//                   type="text"
//                   placeholder="Room Info"
//                 />
//                 <input
//                   className="input"
//                   type="number"
//                   placeholder="Max Rooms Available"
//                 />
//               </div>

//               {/* Check-in / Check-out */}
//               {/* <div className="grid grid-cols-2 gap-4 mb-6">
//                 <input className="input" type="time" placeholder="Check-in" />
//                 <input className="input" type="time" placeholder="Check-out" />
//               </div> */}

//               {/* File Upload */}
//               {/* <div className="mb-6">
//                 <input
//                   className="input"
//                   type="file"
//                   multiple
//                   onChange={(e) => setFile(e.target.files)}
//                 />
//               </div> */}

// <div className="mb-6">
//       <input
//         className="input"
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleFileChange}
//       />

//       <div className="flex flex-wrap gap-4 mt-4">
//         {previews.map((src, index) => (
//           <img
//             key={index}
//             src={src}
//             alt={`Preview ${index}`}
//             className="w-24 h-24 object-cover rounded border"
//           />
//         ))}
//       </div>
//     </div>

//               {/* Description */}
//               <div className="mb-6">
//                 <input
//                   className="input"
//                   type="text"
//                   placeholder="Description"
//                 />
//               </div>

//               {/* Capacity */}
//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 <input className="input" type="number" placeholder="Max Persons" />
//                 <input className="input" type="number" placeholder="Max Adults" />
//                 <input className="input" type="number" placeholder="Max Children" />
//               </div>

//               {/* Amenities */}
//               <div className="mb-6">
//                 <label className="block mb-2 text-sm font-medium text-gray-700">Amenities</label>
//                 <div className="flex gap-2 mb-3">
//                   <input
//                     className="flex-1 bg-gray-200 border border-gray-300 rounded py-3 px-4"
//                     type="text"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     placeholder="Add an amenity"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddAmenity}
//                     className="bg-blue-500 text-white px-4 py-2 rounded"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {amenities.map((amenity, i) => (
//                     <span
//                       key={i}
//                       className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
//                     >
//                       {amenity}{" "}
//                       <button onClick={() => handleRemoveAmenity(i)} className="ml-1 text-red-600 font-bold">×</button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Terms and Bed Type */}
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <input
//                   className="input"
//                   type="text"
//                   placeholder="Terms (comma separated)"
//                   value={terms}
//                   onChange={(e) => setTerms(e.target.value)}
//                 />
//                 <input
//                   className="input"
//                   type="text"
//                   placeholder="Bed Type (King/Queen)"
//                   value={bedType}
//                   onChange={(e) => setBedType(e.target.value)}
//                 />
//               </div>

//               {/* Pricing Plans */}
//               {/* {["lite", "plus", "max"].map((plan) => (
//                 <div key={plan} className="border-t border-gray-200 pt-6 mt-6">
//                   <h3 className="text-xl font-semibold capitalize mb-4">{plan} Plan</h3>

//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <input className="input" type="number" placeholder="Two Guests With GST" />
//                     <input className="input" type="number" placeholder="Two Guests Without GST" />
//                     <input className="input" type="number" placeholder="Extra Adult With GST" />
//                     <input className="input" type="number" placeholder="Extra Adult Without GST" />
//                   </div>

//                   <input className="input mb-4" type="text" placeholder="Complimentary (comma separated)" />

//                   {(plan === "plus" || plan === "max") && (
//                     <div className="grid grid-cols-2 gap-4 mb-4">
//                       <input className="input" type="text" placeholder="Welcome Drinks" />
//                       <input className="input" type="text" placeholder="Breakfast Menu" />
//                       {plan === "max" && (
//                         <>
//                           <input className="input" type="text" placeholder="Dinner Menu" />
//                           <input className="input" type="text" placeholder="Snacks Menu" />
//                         </>
//                       )}
//                     </div>
//                   )}

//                   <div className="flex gap-4 flex-wrap">
//                     {["WiFi", "Breakfast", "Spa", "Taxes Included"].map((service) => (
//                       <label key={service} className="flex items-center gap-2 text-sm">
//                         <input type="checkbox" className="form-checkbox" />
//                         {service}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))} */}


//               {["lite", "plus", "max"].map((plan) => (
//   <div key={plan} className="border-t border-gray-200 pt-6 mt-6">
//     <h3 className="text-xl font-semibold capitalize mb-4">{plan} Plan</h3>

//     <div className="grid grid-cols-2 gap-4 mb-4">
//       <input className="input" type="number" required placeholder="Two Guests With GST"
//         value={plans[plan].twoWithGST}
//         onChange={(e) => handlePlanChange(plan, "twoWithGST", e.target.value)} />
//       <input className="input" type="number" required placeholder="Two Guests Without GST"
//         value={plans[plan].twoWithoutGST}
//         onChange={(e) => handlePlanChange(plan, "twoWithoutGST", e.target.value)} />
//       <input className="input" type="number" required placeholder="Extra Adult With GST"
//         value={plans[plan].extraWithGST}
//         onChange={(e) => handlePlanChange(plan, "extraWithGST", e.target.value)} />
//       <input className="input" type="number" required placeholder="Extra Adult Without GST"
//         value={plans[plan].extraWithoutGST}
//         onChange={(e) => handlePlanChange(plan, "extraWithoutGST", e.target.value)} />
//     </div>

//     <input
//       className="input mb-4"
//       type="text"
//       placeholder="Complimentary (comma separated)"
//       required
//       value={plans[plan].complimentary}
//       onChange={(e) => handlePlanChange(plan, "complimentary", e.target.value)}
//     />

//     {(plan === "plus" || plan === "max") && (
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <input className="input" type="text" placeholder="Welcome Drinks" />
//         <input className="input" type="text" placeholder="Breakfast Menu" />
//         {plan === "max" && (
//           <>
//             <input className="input" type="text" placeholder="Dinner Menu" />
//             <input className="input" type="text" placeholder="Snacks Menu" />
//           </>
//         )}
//       </div>
//     )}

//     <div className="flex gap-4 flex-wrap">
//       {Object.keys(plans[plan].services).map((service) => (
//         <label key={service} className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             className="form-checkbox"
//             checked={plans[plan].services[service]}
//             onChange={() => handleServiceToggle(plan, service)}
//           />
//           {service}
//         </label>
//       ))}
//     </div>
//   </div>
// ))}

//             </>
//           )}

//           <button
//             type="submit"
//             className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
//           >
//             Save Room
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // Tailwind input base class (global reuse)
// // Tailwind input base class (global reuse)
// const style = document.createElement("style");
// style.textContent = `.input { 
//   width: 100%; padding: 0.75rem 1rem; 
//   border: 1px solid #d1d5db; 
//   border-radius: 0.5rem; 
//   background-color: #f3f4f6; 
//   outline: none; 
//   font-size: 0.875rem; 
// }`;
// document.head.appendChild(style);

// export default AddRoomdetails;


// import { useState } from 'react';

// function AddRoomdetails() {
//   const [roomType, setRoomType] = useState('');
//   const [amenities, setAmenities] = useState([]);
//   const [inputValue, setInputValue] = useState("");


//   const handleRoomTypeChange = (e) => {
//     setRoomType(e.target.value);
//   };
//   const handleAddAmenity = () => {
//     if (inputValue.trim() !== "" && !amenities.includes(inputValue.trim())) {
//       setAmenities([...amenities, inputValue.trim()]);
//       setInputValue("");
//     }
//   };
//   const handleRemoveAmenity = (index) => {
//     const newAmenities = [...amenities];
//     newAmenities.splice(index, 1);
//     setAmenities(newAmenities);
//   };

//   return (
//     <div className="bg-gray-100 flex bg-local">
//       <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
//         <h1 className="text-3xl font-bold justify-center items-center m-auto flex underline">Add Room</h1>
//         <form>
//           <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
//             {/* Room Type Dropdown */}
//             <div className="-mx-3 md:flex mb-6">
//               <div className="md:w-1/2 px-3 mb-6 md:mb-0">
//                 <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="roomType">
//                   Room Type
//                 </label>
//                 <select
//                   className="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
//                   id="roomType"
//                   value={roomType}
//                   onChange={handleRoomTypeChange}
//                 >
//                   <option value="">Select Room Type</option>
//                   <option value="Deluxe Rooms">Deluxe Rooms</option>
//                   <option value="Villa Rooms">Villa Rooms</option>
//                 </select>
//               </div>
//             </div>

//             {/* Conditionally render this section */}
//             {roomType && (
//               <>
//                 <div className="-mx-3 md:flex mb-6">
//                   <div className="md:w-1/2 px-3 mb-6 md:mb-0">
//                     <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="company">
//                       Room Type
//                     </label>
//                     <input
//                       className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="company"
//                       type="text"
//                       placeholder="roomType"
//                       value={roomType}
//                       readOnly
//                     />
//                   </div>
//                   <div className="md:w-1/2 px-3">
//                     <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="title">
//                       Room Info
//                     </label>
//                     <input
//                       className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="title"
//                       type="text"
//                       placeholder="room info"
//                     />
//                   </div>
//                 </div>

//                 <div className="-mx-3 md:flex mb-6">
//                   <div className="md:w-full px-3">
//                     <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="description">
//                       Description
//                     </label>
//                     <input
//                       className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="description"
//                       type="text"
//                       placeholder="description"
//                     />
//                   </div>
//                 </div>

//                 <section>
//         <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="title">
//         Capacity
//                     </label>
//         <div className="grid grid-cols-3 gap-4">
//         <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="description"
//                       type="number"
//                       placeholder="Max Persons"
//                     />
//         <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="description"
//                       type="number"
//                       placeholder="Max Adults"
//                     />
//         <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
//                       id="description"
//                       type="number"
//                       placeholder="Max Children"
//                     />
//           {/* <input type="number" placeholder="Max Persons" className="input" /> */}
//           {/* <input type="number" placeholder="Max Adults" className="input" />
//           <input type="number" placeholder="Max Children" className="input" /> */}
//         </div>
//       </section>


//               <div className="-mx-3 md:flex mb-2">
//   <div className="md:w-full px-3">
//     <label
//       className="uppercase tracking-wide text-black text-xs font-bold mb-2"
//       htmlFor="amenities"
//     >
//       Amenities
//     </label>

//     <div className="flex gap-2 mb-3">
//       <input
//         className="flex-1 bg-gray-200 text-black border border-gray-200 rounded py-3 px-4"
//         id="amenities"
//         type="text"
//         placeholder="Add an amenity"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />
//       <button
//         type="button"
//         onClick={handleAddAmenity}
//         className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Add
//       </button>
//     </div>

//     {/* Render added amenities as tags */}
//     <div className="flex flex-wrap gap-2">
//       {amenities.map((amenity, index) => (
//         <div
//           key={index}
//           className="flex items-center bg-gray-300 text-sm text-black px-3 py-1 rounded-full"
//         >
//           {amenity}
//           <button
//             type="button"
//             onClick={() => handleRemoveAmenity(index)}
//             className="ml-2 text-red-600 font-bold hover:text-red-800"
//           >
//             ×
//           </button>
//         </div>
//       ))}
//     </div>
//   </div>
// </div>

//                 <div className="-mx-3 md:flex mt-2">
//                   <div className="md:w-full px-3">
//                     <button
//                       className="md:w-full bg-gray-900 text-white font-bold py-2 px-4 border-b-4 hover:border-b-2 border-gray-500 hover:border-gray-100 rounded-full"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddRoomdetails;




// {/* <div className="md:w-1/2 px-3">
//             <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" for="job-type">
//               Job Type*
//             </label>
//             <div>
//               <select className="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded" id="job-type">
//                 <option>Full-Time</option>
//                 <option>Part-Time</option>
//                 <option>Internship</option>
//               </select>
//             </div>
//           </div> */}
//           {/* <div className="md:w-1/2 px-3">
//             <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" for="department">
//               Department*
//             </label>
//             <div>
//               <select className="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded" id="department">
//                 <option>Engineering</option>
//                 <option>Design</option>
//                 <option>Customer Support</option>
//               </select>
//             </div>
//           </div> */}