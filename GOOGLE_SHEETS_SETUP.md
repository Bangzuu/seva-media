# Google Sheets form setup

The website form is ready to send submissions to this Google Sheet:

https://docs.google.com/spreadsheets/d/1zeFgazIuDxICs6Fk6rcdiMkykDxbEAroabw0DZD_tZQ/edit?gid=0#gid=0

## One-time Google Apps Script deployment

1. Open the Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Paste the full contents of `google-apps-script.gs`.
4. Click **Deploy → New deployment**.
5. Choose **Web app**.
6. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy** and authorize the script.
8. Copy the Web App URL.
9. In `index.html`, make sure `data-form-endpoint` uses the copied Web App URL.
   It is currently set to:

   ```html
   data-form-endpoint="https://script.google.com/macros/s/AKfycbzXN8GrOaYs2-wfCzXuSLU0PT6qmeWUWmFXyFQ-EQiJM0jjgsugQGW2OXPlBOXzmbiPnQ/exec"
   ```

   If you redeploy the Google Apps Script and Google gives you a new URL, replace
   that value.

   Old placeholder:

   ```html
   data-form-endpoint="PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
   ```

The website blocks invalid email addresses before sending, and the Apps Script
also validates the email before adding a row to the Sheet.
