// components/PlanModal.jsx
import React, { useState,useEffect} from "react";

const PlanModal = ({ isOpen, onClose, planData, onSave }) => {
    console.log(planData,'this is plan data')
  const [editedPlan, setEditedPlan] = useState({ ...planData });

  const handleChange = (field, subField, value) => {

    setEditedPlan((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [field]: {
          ...prev.price?.[field],
          [subField]: value,
        },
      },
    }));
  };
  useEffect(() => {
    if (planData) {
      setEditedPlan(planData);
    }
  }, [planData]);
  

  const handleSave = () => {
    onSave(editedPlan);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-blend-saturation bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Edit Plan: {planData.name}
        </h2>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          {[
            { label: "2 Guests (With GST)", field: "twoGuests", key: "withGst" },
            { label: "2 Guests (Without GST)", field: "twoGuests", key: "withoutGst" },
            { label: "Extra Adult (With GST)", field: "extraAdult", key: "withGst" },
            { label: "Extra Adult (Without GST)", field: "extraAdult", key: "withoutGst" },
          ].map(({ label, field, key }) => (
            <div key={label} className="flex justify-between items-center">
              <label>{label}</label>
              <input
                type="number"
                value={editedPlan.price?.[field]?.[key] || ""}
                onChange={(e) => handleChange(field, key, e.target.value)}
                className="ml-4 px-3 py-1 border rounded-md w-40 bg-white dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;
