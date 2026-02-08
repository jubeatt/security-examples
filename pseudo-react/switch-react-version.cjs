const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execSync } = require('child_process')

const MAIN_JSX_OLD = `import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(<App />, document.getElementById('root'))
`

const MAIN_JSX_NEW = `import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
`

const VERSIONS = {
  old: {
    label: '舊版 (React 16.8)',
    react: '^16.8.0',
    types: '^16.8.0',
    mainJsx: MAIN_JSX_OLD,
  },
  new: {
    label: '新版 (React 19)',
    react: '^19.0.0',
    types: '^19.0.0',
    mainJsx: MAIN_JSX_NEW,
  },
}

const PKG_PATH = path.join(__dirname, 'package.json')
const MAIN_JSX_PATH = path.join(__dirname, 'src', 'main.jsx')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('\n請選擇 React 版本：')
console.log(`  1. ${VERSIONS.old.label}`)
console.log(`  2. ${VERSIONS.new.label}`)

rl.question('\n請輸入選項 (1 或 2): ', (answer) => {
  rl.close()

  const choice = answer.trim()
  if (choice !== '1' && choice !== '2') {
    console.error('\n❌ 無效的選項，請輸入 1 或 2')
    process.exit(1)
  }

  const version = choice === '1' ? VERSIONS.old : VERSIONS.new

  try {
    const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf-8'))

    pkg.dependencies['react'] = version.react
    pkg.dependencies['react-dom'] = version.react
    pkg.devDependencies['@types/react'] = version.types
    pkg.devDependencies['@types/react-dom'] = version.types

    fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n')
    fs.writeFileSync(MAIN_JSX_PATH, version.mainJsx)
    console.log(`\n✅ 已將 package.json 和 main.jsx 更新為 ${version.label}`)
  } catch (err) {
    console.error('\n❌ 更新 package.json 失敗:', err.message)
    process.exit(1)
  }

  try {
    console.log('\n正在執行 pnpm install ...\n')
    execSync('pnpm install', { cwd: __dirname, stdio: 'inherit' })
    console.log(`\n✅ 完成！已成功切換到 ${version.label}`)
  } catch (err) {
    console.error('\n❌ pnpm install 失敗，請手動執行 pnpm install')
    process.exit(1)
  }
})
