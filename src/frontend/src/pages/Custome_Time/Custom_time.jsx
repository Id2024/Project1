import React, { useState, useEffect } from 'react';
import axiosInstance from '../../hooks/api';
import './custom_time.css';

function Custom_time() {
  const [timeZones, setTimeZones] = useState([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState('IST');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [Timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const response = await axiosInstance.get('/timeZone');
        setTimeZones(response.data);
      } catch (error) {
        console.error('Error fetching time zones:', error);
      }
    };
    fetchTimeZones();
  }, []);
  const calculateTimeline = (timeZone, referenceOffsetMins) => {
    const [hoursOffset, minuteOffset] = timeZone.Zone_offset.split(':').map(Number);
    const totalOffsetMins = hoursOffset * 60 + minuteOffset;
    const offsetDifference = totalOffsetMins - referenceOffsetMins;
    const parsedDate = new Date(`${selectedDate}T${selectedTime}`);

    if (!isNaN(parsedDate.getTime())) {
      const baseTime = new Date(parsedDate);
      baseTime.setMinutes(baseTime.getMinutes() + offsetDifference);
      const timeOptions = {
        hour12: true, 
        hour: 'numeric',
        minute: '2-digit'
       };
       const dateOptions = {
        day: '2-digit',
        month: 'short', 
        year: 'numeric'
      };
  
      return {
        timeZoneName: timeZone.ZoneName,
        timeZoneOffset: timeZone.Zone_offset,
        localDate: baseTime.toLocaleDateString('en-GB', dateOptions), 
        localTime: baseTime.toLocaleTimeString('en-US', timeOptions)
      };
    } else {
      console.error('Invalid date format:', selectedDate);
      return null;
    }
  };
  const handleConvert = async () => {
    if (!selectedTimeZone || !selectedDate || !selectedTime) {
      console.error('Please select timezone, date, and time.');
      alert("please input all fields!")
      return;
    }
    const foundZone = timeZones.find(tz => tz.ZoneName === selectedTimeZone);
    if (foundZone) {
      const [refHoursOffset, refMinutesOffset] = foundZone.Zone_offset.split(':').map(Number);
      const referenceOffset = refHoursOffset * 60 + refMinutesOffset;
      const convertedTimelines = timeZones.map(tz => calculateTimeline(tz, referenceOffset));
      setTimeline(convertedTimelines.filter(t => t !== null));
    } else {
      console.error('Selected timezone not found in the database.');
    }
  };
  return (
    <div className="timezone-converter">
      <h2>Timezone Converter</h2>
      <div className="converter-form">
      <div className="form-group">
          <label>Select Timezone:</label>
          <select
            value={selectedTimeZone}
            onChange={(e) => setSelectedTimeZone(e.target.value)}
          >
            <option value="">Select Timezone</option>
            {timeZones.map((tz) => (
              <option key={tz._id} value={tz.ZoneName}>{tz.ZoneName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Select Time:</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleConvert}>
          Convert
        </button>
      </div>
      {Timeline.length > 0 && (
        <div className="converted-times">
          <h3>Converted Times:</h3>
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>Timezone Name</th>
                <th>Timezone Offset</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {Timeline.map((tz, index) => (
                <tr key={index}>
                  <td>{tz.timeZoneName}</td>
                  <td>{tz.timeZoneOffset}</td>
                  <td>{tz.localDate}</td>
                  <td>{tz.localTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Custom_time;