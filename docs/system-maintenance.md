# 2026 宇宙科技公司員工旅遊報名系統維護手冊

## 1. 系統概覽

本系統提供員工旅遊活動資訊及線上報名，採用不需自建伺服器的靜態網站架構：

```text
瀏覽器
  └─ GitHub Pages 靜態網站
       └─ POST JSON → Google Apps Script Web App
                          └─ 寫入 Google 試算表「報名資料」
```

### 正式環境連結

- 活動網站：[GitHub Pages](https://tandysandroid-ops.github.io/2026-company-trip/)
- GitHub 儲存庫：[2026-company-trip](https://github.com/tandysandroid-ops/2026-company-trip)
- Google 試算表：[2026_公司旅遊](https://docs.google.com/spreadsheets/d/1BZLvZkSB8QydbEI_f2D4MJbLhkeBUYuawbBrV6I7k5k/edit)
- Apps Script 專案：[2026_公司旅遊 報名系統](https://script.google.com/u/0/home/projects/1ranMqb_EVyYOeZ6WYtFRKZ_OqECNRY-gBE82VkYf79_tzLAzprYGjsq5/edit)

GitHub 不接受 repo 名稱中的中文，因此儲存庫使用 `2026-company-trip`；試算表名稱仍為 `2026_公司旅遊`。

## 2. 專案檔案

| 路徑 | 用途 |
|---|---|
| `index.html` | 網頁結構、活動資訊、報名欄位；載入 CSS 與前端 JavaScript |
| `styles.css` | 色彩、卡片、欄位、響應式版面樣式 |
| `script.js` | 表單欄位讀取、必填檢查及 Apps Script 請求 |
| `cover.jpg` | 網頁橫幅圖片 |
| `apps-script/Code.gs` | Apps Script 後端原始碼 |
| `README.md` | 專案摘要及正式環境連結 |
| `docs/system-maintenance.md` | 本維護手冊 |
| `spec/` | 原始需求規格；由 `.gitignore` 排除，不應推送至 GitHub |

## 3. 頁面與報名資料

首頁依序分成三列：

1. 活動標題。
2. 圓角橫幅圖片。
3. 活動內容與報名表單；寬螢幕左右並排，視窗寬度不超過 800px 時改為上下排列。

表單欄位及試算表欄位的對應如下：

| 試算表欄位 | 表單資料 | 說明 |
|---|---|---|
| 時間戳記 | Apps Script 產生 | 提交時間 |
| 姓名 | `name` | 必填 |
| E-mail | `email` | 必填；前端目前檢查非空，未額外執行格式驗證 |
| 電話 | `phone` | 必填；欄位格式設為純文字，保留前導零 |
| 單位 | `department` | 選填 |
| 職稱 | `title` | 選填 |

資料寫入 `報名資料` 工作表。`ensureSheet()` 會在試算表中建立此工作表（若不存在）、設定第一列標題，並將電話欄設為文字格式。Apps Script 寫入電話時也加上文字前綴，以避免前導零遺失。

## 4. 報名資料流程

1. 使用者填寫表單並送出。
2. `script.js` 讀取欄位、去除前後空白，檢查姓名、E-mail、電話是否都有填寫。
3. 前端以 `POST` 將 JSON 傳給 `script.js` 中的 `SCRIPT_URL`，內容類型為 `text/plain;charset=utf-8`。
4. Apps Script 的 `doPost(e)` 解析 JSON，再次檢查必填欄位。
5. Apps Script 將時間戳記與表單資料新增到 `報名資料` 工作表。
6. Apps Script 回傳 JSON 結果；前端依 `ok` 顯示成功或錯誤訊息。成功後會清空表單。

## 5. 維護與部署

### 更新網站

1. 在本機修改 HTML、CSS、JavaScript 或圖片。
2. 若有修改 `script.js`，同時更新 `index.html` 中該腳本的版本參數，例如：

   ```html
   <script src="./script.js?v=20261030-2"></script>
   ```

   使用新的版本值可避免瀏覽器或 CDN 繼續載入舊版腳本。
3. 在瀏覽器確認版面、表單與行動裝置排列。
4. 提交並推送到 GitHub `master` 分支。GitHub Pages 從 repo 根目錄發布；推送後等待 Pages 建置完成，再檢查正式網站。
5. 不要將 `spec/` 加入 Git 提交。

### 更新 Apps Script

1. 開啟上方 Apps Script 專案。
2. 將本機 `apps-script/Code.gs` 的變更同步至 Apps Script 編輯器並儲存。
3. 若變更部署版本，從 Apps Script 的「部署」→「管理部署作業」更新 Web App 部署，確認部署設定仍為：
   - 執行身分：擁有者（Me）
   - 存取權：所有人
4. 若 Web App URL 有變更，更新 `script.js` 的 `SCRIPT_URL`，再依「更新網站」步驟推送。
5. Google 要求登入或授權時，應由擁有者在 Google 頁面完成，不要將密碼或驗證碼寫入程式碼或版本控制。

## 6. 驗證清單

部署或重大修改後，依序確認：

- [ ] GitHub Pages 網站可開啟，標題、圖片、活動時程及表單均出現。
- [ ] 桌面版活動內容與表單左右排列；窄螢幕改為上下排列。
- [ ] 未填姓名、E-mail 或電話時，表單顯示必填錯誤。
- [ ] 填寫有效資料送出後，網站顯示成功訊息。
- [ ] 試算表 `報名資料` 新增一列，欄位順序及內容正確。
- [ ] 電話欄保留前導零，且以文字儲存。
- [ ] 確認正式網站載入的是最新 JavaScript，而非快取版本。

目前已完成兩筆 Apps Script 提交測試，以及一筆從正式網站表單到試算表的端對端測試。測試資料留在試算表中；若要清理，請在確認是測試列後由試算表管理者手動刪除。

## 7. 常見問題排查

| 現象 | 檢查方式 |
|---|---|
| 顯示「尚未設定 Apps Script 網址」 | 檢查 `script.js` 的 `SCRIPT_URL` 是否為有效 Web App `/exec` URL，並確認正式網站載入新腳本版本。 |
| 網站更新後仍執行舊程式 | 確認 GitHub Pages 建置成功；更新 `index.html` 的 `script.js?v=...` 參數後重新載入網站。 |
| 顯示送出失敗或網路錯誤 | 確認 Apps Script 部署有效、存取權為「所有人」，URL 正確；檢查 Apps Script 執行記錄及瀏覽器網路錯誤。 |
| 試算表沒有新資料 | 確認送出是否顯示成功；在 Apps Script 執行記錄檢查 `doPost`，並確認查看的是 `報名資料` 工作表。 |
| 電話前導零不見 | 確認 Apps Script 已部署最新程式、`D:D` 格式為純文字，並檢查寫入資料是否仍以文字方式處理。 |
| Apps Script 編輯器沒有授權按鈕 | 授權按鈕只在需要授權的執行或部署流程中出現。若看不到，先檢查目前是否已部署；需要重新授權時再於 Google 顯示的授權頁操作。 |

## 8. 權限與資料注意事項

- 報名資料包含個人識別資訊。試算表僅應分享給有業務需要的人員，並依公司政策保存或刪除資料。
- Web App 設為「所有人」可存取，任何人都可呼叫公開端點。現有程式有必填檢查，但沒有登入、驗證碼、速率限制或重複報名防護；若出現垃圾資料或濫用，應先停用/收緊部署存取權，再評估加入防護。
- 不要將 Google 密碼、授權碼或私人憑證加入網站、Apps Script 原始碼、README 或 GitHub。
- 修改欄位名稱或順序時，必須同步更新 `index.html`、`script.js`、Apps Script `HEADER`/寫入順序及此文件。
