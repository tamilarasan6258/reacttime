import React, { useEffect, useState } from "react";

const API_BASE_URL = "https://dateandtimewebapi.runasp.net/api/Time/api/time"; // Change the port if needed

export default function TimeApp() {
  const [localTime, setLocalTime] = useState("");
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [zoneTime, setZoneTime] = useState("");

  // Fetch local time initially and update every second
  useEffect(() => {
    const fetchLocalTime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/local`);
        const data = await response.text(); // Because your API returns a string
        setLocalTime(data);
      } catch (error) {
        console.error("Error fetching local time", error);
      }
    };

    fetchLocalTime();
    const interval = setInterval(fetchLocalTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch list of time zones once
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/zones`);
        const data = await response.json(); // Because your API returns a list (JSON)
        setZones(data);
      } catch (error) {
        console.error("Error fetching time zones", error);
      }
    };

    fetchZones();
  }, []);

  // Fetch selected zone time and update every second
  useEffect(() => {
    if (!selectedZone) return;

    const fetchZoneTime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${selectedZone}`);
        const data = await response.text();
        setZoneTime(data);
      } catch (error) {
        console.error("Error fetching zone time", error);
      }
    };

    fetchZoneTime();
    const interval = setInterval(fetchZoneTime, 1000);

    return () => clearInterval(interval);
  }, [selectedZone]);

  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "Arial" }}>
      <h1> Time App</h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Local Time:</h2>
        <p style={{ fontSize: "2rem" }}>{localTime}</p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Select Time Zone:</h2>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        >
          <option value="">-- Select Time Zone --</option>
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      {selectedZone && (
        <div>
          <h2>Time in {selectedZone}:</h2>
          <p style={{ fontSize: "2rem" }}>{zoneTime}</p>
        </div>
      )}
    </div>
  );
}
