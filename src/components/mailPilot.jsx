import { useState } from "react";
import { X } from "lucide-react"; // Optional: You can use any icon
import axiosInstance from "../api/interceptors";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    to: [],
  });

  const [emailInput, setEmailInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = emailInput.trim().replace(/,$/, "");
      if (email && validateEmail(email) && !formData.to.includes(email)) {
        setFormData((prev) => ({
          ...prev,
          to: [...prev.to, email],
        }));
        setEmailInput("");
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.to.length === 0) {
      alert("Please enter at least one valid email address.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/bulkmail/sendBulkMails",
        formData
      );

      const data = await response.json();

      if (response.ok) {
        alert("Emails sent successfully!");
        setFormData({ subject: "", body: "", to: [] });
      } else {
        console.error(data.error);
        alert("Failed to send emails.");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("An error occurred while sending emails.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-4">
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
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
              placeholder="Type your message here..."
              required
            ></textarea>
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
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                placeholder="Type and press Enter"
                className="flex-grow px-1 py-1 text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-300 text-sm"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
