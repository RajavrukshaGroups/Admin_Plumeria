import { useState, useEffect } from "react";
import { X, Loader2, Check, AlertCircle } from "lucide-react";
import axiosInstance from "../api/interceptors";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    to: [],
  });

  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // 'success', 'error', or 'warning'
    duration: 5000,
  });
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "body") {
      setCharCount(value.length);
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = emailInput.trim().replace(/,$/, "");

      if (!email) return;

      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address");
        return;
      }

      if (formData.to.includes(email)) {
        setEmailError("This email is already added");
        return;
      }

      setEmailError("");
      setFormData((prev) => ({
        ...prev,
        to: [...prev.to, email],
      }));
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setFormData((prev) => ({
      ...prev,
      to: prev.to.filter((email) => email !== emailToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.to.length === 0) {
      setEmailError("At least one email reciepient is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/bulkmail/sendBulkMails",
        formData
      );

      if (response.data) {
        console.log("response", response);
        if (response.success === true) {
          setNotification({
            show: true,
            message: response.message,
            type: "success",
            duration: 5000,
          });
          setFormData({ subject: "", body: "", to: [] });
          setCharCount(0);
        } else {
          const successCount = response.data?.sentCount;
          const failCount = response.data?.failedCount;

          if (successCount > 0 && failCount > 0) {
            setNotification({
              show: true,
              message: `Successfully sent ${successCount} email(s), ${failCount} failed`,
              type: "warning",
              duration: 8000,
            });
          } else {
            setNotification({
              show: true,
              message: response.message,
              type: "error",
              duration: 8000,
            });
          }

          if (response.data?.failedEmails?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              to: response?.data.failedEmails,
            }));
          }
        }
      }
    } catch (error) {
      console.error("Request failed:", error);
      setNotification({
        show: true,
        message: error.response?.data?.message || "An error occurred",
        type: "error",
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "", duration: 5000 });
      }, notification.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.show, notification.duration]);

  useEffect(() => {
    if (
      formData.subject === "" &&
      formData.body === "" &&
      formData.to.length === 0
    ) {
      const subjectInput = document.querySelector("input[name='subject']");
      if (subjectInput) subjectInput.focus();
    }
  }, [formData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-4">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          } text-white animate-fade-in`}
        >
          {notification.type === "success" ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="transform scale-[0.9] md:scale-100 transition-all duration-300 w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-4">
          Get in Touch
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="Enter a subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
              placeholder="Type your message here..."
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {charCount}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Emails
            </label>
            <span className="text-xs text-gray-500">
              {formData.to.length} entered
            </span>
            <div className="w-full max-h-32 overflow-y-auto px-2 py-2 border border-gray-300 rounded-md flex flex-wrap gap-1 items-start focus-within:ring-2 focus-within:ring-indigo-500">
              {formData.to.map((email, idx) => (
                <span
                  key={idx}
                  className="flex items-center bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="ml-1 text-indigo-500 hover:text-red-500"
                    aria-label={`Remove ${email}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailError("");
                }}
                onKeyDown={handleEmailKeyDown}
                placeholder="Add emails separated by commas or press Enter"
                className="flex-grow px-1 py-1 text-sm focus:outline-none"
                aria-label="Add recipient emails"
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-300 text-sm flex justify-center items-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
