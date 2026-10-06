# 系統監控儀表板 - 打包步驟指南

將 React + Vite 專案打包成不同平台的應用程式。

---

## 📋 目錄

1. [Web 部署](#1-web-部署)
2. [Electron 桌面應用](#2-electron-桌面應用)
3. [Tauri 桌面應用](#3-tauri-桌面應用)
4. [Capacitor 手機應用](#4-capacitor-手機應用)
5. [PWA 安裝](#5-pwa-安裝)

---

## 1. Web 部署

**難度：** ⭐ 簡單  
**時間：** 5 分鐘  
**平台：** 所有瀏覽器（手機、平板、桌面）

### 步驟

#### 1.1 建置專案

```bash
npm run build
```

編譯 React 應用，生成 `dist/` 資料夾。

#### 1.2 部署到伺服器

```bash
# 方式 1: 使用 Vercel
npx vercel

# 方式 2: 使用 Netlify
npx netlify deploy --prod

# 方式 3: 手動上傳 dist/ 到任何 Web 伺服器
```

將 `dist/` 資料夾部署到靜態網站託管服務。

#### 1.3 完成

訪問您的網址即可使用。用戶可直接在瀏覽器開啟，或安裝為 PWA。

---

## 2. Electron 桌面應用

**難度：** ⭐⭐ 中等  
**時間：** 30 分鐘  
**平台：** Windows (.exe) / macOS (.dmg) / Linux (.AppImage)

### 前置需求

- Node.js 18+
- npm 或 yarn

### 步驟

#### 2.1 安裝 Electron

```bash
npm install --save-dev electron electron-builder
```

#### 2.2 建立 electron/main.js

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

#### 2.3 修改 package.json

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "electron .",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.yourcompany.systemmonitor",
    "productName": "系統監控儀表板",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "win": {
      "target": "nsis"
    },
    "mac": {
      "target": "dmg"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

#### 2.4 打包執行檔

```bash
npm run electron:build
```

#### 2.5 取得執行檔

在 `release/` 資料夾找到打包好的執行檔：

- **Windows:** `release/系統監控儀表板 Setup.exe`
- **macOS:** `release/系統監控儀表板.dmg`
- **Linux:** `release/系統監控儀表板.AppImage`

---

## 3. Tauri 桌面應用

**難度：** ⭐⭐ 中等  
**時間：** 20 分鐘  
**平台：** Windows (.exe) / macOS (.dmg) / Linux (.AppImage)

**優勢：** 比 Electron 小 10 倍，使用系統原生 WebView。

### 前置需求

- Node.js 18+
- Rust (https://rustup.rs)
- Windows: Visual Studio C++ Build Tools
- macOS: Xcode Command Line Tools
- Linux: WebKit2GTK, libappindicator

### 步驟

#### 3.1 安裝 Tauri CLI

```bash
npm install --save-dev @tauri-apps/cli
```

#### 3.2 初始化 Tauri

```bash
npx tauri init
```

依照提示設定：
- App name: 系統監控儀表板
- Window title: 系統監控儀表板
- Web assets relative path: `../dist`
- Dev server URL: `http://localhost:3000`
- Frontend dev command: `npm run dev`
- Frontend build command: `npm run build`

#### 3.3 配置 tauri.conf.json

```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "http://localhost:3000",
    "distDir": "../dist"
  },
  "package": {
    "productName": "系統監控儀表板",
    "version": "1.0.0"
  },
  "tauri": {
    "windows": [
      {
        "title": "系統監控儀表板",
        "width": 1200,
        "height": 800
      }
    ]
  }
}
```

#### 3.4 打包執行檔

```bash
npm run tauri build
```

---

## 4. Capacitor 手機應用

**難度：** ⭐⭐⭐ 進階  
**時間：** 1 小時  
**平台：** iOS (.ipa) / Android (.apk)

### 前置需求

- **iOS:** macOS + Xcode
- **Android:** Android Studio + JDK

### 步驟

#### 4.1 安裝 Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
```

#### 4.2 初始化 Capacitor

```bash
npx cap init "系統監控儀表板" "com.yourcompany.systemmonitor" --web-dir=dist
```

#### 4.3 建置 Web 應用

```bash
npm run build
```

#### 4.4 加入平台

```bash
npx cap add ios
npx cap add android
```

#### 4.5 同步資源

```bash
npx cap sync
```

#### 4.6 開啟原生 IDE

```bash
npx cap open ios      # 開啟 Xcode
npx cap open android  # 開啟 Android Studio
```

#### 4.7 建置執行檔

**iOS:**
1. 在 Xcode 中選擇您的開發團隊
2. Product > Archive
3. Distribute App

**Android:**
1. 在 Android Studio 中 Build > Generate Signed Bundle / APK
2. 選擇 APK
3. 建立或選擇金鑰庫
4. 選擇 release

---

## 5. PWA 安裝

**難度：** ⭐ 簡單  
**時間：** 0 分鐘（已內建）  
**平台：** iOS / Android / 桌面

### iOS（iPhone/iPad）

1. 用 Safari 開啟網頁
2. 點擊底部的「分享」按鈕
3. 選擇「加入主螢幕」
4. 確認名稱後即可像 App 一樣使用

### Android

1. 用 Chrome 開啟網頁
2. 點擊右上角選單（⋮）
3. 選擇「安裝應用程式」或「加入主螢幕」
4. 確認後即可使用

### 桌面（Chrome/Edge）

1. 開啟網頁
2. 點擊網址列右側的安裝圖標
3. 確認安裝

---

## 📊 方案比較

| 方案 | 難度 | 時間 | 體積 | 平台 | 適用場景 |
|------|------|------|------|------|----------|
| Web | ⭐ | 5 分鐘 | 最小 | 全平台 | 快速部署、跨平台 |
| Electron | ⭐⭐ | 30 分鐘 | ~150MB | Win/Mac/Linux | 需要桌面應用 |
| Tauri | ⭐⭐ | 20 分鐘 | ~10MB | Win/Mac/Linux | 追求小體積 |
| Capacitor | ⭐⭐⭐ | 1 小時 | ~20MB | iOS/Android | 原生手機 App |
| PWA | ⭐ | 0 分鐘 | 最小 | 全平台 | 已內建支援 |

---

## 🔗 相關資源

- [Vite 建置指南](https://vitejs.dev/guide/build.html)
- [Electron 文件](https://www.electronjs.org/docs)
- [Tauri 文件](https://tauri.app/v1/guides/)
- [Capacitor 文件](https://capacitorjs.com/docs)
- [electron-builder 文件](https://www.electron.build/)

---

## 📝 注意事項

1. **簽名與公證：** 桌面應用需要程式碼簽名才能避免安全警告
2. **App Store 審核：** 上架需要遵循各平台規範
3. **自動更新：** 可加入 `electron-updater` 或 `tauri-updater` 支援自動更新
4. **效能優化：** 打包前建議執行 `npm run typecheck` 確保無錯誤

---

*最後更新: 2026*
