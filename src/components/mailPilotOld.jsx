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
  const [fromEmail, setFromEmail] = useState("mail@defencehousingsociety.com");
  const [attachment, setAttachment] = useState(null);

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
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const email = emailInput.trim().replace(/[, ]+$/, "");

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

    // Validate required fields
    if (formData.to.length === 0) {
      setEmailError("At least one email recipient is required");
      return;
    }

    if (!formData.subject.trim() || !formData.body.trim()) {
      setNotification({
        show: true,
        message: "Subject and message body are required",
        type: "error",
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const formPayload = new FormData();

      // Append all fields
      formPayload.append("subject", formData.subject);
      formPayload.append("body", formData.body);
      formPayload.append("from", fromEmail);

      // Append each email
      formData.to.forEach((email) => {
        formPayload.append("to", email);
      });

      // Only append if file exists and is valid
      if (attachment) {
        formPayload.append("file", attachment);
      }

      const response = await axiosInstance.post(
        "/bulkmail/sendBulkMails",
        formPayload,
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );

      if (response.data) {
        if (response.data.success === true) {
          setNotification({
            show: true,
            message: response.data.message,
            type: "success",
            duration: 5000,
          });
          // Reset form
          setFormData({ subject: "", body: "", to: [] });
          setCharCount(0);
          setAttachment(null);
          setEmailInput("");
          // Clear file input
          document.querySelector('input[type="file"]').value = "";
        } else {
          // Handle partial success/error cases
          const successCount = response.data?.data?.sentCount || 0;
          const failCount = response.data?.data?.failedCount || 0;

          setNotification({
            show: true,
            message:
              successCount > 0
                ? `Successfully sent ${successCount} email(s), ${failCount} failed`
                : response.data.message,
            type: successCount > 0 ? "warning" : "error",
            duration: 8000,
          });

          if (response.data?.data?.failedEmails?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              to: response.data.data.failedEmails,
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
              Send From
            </label>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                type="button"
                onClick={() => setFromEmail("mail@defencehousingsociety.com")}
                className={`flex-1 px-3 py-2 text-sm rounded-md border overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer ${
                  fromEmail === "mail@defencehousingsociety.com"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                mail@defencehousingsociety.com
              </button>
              <button
                type="button"
                onClick={() => setFromEmail("plumeriaresort92@gmail.com")}
                className={`flex-1 px-3 py-2 text-sm rounded-md border overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer ${
                  fromEmail === "plumeriaresort92@gmail.com"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                plumeriaresort92@gmail.com
              </button>
            </div>
          </div>

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
              Upload File (optional)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-1 file:px-2 file:border-0 file:text-sm file:bg-indigo-100 file:text-indigo-700 hover:bg-gray-50">
                  Choose File
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) {
                        setAttachment(null);
                        return;
                      }

                      const validTypes = [
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                      ];
                      if (!validTypes.includes(file.type)) {
                        setAttachment(null);
                        alert("Only PDF, JPEG, PNG, or GIF files are allowed.");
                        e.target.value = "";
                        return;
                      }

                      if (file.size > 2 * 1024 * 1024) {
                        setAttachment(null);
                        alert("File must be less than 2MB.");
                        e.target.value = "";
                        return;
                      }

                      setAttachment(file);
                    }}
                    className="hidden"
                  />
                </div>
              </label>
              {attachment && (
                <div className="flex items-center">
                  <span className="text-xs text-gray-600 truncate max-w-xs">
                    {attachment.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachment(null);
                      document.querySelector('input[type="file"]').value = "";
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PDF or images only (max 2MB)
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
