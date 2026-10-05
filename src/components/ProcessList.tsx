import { motion } from 'framer-motion';
import { Process } from '../hooks/useSystemData';
import { Terminal } from 'lucide-react';

interface ProcessListProps {
  processes: Process[];
}

export default function ProcessList({ processes }: ProcessListProps) {
  const statusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-emerald-400 bg-emerald-400/10';
      case 'sleeping': return 'text-amber-400 bg-amber-400/10';
      case 'stopped': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'running': return '運行中';
      case 'sleeping': return '休眠';
      case 'stopped': return '已停止';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">系統進程</h3>
        </div>
        <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
          {processes.length} 個進程
        </span>
      </div>

      <div className="overflow-hidden rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs border-b border-gray-700/50">
              <th className="text-left py-2 px-2 font-medium">名稱</th>
              <th className="text-left py-2 px-2 font-medium">PID</th>
              <th className="text-right py-2 px-2 font-medium">CPU %</th>
              <th className="text-right py-2 px-2 font-medium">記憶體 MB</th>
              <th className="text-center py-2 px-2 font-medium">狀態</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <motion.tr
                key={process.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
              >
                <td className="py-2 px-2">
                  <span className="text-gray-200 font-mono text-xs">{process.name}</span>
                </td>
                <td className="py-2 px-2">
                  <span className="text-gray-400 font-mono text-xs">{process.pid}</span>
                </td>
                <td className="py-2 px-2 text-right">
                  <span className={`font-mono text-xs ${process.cpu > 30 ? 'text-red-400' : process.cpu > 15 ? 'text-amber-400' : 'text-gray-300'}`}>
                    {process.cpu.toFixed(1)}
                  </span>
                </td>
                <td className="py-2 px-2 text-right">
                  <span className="font-mono text-xs text-gray-300">{process.memory.toFixed(1)}</span>
                </td>
                <td className="py-2 px-2 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(process.status)}`}>
                    {statusLabel(process.status)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
