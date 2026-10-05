import { motion } from 'framer-motion';
import { Activity, Bell, Settings, Server } from 'lucide-react';

interface HeaderProps {
  uptime: number;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}天 ${hours}時 ${mins}分`;
}

export default function Header({ uptime }: HeaderProps) {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Server className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">系統監控儀表板</h1>
            <p className="text-xs text-gray-400">System Monitor Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <motion.div
            className="flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-300">運行時間: {formatUptime(uptime)}</span>
          </motion.div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">系統正常</span>
          </div>

          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
