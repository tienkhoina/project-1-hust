import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


function formatDate(dateString) {
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}, ${month}, ${year}`;
}

const Patients = () => {
    const { previousPatients } = useUser();
    const navigate = useNavigate();

    const handleEditInfo = (patientId,timeType,date) => {
        navigate(`/pre-appointment-info/${patientId}/${timeType}/${date}`)
    };

    return (
        <div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">Previous Appointments</p>

            <div>
                {previousPatients.map((item, index) => (
                    <div
                        className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
                        key={index}
                    >
                        <div>
                            <img
                                className="w-30 h-32 bg-indigo-50 object-cover"
                                src={`data:image/png;base64,${item.image}`}
                                alt=""
                            />
                        </div>
                        <div className="flex-1 text-sm text-zinc-600">
                            <p className="text-neutral-800 font-semibold">{item.name}</p>
                            <p>{item.speciality}</p>
                            <p className="text-xs mt-1">
                                <span className="text-sm text-neutral-700 font-medium">
                                    Date & Time:
                                </span>{" "}
                                {formatDate(item.date)}
                            </p>
                        </div>

                        {/* Nút Edit Info nằm dưới cùng */}
                        <div className="flex flex-col gap-4 items-end">
                            <button
                                type="button"
                                className="bg-primary-500 text-black py-2 px-4 rounded-md hover:bg-green-500 transition duration-300"
                                onClick={() => handleEditInfo(item._id,item.timeType,item.date)}
                            >
                                Edit Info
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Patients;
