const SPREADSHEET_ID = "1zeFgazIuDxICs6Fk6rcdiMkykDxbEAroabw0DZD_tZQ";
const SHEET_ID = 0;

function doPost(event) {
  try {
    const payload = parsePayload_(event);
    const name = sanitize_(payload.name);
    const company = sanitize_(payload.company);
    const email = sanitize_(payload.email).toLowerCase();
    const message = sanitize_(payload.message);
    const website = sanitize_(payload.website);

    if (website) {
      return json_({ ok: true });
    }

    if (!name || !email || !message) {
      return json_(
        { ok: false, error: "Please complete name, email, and message." },
        400
      );
    }

    if (!isValidEmail_(email)) {
      return json_({ ok: false, error: "Please enter a valid email address." }, 400);
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(spreadsheet);
    ensureHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      name,
      company,
      email,
      message,
      "Seva Media website",
    ]);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: "Submission failed. Please try again." }, 500);
  }
}

function parsePayload_(event) {
  if (!event || !event.postData || !event.postData.contents) return {};

  const contentType = event.postData.type || "";
  if (
    contentType.indexOf("application/json") !== -1 ||
    contentType.indexOf("text/plain") !== -1
  ) {
    return JSON.parse(event.postData.contents);
  }

  return event.parameter || {};
}

function getOrCreateSheet_(spreadsheet) {
  const targetSheet = spreadsheet
    .getSheets()
    .find((sheet) => sheet.getSheetId() === SHEET_ID);

  return targetSheet || spreadsheet.getSheets()[0] || spreadsheet.insertSheet("Submissions");
}

function ensureHeaders_(sheet) {
  const headers = [
    "Date",
    "Name",
    "Company",
    "Email",
    "How can we help?",
    "Source",
  ];
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = firstRow.some((cell) => String(cell).trim() !== "");

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function sanitize_(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
