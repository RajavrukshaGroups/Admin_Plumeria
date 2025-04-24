// src/utils/toastHelper.js
import { toast } from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-center",
    style: {
      background: "#4ade80",
      color: "#fff",
      fontSize: "16px",
      padding: "16px",
    },
  });
};

export const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      style: {
        background: "#f87171", // red
        color: "#fff",
        fontSize: "16px",
        padding: "16px",
      },
    });
  };