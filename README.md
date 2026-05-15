<div align="center">
  <h1>🚀 Odoo Tech Support Messages</h1>
  <p><strong>Blazing-fast ⚡ pre-defined message templates for Odoo Support Agents</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Chrome_Extension-v3-4285F4?logo=googlechrome&logoColor=white" alt="Chrome Extension v3">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
  </p>
  <br>
  <img src="./assets/demo1.gif" width="400" alt="Demo 1">
  <img src="./assets/demo2.gif" width="400" alt="Demo 2">
</div>

---

## 📖 About

A Chrome extension for **Odoo Tech Support agents** to instantly insert pre-built message templates into the mail composer. Stop typing the same responses — just click and send! 🎯

Includes **10 ready-to-use templates** with smart placeholders for dynamic content like database links, issue explanations, and fix instructions.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📋 **10 Pre-built Templates** | Ready-to-use messages for common support scenarios |
| 🧠 **Smart Placeholders** | Edit `[link here]`, `[Explain an issue]` before sending |
| 👤 **Dynamic Name** | Use `{name}` — auto-replaced with your name |
| ✏️ **Custom Messages** | Add your own templates on the fly |
| 🔄 **Edit/Reset** | Customize any message, reset to default anytime |
| 💾 **Persistent Storage** | All data saved across browser sessions |

## 🛠️ Installation

```bash
git clone https://github.com/yourusername/odoo-tech-support-message.git
```

1. Open Chrome → navigate to `chrome://extensions/`
2. Toggle **"Developer mode"** (top right) 🔧
3. Click **"Load unpacked"** → select the extension folder 📂
4. The extension icon appears in your toolbar 🎉

## 🎮 Usage

1. Click the extension icon 🖱️
2. Enter your name → hit **Save** ✅
3. Click any message template to insert into Odoo's mail composer 📨
4. Tweak placeholders like `[link here]` before sending ✍️

## 💬 Standard Messages

| # | Template | Description |
|---|----------|-------------|
| 🔍 | **Investigating** | Issue under investigation |
| 🐛 | **Standard Bug Confirmed** | Standard bug in system |
| 📞 | **Schedule Call** | Schedule a call with meet link |
| ✅ | **Fix Deployed** | Fix deployed to database |
| 🚀 | **Fix in Pipeline** | Fix in deployment pipeline |
| 🏷️ | **Known Bug** | Known bug reported to bug-fix team |
| 👁️ | **View Fix Applied** | View/inactive fix with steps |
| 🗄️ | **Dummy DB Verification** | Temporary DB for verification |
| 🏭 | **Production Deployed** | Fix deployed to production |
| 🧪 | **Staging Verification** | Staging environment fix |

## 📌 Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{name}` | Your name (auto-replaced) |
| `[link here]` | Database/staging link |
| `[Explain an issue here]` | Describe the issue |
| `[Explain cause here]` | Root cause explanation |
| `[Time here]` | Scheduled time |
| `[Step 1/2/3 here]` | Fix steps |

## 📁 Project Files

| File | Purpose |
|------|---------|
| `manifest.json` | 📜 Chrome extension manifest (v3) |
| `popup.html` | 🖼️ Extension popup UI |
| `popup.js` | ⚙️ Popup logic & message management |
| `content.js` | 🔌 Content script for Odoo integration |
| `icon*.png` | 🎨 Extension icons |

## 🚧 Missing Features (PRs Welcome!)

These features are **not yet implemented** — want to contribute? Go for it! 💪

- 🤖 **AI-generated messages** — Auto-generate support replies using AI and post directly to the Odoo chatter
- 📝 **Log note support** — Create and insert log notes (not just messages)
- 🌍 **Multi-language support** — Internationalize the UI and message templates

> Found a bug? 🐛 Have an idea? 💡 Feel free to [open an issue](https://github.com/yourusername/odoo-tech-support-message/issues) or submit a PR!

## 📄 License

MIT — do whatever you want, just don't blame us 😄