import { Cpu, MemoryStick, HardDrive, Wifi, Thermometer, Clock } from 'lucide-react';
import { useSystemData } from './hooks/useSystemData';
import Header from './components/Header';
import StatCard from './components/StatCard';
import CpuChart from './components/CpuChart';
import MemoryChart from './components/MemoryChart';
import NetworkChart from './components/NetworkChart';
import DiskInfo from './components/DiskInfo';
import ProcessList from './components/ProcessList';
import SystemLog from './components/SystemLog';
import CircularGauge from './components/CircularGauge';

export default function App() {
  const data = useSystemData();

  const memoryUsedGB = (data.memory.used / 1024).toFixed(1);
  const memoryTotalGB = (data.memory.total / 1024).toFixed(0);
  const diskUsedGB = (data.disk.used / 1024).toFixed(0);
  const diskTotalGB = (data.disk.total / 1024).toFixed(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header uptime={data.uptime} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              title="CPU"
              value={`${data.cpu.toFixed(1)}%`}
              subtitle="8 核心 / 16 執行緒"
              icon={Cpu}
              color="emerald"
              progress={data.cpu}
              delay={0}
            />
            <StatCard
              title="記憶體"
              value={`${memoryUsedGB} GB`}
              subtitle={`共 ${memoryTotalGB} GB DDR5`}
              icon={MemoryStick}
              color="blue"
              progress={(data.memory.used / data.memory.total) * 100}
              delay={0.05}
            />
            <StatCard
              title="磁碟"
              value={`${diskUsedGB} GB`}
              subtitle={`共 ${diskTotalGB} GB SSD`}
              icon={HardDrive}
              color="purple"
              progress={(data.disk.used / data.disk.total) * 100}
              delay={0.1}
            />
            <StatCard
              title="網路"
              value={`${data.network.download.toFixed(0)} MB/s`}
              subtitle={`上傳: ${data.network.upload.toFixed(0)} MB/s`}
              icon={Wifi}
              color="cyan"
              delay={0.15}
            />
            <StatCard
              title="溫度"
              value={`${data.temperature.toFixed(0)}°C`}
              subtitle="CPU 核心溫度"
              icon={Thermometer}
              color={data.temperature > 70 ? 'red' : 'orange'}
              progress={(data.temperature / 100) * 100}
              delay={0.2}
            />
            <StatCard
              title="運行時間"
              value={`${Math.floor(data.uptime / 86400)}天`}
              subtitle={`${Math.floor((data.uptime % 86400) / 3600)}時 ${Math.floor((data.uptime % 3600) / 60)}分`}
              icon={Clock}
              color="emerald"
              delay={0.25}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CpuChart data={data.cpuHistory} currentUsage={data.cpu} />
            <MemoryChart
              data={data.memoryHistory}
              total={data.memory.total}
              used={data.memory.used}
              cached={data.memory.cached}
            />
          </div>

          {/* Network + Disk + Gauges Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <NetworkChart
              data={data.networkHistory}
              download={data.network.download}
              upload={data.network.upload}
            />
            <DiskInfo total={data.disk.total} used={data.disk.used} />
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-400" />
                系統健康度
              </h3>
              <div className="grid grid-cols-2 gap-4 place-items-center">
                <CircularGauge
                  value={data.cpu}
                  max={100}
                  label="CPU 負載"
                  unit="%"
                  color={data.cpu > 80 ? 'red' : data.cpu > 60 ? 'orange' : 'emerald'}
                  size={100}
                />
                <CircularGauge
                  value={(data.memory.used / data.memory.total) * 100}
                  max={100}
                  label="記憶體"
                  unit="%"
                  color="blue"
                  size={100}
                />
                <CircularGauge
                  value={data.temperature}
                  max={100}
                  label="溫度"
                  unit="°C"
                  color={data.temperature > 70 ? 'red' : 'orange'}
                  size={100}
                />
                <CircularGauge
                  value={(data.disk.used / data.disk.total) * 100}
                  max={100}
                  label="磁碟"
                  unit="%"
                  color="purple"
                  size={100}
                />
              </div>
            </div>
          </div>

          {/* Process List + System Log Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProcessList processes={data.processes} />
            <SystemLog logs={data.logs} />
          </div>

          {/* Footer */}
          <footer className="text-center py-4 border-t border-gray-800/50">
            <p className="text-xs text-gray-500">
              系統監控儀表板 v2.0 | 數據每 2 秒更新 | 最後更新: {new Date().toLocaleTimeString('zh-TW')}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
