import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MemoryDataPoint } from '../hooks/useSystemData';
import { MemoryStick } from 'lucide-react';

interface MemoryChartProps {
  data: MemoryDataPoint[];
  total: number;
  used: number;
  cached: number;
}

export default function MemoryChart({ data, total, used, cached }: MemoryChartProps) {
  const usedPercent = ((used / total) * 100).toFixed(1);
  const cachedPercent = ((cached / total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MemoryStick className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">記憶體使用</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-blue-400">已用: {usedPercent}%</span>
          <span className="text-purple-400">快取: {cachedPercent}%</span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="memUsedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="memCachedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
            <YAxis stroke="#6b7280" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => [`${(value / 1024).toFixed(1)} GB`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Area
              type="monotone"
              dataKey="used"
              name="已使用"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#memUsedGradient)"
              animationDuration={300}
            />
            <Area
              type="monotone"
              dataKey="cached"
              name="快取"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#memCachedGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
