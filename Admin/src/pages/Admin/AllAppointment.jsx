import React from "react";

const appointments = [
  {
    id: 1,
    patient: "Richard James",
    department: "Richard James",
    age: 28,
    dateTime: "24th July, 2024, 10:AM",
    doctor: { name: "Dr. Richard James", image: "https://via.placeholder.com/40" },
    fees: "$50",
  },
  {
    id: 2,
    patient: "Richard James",
    department: "Richard James",
    age: 28,
    dateTime: "24th July, 2024, 10:AM",
    doctor: { name: "Dr. Richard James", image: "https://via.placeholder.com/40" },
    fees: "$50",
  },
];

const AllAppointment = () => {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Patient</th>
              <th className="px-4 py-2 border">Department</th>
              <th className="px-4 py-2 border">Age</th>
              <th className="px-4 py-2 border">Date & Time</th>
              <th className="px-4 py-2 border">Doctor</th>
              <th className="px-4 py-2 border">Fees</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{appointment.id}</td>
                <td className="px-4 py-2 border">{appointment.patient}</td>
                <td className="px-4 py-2 border">{appointment.department}</td>
                <td className="px-4 py-2 border">{appointment.age}</td>
                <td className="px-4 py-2 border">{appointment.dateTime}</td>
                <td className="px-4 py-2 border flex items-center gap-2">
                  <img
                    src={appointment.doctor.image}
                    alt={appointment.doctor.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {appointment.doctor.name}
                </td>
                <td className="px-4 py-2 border">{appointment.fees}</td>
                <td className="px-4 py-2 border">
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAppointment;
