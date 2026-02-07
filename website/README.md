# Locademy website

Landing page for [Locademy](https://github.com/swimshahriar/locademy). Built with Next.js and Tailwind.

- **Star count** and **forks** from GitHub API
- **Download** buttons from the latest GitHub Release (macOS x64, Windows, Linux)
- **How to set up on every platform** — install steps for macOS, Windows, and Linux
- Cached every 60s to stay within API limits

## Run locally

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Import the **same repo** (locademy) in Vercel.
2. Set **Root Directory** to `website`.
3. Deploy. Vercel will run `npm install` and `npm run build` inside `website/` only.
