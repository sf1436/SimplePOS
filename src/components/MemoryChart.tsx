import { motion } from 'framer-motion';
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

  const width = 600;
  const height = 200;
  const padding = 40;

  const maxValue = total;

  const usedPoints = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.used / maxValue) * (height - padding * 2));
    return { x, y };
  });

  const cachedPoints = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.cached / maxValue) * (height - padding * 2));
    return { x, y };
  });

  const createSmoothPath = (points: { x: number; y: number }[]) => {
    return points.map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const prev = points[index - 1];
      const cp1x = prev.x + (point.x - prev.x) / 3;
      const cp1y = prev.y;
      const cp2x = point.x - (point.x - prev.x) / 3;
      const cp2y = point.y;
      return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    }).join(' ');
  };

  const usedPathD = createSmoothPath(usedPoints);
  const cachedPathD = createSmoothPath(cachedPoints);

  const usedAreaD = usedPathD + ` L ${usedPoints[usedPoints.length - 1].x} ${height - padding} L ${usedPoints[0].x} ${height - padding} Z`;
  const cachedAreaD = cachedPathD + ` L ${cachedPoints[cachedPoints.length - 1].x} ${height - padding} L ${cachedPoints[0].x} ${height - padding} Z`;

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
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-blue-400 rounded" />
            <span className="text-blue-400">已用: {usedPercent}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-purple-400 rounded" />
            <span className="text-purple-400">快取: {cachedPercent}%</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
          <defs>
            <linearGradient id="memUsedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="memCachedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = height - padding - (value / 100) * (height - padding * 2);
            const label = `${((value / 100) * total / 1024).toFixed(0)} GB`;
            return (
              <g key={value}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#374151" strokeDasharray="3 3" />
                <text x={padding - 5} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="10">{label}</text>
              </g>
            );
          })}

          {/* Used area */}
          <motion.path
            d={usedAreaD}
            fill="url(#memUsedGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={usedPathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Cached area */}
          <motion.path
            d={cachedAreaD}
            fill="url(#memCachedGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={cachedPathD}
            fill="none"
            stroke="#a855f7"
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
