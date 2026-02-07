# Locademy

A local course player for your downloaded tutorials. Drop a course folder and get a clean, Udemy-style learning experience — offline, private, no account needed.

Built with [Tauri v2](https://v2.tauri.app), React, and Tailwind CSS.

![platforms](https://img.shields.io/badge/platforms-macOS%20%7C%20Windows%20%7C%20Linux-blue)
![license](https://img.shields.io/badge/license-MIT-green)

## Features

- **Add course folders** — point to any folder with video files and Locademy organizes them into modules
- **Auto-detect structure** — supports both nested folders (module per folder) and flat layouts
- **Track progress** — mark videos as completed, see per-module and per-course progress
- **Built-in video player** — plays mp4/webm natively, opens other formats in your system player
- **Auto-advance** — automatically marks videos as completed and plays the next one
- **Rescan courses** — pick up new videos added to a course folder
- **System theme** — follows your OS light/dark mode preference
- **Fully local** — all data stays on your machine, stored as a simple JSON file

## Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [Rust](https://rustup.rs)
- Platform-specific dependencies for Tauri: [see Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/locademy.git
cd locademy

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Folder Structure

Locademy auto-detects two course layouts:

**Nested (recommended):**
```
My Course/
├── 01 - Introduction/
│   ├── 01 - Welcome.mp4
│   └── 02 - Overview.mp4
├── 02 - Getting Started/
│   ├── 01 - Installation.mp4
│   └── 02 - First Steps.mp4
└── 03 - Advanced/
    └── 01 - Deep Dive.mp4
```

**Flat:**
```
My Course/
├── 01 - Welcome.mp4
├── 02 - Installation.mp4
└── 03 - Building Something.mp4
```

## Supported Video Formats

**Built-in player:** mp4, webm (depends on OS webview)

**System player fallback:** mp4, mkv, webm, avi, mov, wmv, flv, m4v, mpg, mpeg, 3gp, ogv, ts — any format your OS can handle

## Releases (GitHub)

Pushing a version tag builds installers and creates a draft GitHub release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The [Release](.github/workflows/release.yml) workflow runs on tags `v*`, builds for **macOS** (Intel + Apple Silicon), **Windows**, and **Linux**, then creates a draft release with the installers attached. Open the release on GitHub, edit the notes if needed, and publish.

**Required:** In the repo go to **Settings → Actions → General**, under "Workflow permissions" choose **Read and write permissions** so the workflow can create releases.

## App Icon

To replace the default icon, put your 1024x1024 PNG at the project root as `app-icon.png` and run:

```bash
npm run tauri icon app-icon.png
```

## Tech Stack

- **Tauri v2** — cross-platform desktop runtime
- **React 19** — UI framework
- **TypeScript** — type safety
- **Tailwind CSS v4** — styling
- **Rust** — backend (folder scanning, data persistence)

## License

MIT
