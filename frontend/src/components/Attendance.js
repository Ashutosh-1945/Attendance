import React, { useState, useEffect } from "react";
import { use } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useParams } from "react-router-dom";



function CalendarComponent() {
  const {userId,subjectId} = useParams();
  const [attendance, setAttendance] = useState({}); // Store attendance records
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [Present,setPresent] = useState(0);
  const [Absent,setAbsent] = useState(0);
  const [Cancelled,setCancelled] = useState(0);
  const [Total,setTotal] = useState(0);


  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/attendance/${userId}/${subjectId}`,
          { withCredentials: true }
        );

        const fetchedData = response.data.reduce((acc, record) => {
          const dateKey = new Date(record.year, record.month - 1, record.day).toDateString();
          acc[dateKey] = record;
          return acc;
        }, {});

        setAttendance(fetchedData);

        const counts = response.data.reduce(
          (acc, record) => {
            if (record.status === "Present") acc.present += 1;
            else if (record.status === "Absent") acc.absent += 1;
            else if (record.status === "Canceled") acc.canceled += 1;

            if(record.status === "Present" || record.status === "Absent")  acc.total += 1;  
           
            return acc;
          },
          { present: 0, absent: 0, canceled: 0, total: 0 }
        );
    
        setPresent(counts.present);
        setAbsent(counts.absent);
        setCancelled(counts.canceled);
        setTotal(counts.total);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
;
    };
    fetchAttendance();

  }, [userId, subjectId]);
  

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowDropdown(true);
  };

  const  handleAttendanceSelect = async (status) => {
    try {
        const day = selectedDate.getDate();
        const month = selectedDate.getMonth() + 1; 
        const year = selectedDate.getFullYear();
    
      const response = await axios.post('http://localhost:3005/api/attendance', {
        userId,
        subjectId,
        day,
        month,
        year,
        status
      },{ withCredentials: true });

      if (status === "Present") setPresent(Present + 1);
      else if (status === "Absent") setAbsent(Absent + 1);
      else if (status === "Canceled") setCancelled(Cancelled + 1);
      
      if(status === "Present" || status === "Absent") setTotal(Total+1);


      setAttendance((prev) => ({
        ...prev,
        [selectedDate.toDateString()]: {
          day,
          month,
          year,
          status, 
        },
      }));
  
      setShowDropdown(false);
      alert("Attendance status updated!");
    } catch (error) {
      console.error(error);
      alert("Error updating attendance status");
    }
  };


  return (
    <div>
      <h1>Attendance Calendar</h1>
      <Calendar
        onClickDay={handleDateClick}
        tileContent={({ date }) => {
          const record = attendance[date.toDateString()]; 
          if (record) {
            const color =
              record.status === "Present"
                ? "green"
                : record.status === "Absent"
                ? "red"
                : "gray"; 
            return (
              <div
                style={{
                  backgroundColor: color,
                  borderRadius: "50%",
                  color: "white",
                  padding: "2px",
                  textAlign: "center",
                }}
              >
                {record.status.charAt(0)}{" "}
                {/* Display only the first letter of the status */}
              </div>
            );
          }
          return null; 
        }}
      />
      <p>No of days present : {Present}</p>
      <p>No of  days absent : {Absent}</p>
      <p>No of days canceled: {Cancelled}</p>
      <p>Total Classes : {Total}</p>
      <p>Percent Attendance: {((Present/Total)*100).toFixed(2)}%</p>
      {(Present/Total)*100 < 75 && <p>Classes to attend for 75%: {3*Total - 4*Present}</p>}
      

      {showDropdown && selectedDate && (
        <div className="dropdown">
          <h3>Select Attendance for {selectedDate.toDateString()}</h3>
          <button onClick={() => handleAttendanceSelect("Present")}>
            Present
          </button>
          <button onClick={() => handleAttendanceSelect("Absent")}>
            Absent
          </button>
          <button onClick={() => handleAttendanceSelect("Canceled")}>
            Canceled
          </button>
          <button onClick={() => setShowDropdown(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;
