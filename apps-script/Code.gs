const SHEET_NAME = '2026_公司旅遊';
const HEADER = ['時間戳記', '姓名', 'E-mail', '電話', '單位', '職稱'];

function ensureSheet() {
  const files = DriveApp.getFilesByName(SHEET_NAME);
  let spreadsheet;

  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.openById(files.next().getId());
  } else {
    spreadsheet = SpreadsheetApp.create(SHEET_NAME);
  }

  let sheet = spreadsheet.getSheetByName('報名資料');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('報名資料');
  }

  const headerRange = sheet.getRange(1, 1, 1, HEADER.length);
  const currentHeader = headerRange.getValues()[0];
  if (currentHeader.join('|') !== HEADER.join('|')) {
    headerRange.setValues([HEADER]);
  }

  sheet.getRange('D:D').setNumberFormat('@');
  return sheet;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('缺少 postData 內容');
    }

    const data = JSON.parse(e.postData.contents);
    const required = ['name', 'email', 'phone'];
    required.forEach(function (field) {
      if (!data[field] || String(data[field]).trim() === '') {
        throw new Error('欄位未填寫完整: ' + field);
      }
    });

    const sheet = ensureSheet();
    sheet.appendRow([
      new Date(),
      String(data.name).trim(),
      String(data.email).trim(),
      "'" + String(data.phone).trim(),
      String(data.department || '').trim(),
      String(data.title || '').trim(),
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, message: '報名成功' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        ok: false,
        message: error && error.message ? error.message : '伺服器錯誤',
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
