import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  progress?: number;
  delay?: number;
}

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color, progress, delay = 0 }: StatCardProps) {
  const colors = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative bg-gray-800/50 backdrop-blur-sm border ${colors.border} rounded-2xl p-5 overflow-hidden hover:shadow-lg ${colors.glow} transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <span className="text-xs text-gray-500 font-mono">{title}</span>
      </div>

      <div className="mb-2">
        <span className={`text-2xl font-bold ${colors.text}`}>{value}</span>
      </div>

      <p className="text-xs text-gray-400 mb-3">{subtitle}</p>

      {progress !== undefined && (
        <div className="relative">
          <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-400' : color === 'blue' ? 'bg-blue-400' : color === 'purple' ? 'bg-purple-400' : color === 'orange' ? 'bg-orange-400' : color === 'red' ? 'bg-red-400' : 'bg-cyan-400'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progress)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}%</span>
        </div>
      )}

      {/* Background decoration */}
      <div className={`absolute -right-4 -bottom-4 w-20 h-20 ${colors.bg} rounded-full blur-2xl opacity-50`} />
    </motion.div>
  );
}
