import axiosInstance from ".././api/interceptors";

export const Signin = async (email, password) => {
  try {
    const response = await axiosInstance.post("/admin/adminLogin", {
      email,
      password,
    });
    return response; // Return the response data
  } catch (error) {
    throw error; // Throw the error to handle it in the calling function
  }
};
// services/roomService.js

export const editRoomDetails = async (roomId, formData) => {
  try {
    const response = await axiosInstance.put(`/admin/editSaveroom/${roomId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response; // Returning the entire response or response.data as needed
  } catch (error) {
    throw error;
  }
};
