
import axiosInstance from ".././api/interceptors";

export const Signin = async ( email, password ) => {
  try {
    const response = await axiosInstance.post("/admin/adminLogin", {
      email,
      password,
    });
    return response; 
  } catch (error) {
    return error.response.data
    }
 };

// services/roomService.js

export const editRoomDetails = async (roomId, formData ) => {
  try {
    const response = await axiosInstance.put(`/admin/editSaveroom/${roomId}`, formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    const room = response?.find((r) => r._id === roomId);
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



export const getAllRoomTypes = async () => {
  try {
    const response = await axiosInstance.get("/admin/getRoomtype");
    return response;
  } catch (error) {
    throw error;
  }
};



export const addRoomType = async (roomTypeName) => {
  try {
    const response = await axiosInstance.post("/admin/addRoomtype", {
      name: roomTypeName,
    });
    return response; 
  } catch (error) {
    throw error; 
  }
};



export const updateRoomType = async (roomId, updatedName) => {
  const response = await axiosInstance.put(`/admin/updateroomtype/${roomId}`, {
    name: updatedName,
  });
  return response;
};



export const deleteRoomType = async (roomId) => {
  const response = await axiosInstance.delete(`/admin/deleteroomtype/${roomId}`);
  return response.data;
};