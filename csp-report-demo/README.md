# CSP Report-Only Demo

這個 demo 展示如何使用 Content Security Policy 的 `report-uri` 指令來接收 CSP 違規報告。

## 功能說明

- 使用 `Content-Security-Policy-Report-Only`，只會回報違規但不會真正阻擋
- 當頁面中的 inline script 違反 `script-src 'none'` 政策時，瀏覽器會發送 POST 請求到指定的 `report-uri`
- Express server 會接收並在 console 顯示完整的違規資訊

## 重要觀念

⚠️ **CSP 的 `report-uri` 指令必須透過 HTTP Response Header 設定，不能使用 `<meta>` 標籤！**

如果在 HTML 中使用 `<meta http-equiv="Content-Security-Policy-Report-Only">`，瀏覽器會顯示錯誤：

```
The report-only Content Security Policy was delivered via a <meta> element, which is disallowed. The policy has been ignored.
```

因此，本 demo 透過 Express server 在回傳 HTML 時加上 CSP header。

## 使用方式

1. 安裝依賴：

   ```bash
   pnpm install
   ```

2. 啟動 Report Server：

   ```bash
   pnpm start
   ```

3. 開啟瀏覽器訪問：
   - 首頁說明：http://localhost:3000
   - 測試頁面：http://localhost:3000/csp-report-uri.html

4. 查看終端機的 console log，會看到完整的 CSP violation report

## Report Payload 範例

瀏覽器會發送類似以下的 JSON payload：

```json
{
  "csp-report": {
    "document-uri": "http://localhost:3000/csp-report-uri.html",
    "violated-directive": "script-src-elem",
    "effective-directive": "script-src-elem",
    "original-policy": "script-src 'none'; report-uri http://localhost:3000/csp-report",
    "disposition": "report",
    "blocked-uri": "inline",
    "line-number": 14,
    "column-number": 7,
    "source-file": "http://localhost:3000/csp-report-uri.html",
    "status-code": 200
  }
}
```

## 技術細節

- **Content-Security-Policy-Report-Only**：只回報不阻擋，適合測試階段
- **report-uri**：指定接收違規報告的 endpoint（較舊的標準，但廣泛支援）
- 瀏覽器會以 `application/csp-report` 或 `application/json` Content-Type 發送 POST 請求
- Server 應回應 `204 No Content` 狀態碼
