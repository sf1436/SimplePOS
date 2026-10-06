import { useState, useEffect, useCallback } from 'react';

export interface CpuDataPoint {
  time: string;
  usage: number;
}

export interface MemoryDataPoint {
  time: string;
  used: number;
  cached: number;
}

export interface NetworkDataPoint {
  time: string;
  download: number;
  upload: number;
}

export interface Process {
  id: number;
  name: string;
  pid: number;
  cpu: number;
  memory: number;
  status: 'running' | 'sleeping' | 'stopped';
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
}

export interface SystemData {
  cpu: number;
  cpuHistory: CpuDataPoint[];
  memory: { total: number; used: number; cached: number };
  memoryHistory: MemoryDataPoint[];
  disk: { total: number; used: number };
  network: { download: number; upload: number };
  networkHistory: NetworkDataPoint[];
  processes: Process[];
  logs: LogEntry[];
  uptime: number;
  temperature: number;
}

const processNames = [
  'chrome', 'node', 'postgres', 'nginx', 'redis-server',
  'docker', 'python3', 'java', 'mysql', 'mongod',
  'systemd', 'sshd', 'cron', 'dbus-daemon', 'rsyslogd',
  'kernel_task', 'WindowServer', 'Finder', 'Spotlight', 'mds'
];

const logMessages = {
  info: [
    '系統健康檢查通過',
    '備份任務已完成',
    '新連線已建立',
    '快取已清理',
    '排程任務已執行',
    '服務重啟成功',
  ],
  warning: [
    'CPU 使用率超過 80%',
    '記憶體使用率偏高',
    '磁碟空間低於 20%',
    '網路延遲增加',
    '連線數接近上限',
  ],
  error: [
    '服務連線逾時',
    '資料庫查詢失敗',
    '認證失敗',
    '檔案系統錯誤',
  ],
  debug: [
    '請求處理時間: 45ms',
    '快取命中率: 94%',
    '執行緒池大小: 24',
    'GC 暫停: 12ms',
  ],
};

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function getTimeLabel(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
}

function generateProcesses(): Process[] {
  const count = Math.floor(Math.random() * 5) + 8;
  const processes: Process[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < count; i++) {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * processNames.length);
    } while (usedIndices.has(idx));
    usedIndices.add(idx);

    processes.push({
      id: i,
      name: processNames[idx],
      pid: Math.floor(Math.random() * 9000) + 1000,
      cpu: randomBetween(0, 45),
      memory: randomBetween(0.1, 15),
      status: Math.random() > 0.2 ? 'running' : Math.random() > 0.5 ? 'sleeping' : 'stopped',
    });
  }

  return processes.sort((a, b) => b.cpu - a.cpu);
}

function generateLog(): LogEntry {
  const levels: Array<'info' | 'warning' | 'error' | 'debug'> = ['info', 'info', 'info', 'warning', 'debug', 'error'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const messages = logMessages[level];
  const message = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: Date.now() + Math.random(),
    timestamp: getTimeLabel(),
    level,
    message,
  };
}

export function useSystemData(): SystemData {
  const [data, setData] = useState<SystemData>(() => {
    const initialHistory: CpuDataPoint[] = [];
    const initialMemHistory: MemoryDataPoint[] = [];
    const initialNetHistory: NetworkDataPoint[] = [];

    for (let i = 20; i >= 0; i--) {
      const time = new Date(Date.now() - i * 2000);
      const label = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
      initialHistory.push({ time: label, usage: randomBetween(20, 80) });
      initialMemHistory.push({ time: label, used: randomBetween(40, 70), cached: randomBetween(10, 25) });
      initialNetHistory.push({ time: label, download: randomBetween(10, 200), upload: randomBetween(5, 80) });
    }

    const initialLogs: LogEntry[] = [];
    for (let i = 0; i < 8; i++) {
      initialLogs.push(generateLog());
    }

    return {
      cpu: randomBetween(25, 75),
      cpuHistory: initialHistory,
      memory: { total: 16384, used: randomBetween(6000, 12000), cached: randomBetween(2000, 4000) },
      memoryHistory: initialMemHistory,
      disk: { total: 512000, used: randomBetween(200000, 400000) },
      network: { download: randomBetween(50, 300), upload: randomBetween(20, 100) },
      networkHistory: initialNetHistory,
      processes: generateProcesses(),
      logs: initialLogs,
      uptime: 345600 + Math.floor(Math.random() * 100000),
      temperature: randomBetween(45, 72),
    };
  });

  const updateData = useCallback(() => {
    setData(prev => {
      const newCpu = Math.max(5, Math.min(98, prev.cpu + randomBetween(-10, 10)));
      const newCpuHistory = [...prev.cpuHistory.slice(1), { time: getTimeLabel(), usage: newCpu }];

      const newMemUsed = Math.max(4000, Math.min(14000, prev.memory.used + randomBetween(-500, 500)));
      const newMemCached = Math.max(1000, Math.min(5000, prev.memory.cached + randomBetween(-200, 200)));
      const newMemHistory = [...prev.memoryHistory.slice(1), { time: getTimeLabel(), used: newMemUsed, cached: newMemCached }];

      const newDownload = Math.max(5, Math.min(500, prev.network.download + randomBetween(-50, 50)));
      const newUpload = Math.max(2, Math.min(200, prev.network.upload + randomBetween(-20, 20)));
      const newNetHistory = [...prev.networkHistory.slice(1), { time: getTimeLabel(), download: newDownload, upload: newUpload }];

      const newDiskUsed = Math.max(100000, Math.min(480000, prev.disk.used + randomBetween(-1000, 2000)));

      const newLogs = [...prev.logs];
      if (Math.random() > 0.5) {
        newLogs.unshift(generateLog());
        if (newLogs.length > 20) newLogs.pop();
      }

      return {
        cpu: newCpu,
        cpuHistory: newCpuHistory,
        memory: { total: 16384, used: newMemUsed, cached: newMemCached },
        memoryHistory: newMemHistory,
        disk: { total: 512000, used: newDiskUsed },
        network: { download: newDownload, upload: newUpload },
        networkHistory: newNetHistory,
        processes: Math.random() > 0.7 ? generateProcesses() : prev.processes,
        logs: newLogs,
        uptime: prev.uptime + 2,
        temperature: Math.max(40, Math.min(85, prev.temperature + randomBetween(-2, 2))),
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, [updateData]);

  return data;
}
