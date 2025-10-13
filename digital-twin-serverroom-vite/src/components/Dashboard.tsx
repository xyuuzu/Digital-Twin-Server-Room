import React from "react";

interface Server {
  id: number;
  temperature: number;
  isOnline: boolean;
}

interface DashboardProps {
  servers: Server[];
  acOn: boolean;
  energyConsumption: number;
  onToggleServer: (id: number) => void;
  onToggleAC: () => void;
}

export default function Dashboard({
  servers,
  acOn,
  energyConsumption,
  onToggleServer,
  onToggleAC,
}: DashboardProps) {
  return (
    <div className="bg-slate-800 text-white rounded-xl shadow-2xl w-full h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-700 px-5 py-3">
        <h2 className="text-2xl font-bold text-white">Server Room Dashboard</h2>
        <p className="text-slate-400 text-xs mt-1">Real-time monitoring & control</p>
      </div>

      {/* Content with fixed height */}
      <div className="flex-1 flex flex-col p-5 gap-3 overflow-hidden">
        {/* Panel Info Umum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-700/50 backdrop-blur p-3 rounded-xl border border-slate-600/50">
            <h3 className="font-semibold text-xs text-slate-300 mb-2 uppercase tracking-wide">AC Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${acOn ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
                <span className="text-lg font-bold">{acOn ? "ON" : "OFF"}</span>
              </div>
              <button
                onClick={onToggleAC}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  acOn 
                    ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" 
                    : "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30"
                }`}
              >
                {acOn ? "Turn Off" : "Turn On"}
              </button>
            </div>
          </div>

          <div className="bg-slate-700/50 backdrop-blur p-3 rounded-xl border border-slate-600/50">
            <h3 className="font-semibold text-xs text-slate-300 mb-2 uppercase tracking-wide">Total Energy Consumption</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-yellow-400">{energyConsumption.toFixed(0)}</span>
              <span className="text-sm text-slate-400">W</span>
            </div>
          </div>
        </div>

        {/* Tabel Server - Flex grow to fill remaining space */}
        <div className="bg-slate-700/30 backdrop-blur rounded-xl border border-slate-600/50 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-xs">
              <thead className="sticky top-0">
                <tr className="bg-slate-700/90 text-slate-200 border-b border-slate-600">
                  <th className="p-2.5 text-left font-semibold">ID</th>
                  <th className="p-2.5 text-left font-semibold">Temperature</th>
                  <th className="p-2.5 text-left font-semibold">Status</th>
                  <th className="p-2.5 text-left font-semibold">Energy Usage</th>
                  <th className="p-2.5 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((s, index) => {
                  const tempValue = s.temperature ?? 0;
                  const tempPercentage = Math.min(Math.max((tempValue - 20) / 30, 0), 1);
                  return (
                    <tr 
                      key={s.id} 
                      className={`border-b border-slate-700/50 hover:bg-slate-600/30 transition-colors ${
                        index % 2 === 0 ? 'bg-slate-800/20' : ''
                      }`}
                    >
                      <td className="p-2.5">
                        <span className="font-mono font-semibold text-slate-200">{s.id}</span>
                      </td>
                      <td className="p-2.5">
                        <div className="w-full max-w-[140px]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-slate-400">Temp</span>
                            <span className={`text-xs font-bold ${
                              tempValue > 45
                                ? "text-red-400"
                                : tempValue > 35
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}>
                              {tempValue.toFixed(1)}°C
                            </span>
                          </div>
                          <div className="bg-slate-600 rounded-full h-1.5 relative overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                tempValue > 45
                                  ? "bg-gradient-to-r from-red-500 to-red-600"
                                  : tempValue > 35
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                                  : "bg-gradient-to-r from-green-500 to-green-600"
                              }`}
                              style={{ width: `${tempPercentage * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${s.isOnline ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
                          {s.isOnline ? (
                            <span className="text-green-400 font-semibold">Online</span>
                          ) : (
                            <span className="text-slate-500 font-semibold">Offline</span>
                          )}
                        </div>
                      </td>
                      <td className="p-2.5">
                        <span className={`font-mono ${s.isOnline ? 'text-yellow-400' : 'text-slate-500'}`}>
                          {s.isOnline ? "50 W" : "0 W"}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <button
                          onClick={() => onToggleServer(s.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${
                            s.isOnline 
                              ? "bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/30" 
                              : "bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/30"
                          }`}
                        >
                          {s.isOnline ? "Turn Off" : "Turn On"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}