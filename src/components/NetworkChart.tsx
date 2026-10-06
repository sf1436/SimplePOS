import { motion } from 'framer-motion';
import { NetworkDataPoint } from '../hooks/useSystemData';
import { Wifi } from 'lucide-react';

interface NetworkChartProps {
  data: NetworkDataPoint[];
  download: number;
  upload: number;
}

export default function NetworkChart({ data, download, upload }: NetworkChartProps) {
  const width = 600;
  const height = 200;
  const padding = 40;

  const allValues = data.flatMap(d => [d.download, d.upload]);
  const maxValue = Math.max(...allValues, 100);

  const downloadPoints = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.download / maxValue) * (height - padding * 2));
    return { x, y };
  });

  const uploadPoints = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.upload / maxValue) * (height - padding * 2));
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

  const downloadPathD = createSmoothPath(downloadPoints);
  const uploadPathD = createSmoothPath(uploadPoints);

  const downloadAreaD = downloadPathD + ` L ${downloadPoints[downloadPoints.length - 1].x} ${height - padding} L ${downloadPoints[0].x} ${height - padding} Z`;
  const uploadAreaD = uploadPathD + ` L ${uploadPoints[uploadPoints.length - 1].x} ${height - padding} L ${uploadPoints[0].x} ${height - padding} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">網路流量</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-cyan-400 rounded" />
            <span className="text-cyan-400">↓ {download.toFixed(0)} MB/s</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-orange-400 rounded" />
            <span className="text-orange-400">↑ {upload.toFixed(0)} MB/s</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
          <defs>
            <linearGradient id="downloadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = height - padding - (value / 100) * (height - padding * 2);
            const label = `${((value / 100) * maxValue).toFixed(0)}`;
            return (
              <g key={value}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#374151" strokeDasharray="3 3" />
                <text x={padding - 5} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="10">{label}</text>
              </g>
            );
          })}

          {/* Download area */}
          <motion.path
            d={downloadAreaD}
            fill="url(#downloadGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={downloadPathD}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Upload area */}
          <motion.path
            d={uploadAreaD}
            fill="url(#uploadGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={uploadPathD}
            fill="none"
            stroke="#f97316"
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
