const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzArUpyp_Bx4L4StjiyOLOzz-ORA32e2uA56CWu7LGS0ftpOju-td-ZsC2wJkkZxlko/exec";

const form = document.getElementById("signup-form");
const statusText = document.getElementById("form-status");
const submitButton = document.getElementById("submit-button");

function setStatus(message, isError) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#b10020" : "#1f6f3a";
}

function getTrimmedValue(formData, key) {
  return String(formData.get(key) || "").trim();
}

function validateRequiredFields(payload) {
  if (!payload.name || !payload.email || !payload.phone) {
    throw new Error("請完整填寫姓名、E-mail、電話。");
  }
}

async function submitForm(event) {
  event.preventDefault();
  setStatus("", false);

  const formData = new FormData(form);
  const payload = {
    name: getTrimmedValue(formData, "name"),
    email: getTrimmedValue(formData, "email"),
    phone: getTrimmedValue(formData, "phone"),
    department: getTrimmedValue(formData, "department"),
    title: getTrimmedValue(formData, "title"),
  };

  try {
    validateRequiredFields(payload);
    if (SCRIPT_URL === "PASTE_YOUR_WEB_APP_URL_HERE") {
      throw new Error("尚未設定 Apps Script 網址，請先更新 script.js 的 SCRIPT_URL。");
    }

    submitButton.disabled = true;
    setStatus("送出中，請稍候…", false);

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`送出失敗，伺服器回應狀態：${response.status}`);
    }

    const result = await response.json();
    if (!result.ok) {
      throw new Error(result.message || "送出失敗，請稍後再試。");
    }

    form.reset();
    setStatus("報名成功，資料已送出。", false);
  } catch (error) {
    setStatus(error.message || "送出過程發生未預期錯誤。", true);
  } finally {
    submitButton.disabled = false;
  }
}

form.addEventListener("submit", submitForm);
