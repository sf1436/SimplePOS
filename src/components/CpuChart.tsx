import { motion } from 'framer-motion';
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
  const width = 600;
  const height = 200;
  const padding = 40;

  const maxUsage = 100;
  const minUsage = 0;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.usage - minUsage) / (maxUsage - minUsage)) * (height - padding * 2);
    return { x, y, ...point };
  });

  const pathD = points.map((point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const cp1x = prev.x + (point.x - prev.x) / 3;
    const cp1y = prev.y;
    const cp2x = point.x - (point.x - prev.x) / 3;
    const cp2y = point.y;
    return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }).join(' ');

  const areaD = pathD + ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

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

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
          <defs>
            <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors.stroke} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = height - padding - (value / 100) * (height - padding * 2);
            return (
              <g key={value}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#374151" strokeDasharray="3 3" />
                <text x={padding - 5} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="10">{value}</text>
              </g>
            );
          })}

          {/* Area */}
          <motion.path
            d={areaD}
            fill="url(#cpuGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Time labels */}
          {data.filter((_, i) => i % 5 === 0).map((point, index) => {
            const dataIndex = data.indexOf(point);
            const x = padding + (dataIndex / (data.length - 1)) * (width - padding * 2);
            return (
              <text key={index} x={x} y={height - 10} textAnchor="middle" fill="#6b7280" fontSize="10">
                {point.time}
              </text>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}
