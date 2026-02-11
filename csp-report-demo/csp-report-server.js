const express = require('express')
const app = express()
const PORT = 3000

// 用來解析 JSON body（CSP report 會以 application/csp-report 或 application/json 發送）
app.use(express.json({ type: ['application/json', 'application/csp-report'] }))

// 啟用 CORS（讓瀏覽器可以跨域發送 report）
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// 為 HTML 檔案加上 CSP header
app.get('/csp-report-uri.html', (_req, res) => {
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "script-src 'none'; report-uri http://localhost:3000/csp-report",
  )
  res.sendFile(`${__dirname}/csp-report-uri.html`)
})

// 靜態檔案服務（讓你可以直接開啟 HTML）
// app.use(express.static(__dirname))

// CSP Report 接收端點
app.post('/csp-report', (req, res) => {
  console.log('\n🚨 收到 CSP Violation Report:')
  console.log('═'.repeat(60))
  console.log('時間:', new Date().toLocaleString('zh-TW'))
  console.log('完整 Payload:')
  console.log(JSON.stringify(req.body, null, 2))

  // 如果有 csp-report 結構，解析詳細資訊
  if (req.body['csp-report']) {
    const report = req.body['csp-report']
    console.log('\n📋 違規詳情:')
    console.log('- 違規指令:', report['violated-directive'])
    console.log('- 原始政策:', report['original-policy'])
    console.log('- 被阻擋的 URI:', report['blocked-uri'])
    console.log('- 文件 URI:', report['document-uri'])
    console.log('- 來源檔案:', report['source-file'])
    console.log('- 行號:', report['line-number'])
    console.log('- 列號:', report['column-number'])
  }

  console.log('═'.repeat(60) + '\n')

  // 回應 204 No Content（標準做法）
  res.status(204).send()
})

// 首頁說明
app.get('/', (_, res) => {
  res.send(`
    <h1>CSP Report Server 運行中 ✅</h1>
    <p>Server 正在監聽 CSP violation reports</p>
    <h2>測試步驟：</h2>
    <ol>
      <li>開啟 <a href="/csp-report-uri.html" target="_blank">csp-report-uri.html</a></li>
      <li>查看此終端機的 console log</li>
      <li>你會看到完整的 CSP violation report</li>
    </ol>
    <p><strong>Report Endpoint:</strong> <code>http://localhost:${PORT}/csp-report</code></p>
  `)
})

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         CSP Report Server 已啟動                          ║
╠════════════════════════════════════════════════════════════╣
║  📍 URL: http://localhost:${PORT}                           ║
║  📡 Report Endpoint: http://localhost:${PORT}/csp-report    ║
║  📂 靜態檔案已啟用，可直接開啟 HTML 檔案                     ║
╚════════════════════════════════════════════════════════════╝

等待接收 CSP violation reports...
  `)
})
