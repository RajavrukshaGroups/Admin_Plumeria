import axiosInstance from ".././api/interceptors";

export const Signin = async ( email, password ) => {
  try {
    const response = await axiosInstance.post("/admin/adminLogin", {
      email,
      password,
    });
    return response; 
  } catch (error) {
    throw error; 
    }
 };
// services/roomService.js

export const editRoomDetails = async (roomId, formData ) => {
  try {
    const response = await axiosInstance.put(`/admin/editSaveroom/${roomId}`, formData);
    return response; 
  } catch (error) {
    throw error;
  }
};

export const addRoomDetails =async (formData,files)=>{
  try {
    const response = await axiosInstance.post("/admin/rooms", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response; 
  } catch (error) {
    throw error;
  }
}
export const fetchRoomsData = async () => {
  try {
    const response = await axiosInstance.get("/admin/roomsdata");
    return response; 
  } catch (error) {
    throw error;
  }
};


export const getRoomById = async (roomId) => {
  try {
    const response = await axiosInstance.get("/admin/roomsdata");
    console.log(response,'the response from the server');
    
    const room = response?.find((r) => r._id === roomId);
console.log(room,'the room from the server');

    return room;
  } catch (error) {
    throw error;
  }
};



export const deleteRoom = async (roomId) => {
  try {
    const response = await axiosInstance.delete(`/admin/deleteroom/${roomId}`);
    return response.data; 
  } catch (error) {
    throw error;
  }
};


