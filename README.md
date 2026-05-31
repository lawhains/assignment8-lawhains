# Assignment 8
  - Author: Lawson Hainsworth
  - Instructor: Justice Banson
  - Due: May 30, 2026 

## Live URLs

- **Client:** https://platescout-lawhains.vercel.app/
- **Server:** https://platescout-hainsworth.onrender.com
- **Server health check:** https://platescout-hainsworth.onrender.com/api/health

## Local setup

1. Clone the repo
2. Copy `server/.env.example` to `server/.env` and fill in `MONGO_URI` + `JWT_SECRET`
3. From the root: `npm install` (client) and `cd server && npm install` (server)
4. Two terminals: `npm run dev` (root, client) + `npm run dev` (server)
5. Open http://localhost:5173

## What I learned during deployment

The most time-consuming part of deployment was getting the client and server to talk to each other correctly. Configuring CORS on the Render backend to accept requests from the Vercel URL took several redeploy cycles to get right, since the allowed-origins list had to be updated every time the Vercel URL changed during initial setup. A surprisingly stubborn CSS issue was that the SearchBar input text was rendering as white-on-white such that the background image made white text look fine in dev, but against the image the typed characters were invisible because both the text color and the input's default background defaulted to white. Fixing it required explicitly setting `color: #ffffff` on the input and separately overriding `::placeholder` opacity, which browsers suppress by default. Next time I'd set environment variables and CORS origins before the first deploy rather than patching them iteratively, and I'd test the deployed UI in a browser everytime consistently after pushing.