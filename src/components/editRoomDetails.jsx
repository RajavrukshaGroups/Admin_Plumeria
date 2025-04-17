import { useEffect, useState } from "react";
import axiosInstance from "../api/interceptors";
import { useParams, useNavigate } from "react-router-dom";

function EditRoomDetails() {
  const { roomId } = useParams(); // assuming you're passing :roomId in your route
  const navigate = useNavigate();

  // State declarations same as AddRoomdetails
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
  const [menuDetails, setMenuDetails] = useState({
    welcomeDrinks: [],
    breakFast: [],
    dinner: [],
    snacks: [],
  });

  useEffect(() => {
    async function fetchRoomsData() {
      try {
        const response = await axiosInstance.get("/admin/roomsdata");
        console.log(response, "Fetched rooms data");
        const rooms = response;
        console.log(rooms, "this is fetched data");
        const room = rooms.find((r) => r._id === roomId); // match by ID
        console.log(room, "room dtaaass");
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
          setPlans(room.plans || []);
          if (room.images) {
            setPreviews(room.images); // URLs
          }
        } else {
          console.error("Room not found");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    }

    fetchRoomsData();
  }, [roomId]);

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);
  //   setFiles(selectedFiles);

  //   const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
  //   setPreviews(previewUrls);
  // };

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

  // const handlePlanChange = (index, field, value) => {
  //   const updatedPlans = [...plans];
  //   updatedPlans[index] = {
  //     ...updatedPlans[index],
  //     [field]: value,
  //   };
  //   setPlans(updatedPlans);
  // };
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedRoomData = {
      roomType,
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
      const response = await axiosInstance.put(`/admin/editSaveroom/${roomId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Room updated successfully!");
      navigate("/roomsTable"); // or any route to redirect
    } catch (err) {
      console.error("Error updating room:", err.response || err.message);
      alert("Failed to update room.");
    }
  };

  return (
    <div className="bg-gray-100 flex bg-local">
      <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
        <h1 className="text-3xl font-bold justify-center items-center m-auto flex underline">
          Edit Room
        </h1>
        <form onSubmit={handleUpdate}>
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

              {/* <div className="mb-6">
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
              </div> */}

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
                  className="input"
                  type="text"
                  placeholder="Terms (comma separated)"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
              </div>
              {/* Plans */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Plans</h3>
                {plans.map((plan, index) => (
                  <div key={index} className="border p-4 mb-4 rounded">
                    <div className="flex justify-between items-center mb-4">
                      <input
                        className="input"
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
                        value={plan.price?.twoGuests?.withGst || ""}
                        onChange={(e) =>
                          handleNestedPlanChange(index, ["price", "twoGuests", "withGst"], e.target.value)
                        }
                      />
                      <input
                        className="input"
                        type="number"
                        placeholder="Two Guests Without GST"
                        value={plan.price?.twoGuests?.withoutGst || ""}
                        onChange={(e) =>
                          handleNestedPlanChange(index, ["price", "twoGuests", "withoutGst"], e.target.value)
                        }
                      />
                      <input
                        className="input"
                        type="number"
                        placeholder="Extra Adult With GST"
                        value={plan.price?.extraAdult?.withGst || ""}
                        onChange={(e) =>
                          handleNestedPlanChange(index, ["price", "extraAdult", "withGst"], e.target.value)
                        }
                      />
                      <input
                        className="input"
                        type="number"
                        placeholder="Extra Adult Without GST"
                        value={plan.price?.extraAdult?.withoutGst || ""}
        onChange={(e) =>
          handleNestedPlanChange(index, ["price", "extraAdult", "withoutGst"], e.target.value)
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

                    {/* <div className="mt-4">
                      <label className="block font-medium mb-1">
                        Menu Details
                      </label>

                      {["welcomeDrinks", "breakFast", "dinner", "snacks"].map(
                        (type) => (
                          <div className="mb-2" key={type}>
                            <label className="block text-sm capitalize text-gray-700 mb-1">
                              {type.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type="text"
                              className="input w-full"
                              placeholder={`Enter ${type} (comma separated)`}
                              value={
                                plans[index].menuDetails[type]?.join(", ") || ""
                              }
                              onChange={(e) =>
                                handleMenuDetailChange(
                                  index,
                                  type,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        )
                      )}
                    </div> */}
                       <div className="mt-4">
      <label className="block font-medium mb-1">Menu Details</label>
      {["welcomeDrinks", "breakFast", "dinner", "snacks"].map((type) => (
        <div className="mb-2" key={type}>
          <label className="block text-sm capitalize text-gray-700 mb-1">
            {type.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="text"
            className="input w-full"
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
                      {["WiFi", "Breakfast", "Spa", "Taxes Included"].map(
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
        </form>
      </div>
    </div>
  );
}

export default EditRoomDetails;
