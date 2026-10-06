import { motion } from 'framer-motion';
import { Activity, Bell, Settings, Server, Menu, X } from 'lucide-react';
import { useState } from 'react';

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Server className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
          </motion.div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-white">系統監控儀表板</h1>
            <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">System Monitor Dashboard</p>
          </div>
        </div>

        {/* Desktop view */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <motion.div
            className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 lg:px-4 py-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs lg:text-sm text-gray-300">運行: {formatUptime(uptime)}</span>
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

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-3 pb-2 space-y-2 border-t border-gray-700/50 pt-3"
        >
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>運行時間: {formatUptime(uptime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">系統正常運行中</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button className="relative p-2 text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 text-gray-400">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
