# Printlert Portable Builds

This guide explains how to create a single-file executable or a portable server bundle.

## Option A: Single-file executable (recommended)
Build self-contained executables with `pkg` (bundles Node.js runtime).

### Prerequisites
- Windows: PowerShell or CMD
- macOS/Linux: bash
- Internet access to install dev dependency

### Steps
1. Install dependencies (first time):
```bash
npm install
```
2. Build executable (Windows):
```bash
npm run build:exe:win
```
This creates `dist/printlert.exe`.

3. Prepare environment:
- Copy `env.example` to `.env` next to the executable, or ensure `.env` is in the working directory when launching.
- Ensure `public/` is present next to the executable if you want to customize UI assets. Assets are also embedded in the executable for convenience.

4. Run:
```bash
./dist/printlert.exe
```
Then open `http://localhost:3000`.

### Notes
- Ports, SMTP, and Twilio credentials are read from `.env`.
- Logs are written to `logs/` relative to the working directory.
- To build for other OSes:
```bash
npm run build:exe:all
```

## Option B: Portable server folder
Use a system with Node.js installed and run the included server directly.

1. On the build machine:
```bash
npm ci --only=production
```
2. Copy to target:
- `server.js`, `package.json`, `public/`, `.env`, and the `node_modules` folder
3. Start:
```bash
node server.js
```

## Troubleshooting
- If assets are not found, ensure `public/index.html` exists.
- If port is in use, change `PORT` in `.env`.
- On Windows SmartScreen, you may need to unblock the executable from file properties.
