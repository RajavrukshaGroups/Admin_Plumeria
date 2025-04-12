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