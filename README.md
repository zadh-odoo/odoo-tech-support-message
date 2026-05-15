# Odoo Tech Support Messages Extension

A Chrome extension for quickly inserting pre-defined tech support message templates into Odoo's mail composer.

![Extension Demo](./assets/demo.gif)

## Description

This extension is designed for Odoo Tech Support agents to quickly send standardized responses. It includes 10 pre-built Odoo-specific message templates with placeholders for dynamic content like database links, issue explanations, and fix instructions.

## Features

- **10 Pre-built Odoo Support Messages** - Ready-to-use templates for common support scenarios
- **Smart Placeholders** - Edit placeholders like [link here], [Explain an issue] before sending
- **Dynamic Name** - Use `{name}` placeholder to automatically insert your name
- **Custom Messages** - Add your own custom message templates
- **Edit/Reset Standard Messages** - Customize any message, reset to default anytime
- **Persistent Storage** - Your name, custom messages, and edits are saved across browser sessions

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your browser toolbar

## Usage

1. Click the extension icon in your browser toolbar
2. Enter your name and click "Save"
3. Click on any message template to insert it into Odoo's mail composer
4. Edit the placeholder content (like [link here], [Explain an issue]) before sending

## Standard Messages

1. **Investigating** - Issue under investigation
2. **Standard Bug Confirmed** - Standard bug in system
3. **Schedule Call** - Schedule a call with meet link
4. **Fix Deployed** - Fix deployed to database
5. **Fix in Pipeline** - Fix in deployment pipeline
6. **Known Bug** - Known bug reported to bug-fix team
7. **View Fix Applied** - View/inactive fix with steps
8. **Dummy DB Verification** - Temporary DB for verification
9. **Production Deployed** - Fix deployed to production
10. **Staging Verification** - Staging environment fix

## Placeholders

- `{name}` - Your name (auto-replaced)
- `[link here]` - Database/staging link
- `[Explain an issue here]` - Describe the issue
- `[Explain cause here]` - Root cause explanation
- `[Time here]` - Scheduled time
- `[Step 1/2/3 here]` - Fix steps

## Files

- `manifest.json` - Chrome extension manifest (v3)
- `popup.html` - Extension popup UI
- `popup.js` - Popup logic and message management
- `content.js` - Content script for inserting messages into Odoo
- `icon*.png` - Extension icons

## License

MIT