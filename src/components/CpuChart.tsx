import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CpuDataPoint } from '../hooks/useSystemData';
import { Cpu } from 'lucide-react';

interface CpuChartProps {
  data: CpuDataPoint[];
  currentUsage: number;
}

export default function CpuChart({ data, currentUsage }: CpuChartProps) {
  const getColor = () => {
    if (currentUsage > 80) return { stroke: '#ef4444', fill: '#ef444420' };
    if (currentUsage > 60) return { stroke: '#f59e0b', fill: '#f59e0b20' };
    return { stroke: '#10b981', fill: '#10b98120' };
  };

  const colors = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold">CPU 使用率</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${currentUsage > 80 ? 'text-red-400' : currentUsage > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {currentUsage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
            <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#9ca3af' }}
              itemStyle={{ color: colors.stroke }}
            />
            <Area
              type="monotone"
              dataKey="usage"
              stroke={colors.stroke}
              strokeWidth={2}
              fill="url(#cpuGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
