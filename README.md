# YouTubeClone

YouTube-style React app for watching videos and Shorts, searching, channel pages, studio uploads, downloads, and subscriptions.

Live site: [https://youtube-clone-two-iota-44.vercel.app/](https://youtube-clone-two-iota-44.vercel.app/)

## Features

- Home feed, trending, search, and related videos
- Watch page with likes, comments, share, save, and download
- Real YouTube subscriber counts; a local subscribe adds +1 on top of that number
- Downloads library (saved videos and file download)
- Channel pages, subscriptions, and studio upload / create channel

## Setup

```bash
npm install
npm start
```

Runs at http://localhost:3000

Optional env (see `.env.example`):

- `REACT_APP_API_URL` — API base URL
- `REACT_APP_YT_KEY_1` … `REACT_APP_YT_KEY_4` — YouTube Data API keys

```bash
npm run build
```
