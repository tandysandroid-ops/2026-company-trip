# 2026_公司旅遊

員工旅遊活動報名網站，支援表單送出到 Google Sheet（透過 Google Apps Script）。

## 檔案說明

- `index.html`：主頁面（3 列版面）
- `styles.css`：頁面樣式
- `script.js`：表單驗證與送出邏輯
- `apps-script/Code.gs`：Google Apps Script 後端
- `docs/system-maintenance.md`：系統架構、部署與維護手冊

維護說明請參閱：[系統維護手冊](./docs/system-maintenance.md)。

## Google Apps Script

- 試算表：[2026_公司旅遊](https://docs.google.com/spreadsheets/d/1BZLvZkSB8QydbEI_f2D4MJbLhkeBUYuawbBrV6I7k5k/edit)
- Apps Script 專案：[2026_公司旅遊 報名系統](https://script.google.com/u/0/home/projects/1ranMqb_EVyYOeZ6WYtFRKZ_OqECNRY-gBE82VkYf79_tzLAzprYGjsq5/edit)
- Web App 已部署為「以擁有者身分執行」，並設為「所有人」可存取。部署網址已設定於 `script.js`。
- 後端原始碼：`apps-script/Code.gs`

## GitHub Pages

Pages 網址：https://tandysandroid-ops.github.io/2026-company-trip/
