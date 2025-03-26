import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaTimes } from 'react-icons/fa';

const LoginPromptModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Semi-transparent backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white/90 backdrop-blur-sm px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Close modal"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100/90 sm:mx-0 sm:h-10 sm:w-10">
                <FaUser className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Welcome to IRCTC
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Login to access exclusive features and book your train tickets easily.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900">Benefits of logging in:</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Book train tickets instantly
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Save passenger details
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Track booking history
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Get exclusive offers
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="mt-6 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
              <button
                onClick={handleLoginClick}
                className="inline-flex w-full justify-center rounded-md bg-blue-600/90 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                Login Now
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
              >
                Continue without Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal; 