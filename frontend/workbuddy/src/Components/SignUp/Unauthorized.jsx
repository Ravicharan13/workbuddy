import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="h-[90vh] bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <div className="inline-block bg-red-100 text-red-600 p-4 rounded-full mb-6 shadow-md">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0L5.636 18.364"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          You don’t have permission to view this page.<br />
          Please contact support or return to a valid section.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gray-800 text-white text-sm font-semibold rounded-sm duration-300 shadow-md hover:bg-gray-700 transition"
        >
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
