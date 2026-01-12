# Pixel Art Quiz Game (React + Google Sheets)

這是一個使用 React (Vite) 開發的像素風格闖關問答遊戲。後端資料庫使用 Google Sheets，透過 Google Apps Script (GAS) 進行 API 串接。

## 🎮 功能特色
- **像素風格 UI**：懷舊街機風格設計。
- **動態關主**：使用 DiceBear API 生成像素關主圖片。
- **Google Sheets 整合**：題目管理與成績記錄完全在 Google Sheets 上運作。

---

## 🌐 自動部署 (GitHub Pages)

本專案已設定 **GitHub Actions**，推送到 GitHub 上即可自動部署。

### 1. 設定 GitHub Repository
1. 將專案推送到 GitHub。
2. 進入 Repository 的 **Settings** > **Pages**。
3. 在 **Source** 選擇 **GitHub Actions**。

### 2. 設定 Secrets (關鍵步驟)
為了讓部署後的網頁能連線到您的 Google Apps Script，需要設定 GitHub Secrets：
1. 進入 **Settings** > **Secrets and variables** > **Actions**。
2. 點擊 **New repository secret**。
3. **Name**: `VITE_GOOGLE_APP_SCRIPT_URL`
4. **Value**: `您的 Web App URL` (與 .env 中的相同)

### 3. 自動部署
- 當您 Push 程式碼到 `main` 或 `master` 分支時，GitHub Action 會自動觸發。
- 部署完成後，您可以在 GitHub Pages 設定頁面看到您的遊戲網址！

---

## 🚀 安裝與執行 (前端)

### 1. 環境準備
請確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18 以上)。

### 2. 安裝依賴
在專案根目錄下執行：
```bash
npm install
```

### 3. 設定環境變數
將 `.env` 檔案中的設定修改為您的實際連結：
```env
VITE_GOOGLE_APP_SCRIPT_URL=您的_GOOGLE_APPS_SCRIPT_WEB_APP_URL
VITE_PASS_THRESHOLD=3  # 通過門檻 (答對幾題及格)
VITE_QUESTION_COUNT=5  # 每次遊戲隨機取出的題目數
```

### 4. 啟動開發伺服器
```bash
npm run dev
```
打開瀏覽器訪問 `http://localhost:5173` 即可開始遊玩。

---

## 📊 Google Sheets 設定 (資料庫)

### 1. 建立試算表
在 Google Drive 建立一個新的 Google Sheets，並建立以下兩個工作表 (Tabs)：

#### 工作表 1: `題目`
請依照下方欄位順序建立標頭 (Row 1)：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | Question | OptionA | OptionB | OptionC | OptionD | Answer |

#### 工作表 2: `回答`
請依照下方欄位順序建立標頭 (Row 1)：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| UserID | PlayCount | TotalScore | MaxScore | FirstClearScore | TriesToPass | LastPlayTime |

---

## 🛠️ Google Apps Script 設定 (後端 API)

### 1. 開啟腳本編輯器
在您的 Google Sheet 中，點選上方選單的 **擴充功能 (Extensions)** > **Apps Script**。

### 2. 貼上程式碼
清除編輯器中原本的程式碼，將本專案目錄下的 `Code.js` 內容完整複製貼上。

### 3. 部署為網路應用程式
1. 點擊右上角 **部署 (Deploy)** > **新增部署 (New deployment)**。
2. 點選左側齒輪圖示 > **網頁應用程式 (Web app)**。
3. 設定如下：
    - **執行身份 (Execute as)**: `我 (Me)`
    - **誰可以存取 (Who has access)**: `所有人 (Anyone)` **(重要！否則前端無法存取)**
4. 點擊 **部署 (Deploy)**。
5. 複製產生的 **網頁應用程式網址 (Web App URL)**。
6. 將此網址貼回專案的 `.env` 檔案中 (`VITE_GOOGLE_APP_SCRIPT_URL`)。

---

## 📝 測試題庫：生成式 AI 基礎知識 (可以直接複製貼上到 `題目` 工作表)

請將下表內容複製到您的 Google Sheet `題目` 工作表中 (從 A2 儲存格開始貼上)：

| 1 | 2 (題目) | 3 (A) | 4 (B) | 5 (C) | 6 (D) | 7 (解答) |
|---|---|---|---|---|---|---|
| 1 | ChatGPT 是由哪家公司開發的？ | Google | Apple | OpenAI | Microsoft | OpenAI |
| 2 | 生成式 AI 主要透過什麼方式學習？| 死背硬記 | 監督式學習與大量數據 | 隨機猜測 | 手動輸入規則 | 監督式學習與大量數據 |
| 3 | Midjourney 是用來生成什麼的 AI 工具？ | 文字 | 圖片 | 程式碼 | 音樂 | 圖片 |
| 4 | LLM 在 AI 領域代表什麼縮寫？ | Long Learning Map | Large Language Model | Local Link Mode | Low Level Machine | Large Language Model |
| 5 | 以下哪個不是生成式 AI 的應用？ | 撰寫電子郵件 | 繪製插畫 |  Excel 加法運算 | 編寫程式碼 | Excel 加法運算 |
| 6 | 生成式 AI 可能會產生錯誤資訊，這種現象被稱為？ | 幻覺 (Hallucination) | 做夢 (Dreaming) | 錯誤 (Error) | 說謊 (Lying) | 幻覺 (Hallucination) |
| 7 | Transformer 模型架構最初是用於解決什麼問題？ | 圖像識別 | 機器翻譯 | 音樂生成 | 影片剪輯 | 機器翻譯 |
| 8 | Stable Diffusion 主要用於哪種類型的生成？ | 文字轉語音 | 文字轉圖像 | 文字轉影片 | 語音轉文字 | 文字轉圖像 |
| 9 | GitHub Copilot 主要是用來協助什麼工作？ | 繪圖 | 寫作 | 寫程式 | 剪片 | 寫程式 |
| 10 | Prompt Engineering (提示工程) 的主要目的是？ | 設計硬體 | 優化資料庫 | 引導 AI 生成更準確的結果 | 編寫組合語言 | 引導 AI 生成更準確的結果 |
