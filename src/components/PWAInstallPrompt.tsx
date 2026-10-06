import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check if previously dismissed
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setDismissed(true);
      }
    }

    // Show prompt after 3 seconds if not installed and not dismissed
    if (!isStandaloneMode && !dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [dismissed]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isStandalone || dismissed) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 z-50"
        >
          <div className="bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">安裝到手機</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  點擊瀏覽器選單的「加入主螢幕」，即可像 App 一樣使用
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Download className="w-3 h-3" />
              <span>
                iOS: 分享 → 加入主螢幕 | Android: 選單 → 安裝應用程式
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
