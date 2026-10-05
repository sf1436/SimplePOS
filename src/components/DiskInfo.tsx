import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';

interface DiskInfoProps {
  total: number;
  used: number;
}

export default function DiskInfo({ total, used }: DiskInfoProps) {
  const percentage = (used / total) * 100;
  const totalGB = (total / 1024).toFixed(0);
  const usedGB = (used / 1024).toFixed(0);
  const freeGB = ((total - used) / 1024).toFixed(0);

  const getBarColor = () => {
    if (percentage > 90) return 'bg-red-400';
    if (percentage > 75) return 'bg-amber-400';
    return 'bg-purple-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <HardDrive className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-semibold">磁碟空間</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-2xl font-bold text-purple-400">{usedGB}</span>
            <span className="text-sm text-gray-400"> / {totalGB} GB</span>
          </div>
          <span className="text-xs text-gray-400">剩餘 {freeGB} GB</span>
        </div>

        <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${getBarColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-gray-700/30 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400">已使用</p>
            <p className="text-sm font-bold text-purple-400">{usedGB} GB</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400">可用</p>
            <p className="text-sm font-bold text-emerald-400">{freeGB} GB</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400">使用率</p>
            <p className="text-sm font-bold text-amber-400">{percentage.toFixed(1)}%</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">/dev/sda1</span>
            <span className="text-gray-300 font-mono">{(used * 0.6 / 1024).toFixed(0)} GB / {(total * 0.6 / 1024).toFixed(0)} GB</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">/dev/sda2</span>
            <span className="text-gray-300 font-mono">{(used * 0.3 / 1024).toFixed(0)} GB / {(total * 0.3 / 1024).toFixed(0)} GB</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">/dev/sdb1</span>
            <span className="text-gray-300 font-mono">{(used * 0.1 / 1024).toFixed(0)} GB / {(total * 0.1 / 1024).toFixed(0)} GB</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
