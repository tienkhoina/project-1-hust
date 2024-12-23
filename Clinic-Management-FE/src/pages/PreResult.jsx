import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { useUser } from "../context/UserContext";

const Appointment = () => {
  const { index } = useParams(); // Lấy index từ URL
  const { doctors } = useUser(); // Lấy danh sách doctors từ AppContext
  const navigate = useNavigate(); // Dùng để điều hướng
  const docInfo = doctors[index]; // Lấy thông tin bác sĩ theo index

  if (!docInfo) {
    return <p className="text-center mt-8 text-gray-500">Doctor not found.</p>;
  }

  return (
    <div>
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={`data:image/png;base64,${docInfo.image}`}
            alt={docInfo.name}
          />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          
        
        </div>
      </div>

      {/* Previous Result */}
      <div className="mt-8 sm:ml-72 sm:pl-4 font-medium text-gray-700">
        <p className="text-lg">Previous Result:</p>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-sm text-gray-600 mt-2">
          {docInfo.preMessage || "No previous results available."}
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-6"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Appointment;
