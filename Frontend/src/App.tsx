import { useEffect, useState } from "react";
import RoomScene from "./components/RoomScene";
import {
  Server,
  Activity,
  Zap,
  Wind,
  TrendingUp,
  AlertTriangle,
  ThermometerSun,
  Power,
  RefreshCw,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ServerType {
  id: number;
  temperature: number;
  isOnline: boolean;
  powerUsage: number;
  uptime: number;
}

function App() {
  const [servers, setServers] = useState<ServerType[]>([]);
  const [history, setHistory] = useState<
    { time: string; avgTemp: number; energy: number }[]
  >([]);
  const [acOn, setAcOn] = useState<boolean>(false);
  const [acTemp, setAcTemp] = useState<number>(22);
  const [totalEnergy, setTotalEnergy] = useState<number>(0);
  const [notification, setNotification] = useState<string>("");
  const [notifType, setNotifType] = useState<"warning" | "danger" | "">("");

  const ENERGY_LIMIT = 2000;

  useEffect(() => {
    const initServers: ServerType[] = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      temperature: Math.random() * 5 + 25,
      isOnline: Math.random() > 0.5,
      powerUsage: 0,
      uptime: 0,
    }));
    setServers(initServers);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateSimulation();
    }, 3000);
    return () => clearInterval(interval);
  }, [servers, acOn, acTemp]);

  const updateSimulation = () => {
    setServers((prev) =>
      prev.map((s) => {
        let temp = s.temperature;
        let power = s.powerUsage;
        let uptime = s.uptime;

        if (s.isOnline) {
          uptime += 3;
          temp += 0.2 + Math.min(uptime / 1000, 2);
          power = 60 + Math.random() * 20 + uptime * 0.02;
        } else {
          temp -= Math.random() * 0.6;
          uptime = 0;
          power = Math.max(0, power - 10);
        }

        if (acOn && temp > acTemp) {
          const coolingEffect = (temp - acTemp) * 0.25;
          temp -= coolingEffect;
        }

        temp = Math.min(Math.max(temp, 18), 80);
        return {
          ...s,
          temperature: parseFloat(temp.toFixed(1)),
          powerUsage: power,
          uptime,
        };
      })
    );

    const totalServerPower = servers.reduce((a, s) => a + s.powerUsage, 0);
    const acPower = acOn ? 100 + (30 - acTemp) * 5 : 0;
    const newEnergy = totalServerPower + acPower;
    setTotalEnergy(newEnergy);

    const avgTemp =
      servers.reduce((a, s) => a + s.temperature, 0) / (servers.length || 1);
    const time = new Date().toLocaleTimeString();
    setHistory((prev) => [...prev.slice(-10), { time, avgTemp, energy: newEnergy }]);

    if (newEnergy > ENERGY_LIMIT) {
      setNotification("⚠️ Konsumsi energi tinggi! Matikan beberapa server!");
      setNotifType("danger");
    } else if (avgTemp > 45) {
      setNotification("🔥 Suhu ruang meningkat! Nyalakan AC untuk pendinginan!");
      setNotifType("warning");
    } else {
      setNotification("");
      setNotifType("");
    }
  };

  const toggleServer = (id: number) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isOnline: !s.isOnline } : s))
    );
  };

  const toggleAC = () => setAcOn((prev) => !prev);
  const changeACTemp = (delta: number) =>
    setAcTemp((t) => Math.min(Math.max(t + delta, 16), 30));

  const resetSimulation = () => {
    const resetServers: ServerType[] = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      temperature: Math.random() * 5 + 25,
      isOnline: false,
      powerUsage: 0,
      uptime: 0,
    }));
    setServers(resetServers);
    setHistory([]);
    setAcOn(false);
    setAcTemp(22);
    setTotalEnergy(0);
    setNotification("");
  };

  const totalOnline = servers.filter((s) => s.isOnline).length;
  const avgTemp = servers.length
    ? (servers.reduce((a, s) => a + s.temperature, 0) / servers.length).toFixed(1)
    : "--";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Digital Twin – Smart Server Room</h1>
              <p className="text-xs text-blue-100 mt-0.5">Realistic Energy & Temperature Simulation</p>
            </div>
          </div>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Simulation
          </button>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`${
            notifType === "danger"
              ? "bg-red-100 border-red-500 text-red-800"
              : "bg-yellow-100 border-yellow-500 text-yellow-800"
          } border-l-4 px-6 py-3 shadow-md`}
        >
          <div className="max-w-[1600px] mx-auto flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{notification}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-4 lg:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<Server className="w-4 h-4" />}
            title="Total Servers"
            value={servers.length}
            color="blue"
          />
          <StatCard
            icon={<Power className="w-4 h-4" />}
            title="Online"
            value={totalOnline}
            color="green"
          />
          <StatCard
            icon={<ThermometerSun className="w-4 h-4" />}
            title="Avg Temperature"
            value={`${avgTemp}°C`}
            color="orange"
          />
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            title="Power Usage"
            value={`${Math.round(totalEnergy)}W`}
            color="purple"
            alert={totalEnergy > ENERGY_LIMIT}
          />
        </div>

        {/* Main Grid: 3D View + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 3D View Placeholder */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '500px' }}>
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-bold">3D Server Room View</h2>
            </div>
            <div style={{ height: 'calc(100% - 52px)' }} className="bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <RoomScene servers={servers} acOn={acOn} toggleServer={toggleServer} />
            </div>
            
          </div>

          {/* Server Management + AC Control */}
          <div className="flex flex-col gap-6">
            {/* Server Management */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Server className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Server Management</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {servers.map((server) => (
                  <ServerCard
                    key={server.id}
                    server={server}
                    onToggle={() => toggleServer(server.id)}
                  />
                ))}
              </div>
            </div>

            {/* AC Control */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${acOn ? "bg-cyan-100" : "bg-gray-100"} p-2 rounded-lg transition-colors`}>
                  <Wind className={`w-5 h-5 ${acOn ? "text-cyan-600" : "text-gray-400"}`} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">AC Control System</h2>
              </div>

              <div className="space-y-4">
                {/* AC Status & Toggle */}
                <div className={`${
                  acOn 
                    ? "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200" 
                    : "bg-gray-50 border-gray-200"
                } border-2 rounded-xl p-4 transition-all`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-600">System Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      acOn ? "bg-cyan-500 text-white" : "bg-gray-400 text-white"
                    }`}>
                      {acOn ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                  
                  <button
                    onClick={toggleAC}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      acOn 
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-200" 
                        : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {acOn ? "Turn OFF" : "Turn ON"}
                  </button>
                </div>

                {/* Temperature Control */}
                <div className={`${
                  acOn 
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" 
                    : "bg-gray-50 border-gray-200"
                } border-2 rounded-xl p-4 transition-all`}>
                  <div className="text-center mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Target Temperature</p>
                    <div className="text-4xl font-bold text-blue-600 mb-1">{acTemp}°C</div>
                    <p className="text-xs text-gray-500">Range: 16°C - 30°C</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeACTemp(-1)}
                      disabled={!acOn || acTemp <= 16}
                      className={`flex-1 py-2 rounded-lg font-bold text-lg transition-all ${
                        acOn && acTemp > 16
                          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md active:scale-95"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      –
                    </button>
                    <button
                      onClick={() => changeACTemp(1)}
                      disabled={!acOn || acTemp >= 30}
                      className={`flex-1 py-2 rounded-lg font-bold text-lg transition-all ${
                        acOn && acTemp < 30
                          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md active:scale-95"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* AC Power Info */}
                {acOn && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">AC Power Draw</span>
                      <span className="text-base font-bold text-purple-600">
                        {Math.round(100 + (30 - acTemp) * 5)}W
                      </span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                        style={{ width: `${((30 - acTemp) / 14) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Temperature Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" domain={[0, 80]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgTemp"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#tempGradient)"
                  name="Avg Temp (°C)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Energy Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Energy Usage</h2>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 3 }}
                  name="Power (W)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ icon, title, value, color, alert }: any) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
  };
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition-all ${
        alert ? "ring-2 ring-red-400 animate-pulse" : ""
      }`}
    >
      <div className={`inline-flex p-1.5 rounded-lg bg-gradient-to-br ${colors[color as keyof typeof colors]} text-white mb-2`}>
        {icon}
      </div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
      <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
    </div>
  );
};

const ServerCard = ({ server, onToggle }: any) => {
  const tempColor =
    server.temperature > 50
      ? "text-red-600"
      : server.temperature > 38
      ? "text-orange-600"
      : "text-green-600";
  
  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div
      className={`border-2 rounded-xl p-3 transition-all ${
        server.isOnline
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Server className={`w-4 h-4 ${server.isOnline ? "text-green-600" : "text-gray-400"}`} />
          <span className="font-bold text-sm text-gray-700">Server {server.id}</span>
        </div>
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            server.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-300"
          }`}
        />
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600 flex items-center gap-1">
            <ThermometerSun className="w-3 h-3" />
            Temp
          </span>
          <span className={`font-bold ${tempColor}`}>{server.temperature}°C</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Power
          </span>
          <span className="font-bold text-purple-600">{Math.round(server.powerUsage)}W</span>
        </div>
        {server.isOnline && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Uptime
            </span>
            <span className="font-bold text-blue-600">{formatUptime(server.uptime)}</span>
          </div>
        )}
      </div>
      
      <button
        onClick={onToggle}
        className={`w-full py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
          server.isOnline
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        <Power className="w-3.5 h-3.5" />
        {server.isOnline ? "Shutdown" : "Start"}
      </button>
    </div>
  );
};

export default App;