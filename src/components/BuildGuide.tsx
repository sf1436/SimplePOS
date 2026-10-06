import { motion } from 'framer-motion';
import { Globe, Monitor, Smartphone, Package, Terminal, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface BuildGuideProps {
  onClose: () => void;
}

export default function BuildGuide({ onClose }: BuildGuideProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const buildMethods = [
    {
      id: 'web',
      icon: Globe,
      title: 'Web 部署',
      subtitle: '最簡單，支援所有裝置',
      color: 'emerald',
      difficulty: '簡單',
      time: '5 分鐘',
      platforms: ['所有瀏覽器', '手機', '平板', '桌面'],
      steps: [
        {
          title: '建置專案',
          command: 'npm run build',
          description: '編譯 React 應用，生成 dist/ 資料夾',
        },
        {
          title: '部署到伺服器',
          command: '# 方式 1: 使用 Vercel\nnpx vercel\n\n# 方式 2: 使用 Netlify\nnpx netlify deploy --prod\n\n# 方式 3: 手動上傳 dist/ 到任何 Web 伺服器',
          description: '將 dist/ 資料夾部署到靜態網站託管服務',
        },
        {
          title: '完成',
          command: '# 訪問您的網址即可使用',
          description: '用戶可直接在瀏覽器開啟，或安裝為 PWA',
        },
      ],
    },
    {
      id: 'electron',
      icon: Monitor,
      title: 'Electron 桌面應用',
      subtitle: 'Windows / macOS / Linux',
      color: 'blue',
      difficulty: '中等',
      time: '30 分鐘',
      platforms: ['Windows (.exe)', 'macOS (.dmg)', 'Linux (.AppImage)'],
      steps: [
        {
          title: '安裝 Electron',
          command: 'npm install --save-dev electron electron-builder',
          description: '安裝 Electron 和打包工具',
        },
        {
          title: '建立 electron/main.js',
          command: `const { app, BrowserWindow } = require('electron');\nconst path = require('path');\n\nfunction createWindow() {\n  const win = new BrowserWindow({\n    width: 1200,\n    height: 800,\n    webPreferences: {\n      nodeIntegration: false,\n      contextIsolation: true,\n    },\n  });\n\n  win.loadFile(path.join(__dirname, '../dist/index.html'));\n}\n\napp.whenReady().then(createWindow);\n\napp.on('window-all-closed', () => {\n  if (process.platform !== 'darwin') app.quit();\n});`,
          description: '建立 Electron 主進程檔案',
        },
        {
          title: '修改 package.json',
          command: `{\n  "main": "electron/main.js",\n  "scripts": {\n    "electron:dev": "electron .",\n    "electron:build": "npm run build && electron-builder"\n  },\n  "build": {\n    "appId": "com.yourcompany.systemmonitor",\n    "productName": "系統監控儀表板",\n    "directories": {\n      "output": "release"\n    },\n    "files": [\n      "dist/**/*",\n      "electron/**/*"\n    ],\n    "win": {\n      "target": "nsis"\n    },\n    "mac": {\n      "target": "dmg"\n    },\n    "linux": {\n      "target": "AppImage"\n    }\n  }\n}`,
          description: '設定 Electron 配置和打包選項',
        },
        {
          title: '打包執行檔',
          command: 'npm run electron:build',
          description: '建置 Web 應用並打包成桌面執行檔',
        },
        {
          title: '取得執行檔',
          command: '# Windows: release/系統監控儀表板 Setup.exe\n# macOS: release/系統監控儀表板.dmg\n# Linux: release/系統監控儀表板.AppImage',
          description: '在 release/ 資料夾找到打包好的執行檔',
        },
      ],
    },
    {
      id: 'tauri',
      icon: Package,
      title: 'Tauri 桌面應用',
      subtitle: '更輕量的替代方案',
      color: 'purple',
      difficulty: '中等',
      time: '20 分鐘',
      platforms: ['Windows (.exe)', 'macOS (.dmg)', 'Linux (.AppImage)'],
      steps: [
        {
          title: '安裝 Tauri CLI',
          command: 'npm install --save-dev @tauri-apps/cli',
          description: '安裝 Tauri 命令列工具',
        },
        {
          title: '初始化 Tauri',
          command: 'npx tauri init',
          description: '初始化 Tauri 專案，設定應用程式名稱和圖標',
        },
        {
          title: '配置 tauri.conf.json',
          command: `{\n  "build": {\n    "beforeBuildCommand": "npm run build",\n    "beforeDevCommand": "npm run dev",\n    "devPath": "http://localhost:3000",\n    "distDir": "../dist"\n  },\n  "package": {\n    "productName": "系統監控儀表板",\n    "version": "1.0.0"\n  },\n  "tauri": {\n    "windows": [\n      {\n        "title": "系統監控儀表板",\n        "width": 1200,\n        "height": 800\n      }\n    ]\n  }\n}`,
          description: '設定 Tauri 配置檔',
        },
        {
          title: '打包執行檔',
          command: 'npm run tauri build',
          description: '建置並打包成桌面執行檔（比 Electron 小 10 倍）',
        },
      ],
    },
    {
      id: 'capacitor',
      icon: Smartphone,
      title: 'Capacitor 手機應用',
      subtitle: '原生 iOS / Android App',
      color: 'orange',
      difficulty: '進階',
      time: '1 小時',
      platforms: ['iOS (.ipa)', 'Android (.apk)'],
      steps: [
        {
          title: '安裝 Capacitor',
          command: 'npm install @capacitor/core @capacitor/cli\nnpm install @capacitor/ios @capacitor/android',
          description: '安裝 Capacitor 核心和平台套件',
        },
        {
          title: '初始化 Capacitor',
          command: 'npx cap init "系統監控儀表板" "com.yourcompany.systemmonitor" --web-dir=dist',
          description: '初始化 Capacitor 專案',
        },
        {
          title: '建置 Web 應用',
          command: 'npm run build',
          description: '建置 React 應用',
        },
        {
          title: '加入平台',
          command: 'npx cap add ios\nnpx cap add android',
          description: '加入 iOS 和 Android 平台',
        },
        {
          title: '同步資源',
          command: 'npx cap sync',
          description: '同步 Web 資源到原生專案',
        },
        {
          title: '開啟原生 IDE',
          command: 'npx cap open ios      # 開啟 Xcode\nnpx cap open android  # 開啟 Android Studio',
          description: '在原生 IDE 中建置和簽名應用',
        },
        {
          title: '建置執行檔',
          command: '# iOS: 在 Xcode 中 Product > Archive > Distribute\n# Android: 在 Android Studio 中 Build > Generate Signed APK',
          description: '在原生 IDE 中建置最終執行檔',
        },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
      blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
      orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-950/95 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">打包步驟指南</h1>
            <p className="text-sm sm:text-base text-gray-400">將系統監控儀表板打包成不同平台的應用程式</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Build Methods */}
        <div className="space-y-6">
          {buildMethods.map((method) => {
            const colors = getColorClasses(method.color);
            const Icon = method.icon;

            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
              >
                {/* Method Header */}
                <div className="p-5 sm:p-6 border-b border-gray-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white">{method.title}</h2>
                        <p className="text-xs sm:text-sm text-gray-400">{method.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-500">難度:</span>
                      <span className={colors.text}>{method.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-500">時間:</span>
                      <span className="text-gray-300">{method.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-500">平台:</span>
                      <span className="text-gray-300">{method.platforms.join(' / ')}</span>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="p-5 sm:p-6 space-y-4">
                  {method.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="relative">
                      {/* Step Number */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <span className={`text-sm font-bold ${colors.text}`}>{stepIndex + 1}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400 mb-3">
                            {step.description}
                          </p>

                          {/* Command Box */}
                          <div className="relative group">
                            <pre className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm">
                              <code className="text-gray-300 font-mono whitespace-pre">{step.command}</code>
                            </pre>
                            <button
                              onClick={() => copyToClipboard(step.command, stepIndex)}
                              className="absolute top-2 right-2 p-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                              title="複製指令"
                            >
                              {copiedIndex === stepIndex ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Connector Line */}
                      {stepIndex < method.steps.length - 1 && (
                        <div className="absolute left-4 sm:left-[18px] top-10 bottom-0 w-px bg-gray-700/50" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-5 sm:p-6"
        >
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            快速開始建議
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-emerald-400">Web 部署</strong>：最快上手，5 分鐘內完成，支援所有裝置</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-blue-400">Electron</strong>：需要桌面應用時選擇，支援 Windows/Mac/Linux</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-purple-400">Tauri</strong>：追求更小體積時選擇，比 Electron 小 10 倍</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-orange-400">Capacitor</strong>：需要原生手機 App 時選擇，可上架 App Store</span>
            </p>
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 sm:p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">相關資源</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://www.electronjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Monitor className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Electron 文件</span>
              <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
            </a>
            <a
              href="https://tauri.app/v1/guides/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Package className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Tauri 文件</span>
              <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
            </a>
            <a
              href="https://capacitorjs.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Smartphone className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Capacitor 文件</span>
              <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
            </a>
            <a
              href="https://vitejs.dev/guide/build.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-300">Vite 建置指南</span>
              <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 pb-8">
          <p>打包步驟指南 v1.0 | 最後更新: {new Date().toLocaleDateString('zh-TW')}</p>
        </div>
      </div>
    </motion.div>
  );
}
