import { motion } from 'framer-motion';
import { LogEntry } from '../hooks/useSystemData';
import { FileText } from 'lucide-react';

interface SystemLogProps {
  logs: LogEntry[];
}

export default function SystemLog({ logs }: SystemLogProps) {
  const levelConfig = {
    info: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: 'ℹ' },
    warning: { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: '⚠' },
    error: { color: 'text-red-400', bg: 'bg-red-400/10', icon: '✕' },
    debug: { color: 'text-gray-400', bg: 'bg-gray-400/10', icon: '◉' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold">系統日誌</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">即時監控</span>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="space-y-1 max-h-60 sm:max-h-72 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
        {logs.map((log, index) => {
          const config = levelConfig[log.level];
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-700/20 transition-colors"
            >
              <span className={`text-xs font-mono ${config.color} mt-0.5`}>{config.icon}</span>
              <span className="text-xs text-gray-500 font-mono whitespace-nowrap">{log.timestamp}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${config.bg} ${config.color} font-medium`}>
                {log.level.toUpperCase()}
              </span>
              <span className="text-xs text-gray-300">{log.message}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
