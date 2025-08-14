import { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  Check,
  AlertCircle,
  Paperclip,
  ImageOff,
} from "lucide-react";
import axiosInstance from "../api/interceptors";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    to: [],
    attachment: null,
  });
  const [images, setImages] = useState([]);

  console.log("formdata", formData.to);

  const fileInputRef = useRef(null);
  const [fromEmail, setFromEmail] = useState("mail@defencehousingsociety.com");
  const [charCount, setCharCount] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setFormData((prev) => ({
      ...prev,
      to: prev.to.filter((email) => email !== emailToRemove),
    }));
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "") {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (only images and PDF)
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      setFileError("Only images and PDF files are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size should be less than 5MB");
      return;
    }

    setFileError("");
    setFormData((prev) => ({ ...prev, attachment: file }));

    // Create preview only for images (not for PDF)
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null); // No preview for PDF
    }
  };

  const removeAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachment: null,
    }));
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    const filtered = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid type: ${file.name}`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...filtered]);
  };

  const removeImage = (i) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.to.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }

    setIsLoading(true);
    // const toastId = toast.loading("Sending emails...");

    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append all required fields
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("fromEmail", fromEmail);

      // Append each recipient individually
      formData.to.forEach((email) => {
        formDataToSend.append("to", email);
      });

      // Append attachment if it exists
      if (formData.attachment) {
        formDataToSend.append("attachment", formData.attachment);
      }

      images.forEach((img) => {
        formDataToSend.append("images", img);
      });

      // Make the API call
      const response = await axiosInstance.post(
        "/bulkmail/sendBulkMails",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response-data", response);

      // Handle response
      if (response?.success) {
        if (response?.results.some((result) => result.status === "failed")) {
          const failedCount = response.data.results.filter(
            (r) => r.status === "failed"
          ).length;
          toast.error(
            `Emails sent with ${failedCount} failures. Check console for details.`
          );
          console.log("Detailed results:", response?.results);
        } else {
          toast.success("All emails sent successfully!");
        }
      } else {
        throw new Error(response?.message || "Failed to send emails");
      }

      // Reset form on success
      setFormData({
        subject: "",
        message: "",
        to: [],
        attachment: null,
      });
      setEmailInput("");
      setFilePreview(null);
      setCharCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setEmailError("");
      setFileError("");
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error(error.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text");
    const emails = pastedData
      .split(/[,;\t\n]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const validEmails = [];
    const invalidEmails = [];

    emails.forEach((email) => {
      if (validateEmail(email)) {
        if (!formData.to.includes(email)) {
          validEmails.push(email);
        }
      } else {
        invalidEmails.push(email);
      }
    });

    if (validEmails.length > 0) {
      setFormData((prev) => ({
        ...prev,
        to: [...prev.to, ...validEmails],
      }));
    }

    if (invalidEmails.length > 0) {
      setEmailError(`Invalid emails ignored: ${invalidEmails.join(", ")}`);
      setTimeout(() => setEmailError(""), 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-4">
      <div className="transform scale-[0.9] md:scale-100 transition-all duration-300 w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-4">
          Bulk Email Sender
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
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
              name="message"
              value={formData.message}
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
              Images (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm"
            />
            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt=""
                      className="h-16 w-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment (Optional)
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm flex items-center gap-1">
                <Paperclip size={14} />
                Add Attachment
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg"
                />
              </label>
              {formData.attachment && (
                <button
                  type="button"
                  onClick={removeAttachment}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <X size={14} />
                  Remove
                </button>
              )}
            </div>
            {fileError && (
              <p className="text-red-500 text-xs mt-1">{fileError}</p>
            )}
            {filePreview && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img
                  src={filePreview}
                  alt="Attachment preview"
                  className="max-h-32 rounded-md border"
                />
              </div>
            )}
            {formData.attachment && !filePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-700">
                  {formData.attachment.type === "application/pdf"
                    ? "PDF file attached"
                    : formData.attachment.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(formData.attachment.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Emails (minimum 2 mails are required)
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
                onPaste={handleEmailPaste}
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
            disabled={
              isLoading || formData.to.length === 0 || formData.to.length === 1
            }
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-300 text-sm flex justify-center items-center ${
              isLoading || formData.to.length === 0 || formData.to.length === 1
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message Individually"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
