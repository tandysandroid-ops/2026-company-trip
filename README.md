# 2026_公司旅遊

員工旅遊活動報名網站，支援表單送出到 Google Sheet（透過 Google Apps Script）。

## 檔案說明

- `index.html`：主頁面（3 列版面）
- `styles.css`：頁面樣式
- `script.js`：表單驗證與送出邏輯
- `apps-script/Code.gs`：Google Apps Script 後端

## Google Apps Script 佈署步驟

1. 建立 Google Apps Script 專案並貼上 `apps-script/Code.gs` 內容。
2. 在 Apps Script 中執行 `ensureSheet()`（第一次會建立/初始化 `2026_公司旅遊` 試算表）。
3. 部署為 Web App：
   - Execute as：`Me`
   - Who has access：`Anyone`
4. 取得 Web App URL，貼到 `script.js` 的 `SCRIPT_URL`。

## GitHub Pages

Pages 網址：`待部署後填入`
