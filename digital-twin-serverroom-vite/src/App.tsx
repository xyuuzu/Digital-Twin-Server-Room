import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomScene from "./components/RoomScene";
import Dashboard from "./components/Dashboard";
import TemperatureChart from "./components/TemperatureChart";
import "./index.css";

interface Server {
  id: number;
  temperature: number;
  isOnline: boolean;
}

function App() {
  const [servers, setServers] = useState<Server[]>([]);
  const [history, setHistory] = useState<{ time: string; avgTemp: number }[]>([]);
  const [acOn, setAcOn] = useState<boolean>(false);

  // Energi konsumsi: 50W per server online + 100W untuk AC
  const energyConsumption =
    servers.reduce((sum, s) => sum + (s.isOnline ? 50 : 0), 0) + (acOn ? 100 : 0);

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 3000);
    return () => clearInterval(interval);
  }, [acOn]);

  const fetchServers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/servers");
      let newServers = res.data;

      // Simulasikan AC menurunkan suhu
      if (acOn) {
        newServers = newServers.map((s: Server) => ({
          ...s,
          temperature: s.isOnline
            ? Math.max(s.temperature - 0.5, 20)
            : s.temperature,
        }));
      }

      setServers(newServers);

      // update chart data
      const avg =
        newServers.reduce((a: number, s: Server) => a + s.temperature, 0) /
        newServers.length;
      const time = new Date().toLocaleTimeString();
      setHistory((prev) => [...prev.slice(-10), { time, avgTemp: avg }]);
    } catch (err) {
      console.error("Gagal mengambil data server:", err);
    }
  };

  const toggleServer = async (id: number) => {
    try {
      await axios.post(`http://localhost:8080/toggle/${id}`);
      fetchServers();
    } catch (err) {
      console.error("Gagal mengubah status:", err);
    }
  };

  const toggleAC = () => setAcOn((prev) => !prev);

  const totalOnline = servers.filter((s) => s.isOnline).length;
  const avgTemp = servers.length
    ? (servers.reduce((a, s) => a + s.temperature, 0) / servers.length).toFixed(1)
    : "--";

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🌐 Digital Twin – Server Room
        </h1>
        <p className="text-sm opacity-80">Realtime monitoring & control</p>
      </header>

      {/* Main content */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* 3D View - Compact */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ height: '350px' }}>
            <RoomScene servers={servers} acOn={acOn} />
          </div>

          {/* Temperature Chart - Full Width */}
          <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex-1">
            <TemperatureChart data={history} />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl shadow-md p-3 text-center hover:shadow-lg transition">
              <h2 className="text-xs text-gray-500">Total Servers</h2>
              <p className="text-2xl font-bold mt-1">{servers.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-3 text-center hover:shadow-lg transition">
              <h2 className="text-xs text-gray-500">Online</h2>
              <p className="text-2xl font-bold mt-1 text-green-600">{totalOnline}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-3 text-center hover:shadow-lg transition">
              <h2 className="text-xs text-gray-500">Avg Temp</h2>
              <p className="text-2xl font-bold mt-1 text-red-600">{avgTemp}°C</p>
            </div>
          </div>

          {/* Dashboard - Takes remaining space */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex-1">
            <Dashboard
              servers={servers}
              acOn={acOn}
              energyConsumption={energyConsumption}
              onToggleServer={toggleServer}
              onToggleAC={toggleAC}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;