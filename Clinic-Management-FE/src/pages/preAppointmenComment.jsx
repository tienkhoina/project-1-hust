import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useUser } from "../context/UserContext";

const Appointment = () => {
  const { patientId,timeType,date } = useParams();
  const { userId } = useUser();
  const [patient, setPatient] = useState(null);
  const [isFollowUpVisible, setIsFollowUpVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [info, setInfo] = useState("");

  const timeSlots = [
    "07:00 AM - 08:00 AM",
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  const fetchPatient = async () => {
    try {
      const result = await axiosClient.post("/user-profile", { id: patientId });
      setPatient(result.data);
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  };

  useEffect(() => {
      fetchPatient();
      console.log(date)
  }, [patientId]);

  const fetchDeleteBookings = async (patientId) => {
    let  item = {
          _id: patientId,
        timeType: timeType,
          date: date
    }
    try {
      const response = await axiosClient.post("/delete-appointment", {
        userId,
        data: { item },
        roleId: "R1",
      });
      console.log("Booking deleted:", response.data);
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Xóa lịch không thành công");
    }
  };

  const handleSubmit = async () => {
    alert("Hoàn thành!");
    await fetchDeleteBookings(patientId);
  };

  const handleFollowUpClick = () => {
    setIsFollowUpVisible(true);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleFollowUpSubmit = async (p, t, d, info) => {
    try {
      let da = new Date(d);
      da.setHours(7, 0, 0, 0);
      const data = {
        doctorId: "doc" + userId,
        patientId: p,
        time: t,
        date: da.toISOString(),
        message: 1,
      };

      const result = await axiosClient.post("/appointments", data);

      setSelectedTime("");
      setSelectedDate("");
      alert("Đặt lịch thành công!");

      await axiosClient.post("/insert-pre", {
        id: result.bookid,
        info: info,
      });
        
     await fetchDeleteBookings(patientId);

    } catch (error) {
      console.error("Error: ", error);
      alert(
        "Đặt lịch không thành công: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div>
      {patient && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={`data:image/jpeg;base64,${patient.image}`}
              alt={patient.name}
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {patient.name}
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {patient.degree} - {patient.speciality}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                Name
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {patient.firstName + " " + patient.lastName}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Thông tin bệnh nhân..."
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        ></textarea>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded-full"
          >
            Hoàn thành
          </button>
          <button
            onClick={handleFollowUpClick}
            className="bg-yellow-500 text-white px-6 py-2 rounded-full"
          >
            Tái khám
          </button>
        </div>
      </div>

      {isFollowUpVisible && (
        <div className="mt-6">
          <p className="font-medium text-gray-700">Chọn ngày và giờ tái khám:</p>

          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border p-2 mt-2 rounded-md"
          />

          <select
            value={selectedTime}
            onChange={handleTimeChange}
            className="border p-2 mt-2 rounded-md"
          >
            <option value="">Chọn thời gian</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <button
              onClick={() =>
                handleFollowUpSubmit(patientId, selectedTime, selectedDate, info)
              }
              className="bg-blue-500 text-white px-6 py-2 rounded-full"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
