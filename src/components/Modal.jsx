import React, { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true);
    } else {
      // Delay closing to allow for animation
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isModalOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? "bg-black bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transition-all duration-300 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
