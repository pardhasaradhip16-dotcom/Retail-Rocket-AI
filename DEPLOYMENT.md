# RetailRocket AI — Full-Stack MERN Deployment Guide

This project is architected so that the complete MERN application can be deployed as a unified service or separated into frontend and backend tiers.

---

## Option 1: Deploy to Vercel (Frontend & Serverless Backend)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Complete MERN Stack RetailRocket AI project"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Set Environment Variables:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/retailrocket?retryWrites=true&w=majority` (free MongoDB Atlas cluster)
   - `NODE_ENV`: `production`
5. Click **Deploy**. Vercel uses `vercel.json` to automatically build the Vite client and deploy the Node.js API.

---

## Option 2: Deploy to Render (Unified Single Service — Recommended for Hackathons)

Render allows running the Node/Express backend which serves both the REST API and the compiled React frontend from a single web service.

1. Create a free database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register):
   - Create a free Shared Cluster (M0).
   - In **Network Access**, allow access from anywhere (`0.0.0.0/0`).
   - In **Database Access**, create a user and copy the connection string.
2. In [Render](https://render.com/), click **New Web Service** and connect your repository.
3. Configuration:
   - **Environment**: `Node`
   - **Build Command**: `npm run install:all && npm run seed && npm run build`
   - **Start Command**: `npm run server`
4. Add Environment Variable:
   - `MONGO_URI`: `<Your MongoDB Atlas Connection String>`
   - `NODE_ENV`: `production`
5. Click **Create Web Service**. Your app will be live at `https://<your-app>.onrender.com`.

---

## Option 3: Instant Docker Deployment

Run the complete MERN application with MongoDB containerized locally or on any VPS (AWS EC2, DigitalOcean, Linode):

```bash
docker compose up --build -d
```

- Web Dashboard & API: `http://localhost:5000`
- MongoDB Container: `mongodb://localhost:27017`

---

## Option 4: Local Full-Stack Development

```bash
# 1. Install all dependencies across root, server, and client
npm run install:all

# 2. Seed MongoDB with products, visitors, and 719 events
npm run seed

# 3. Launch both Express server (port 5000) and React client (port 5173) concurrently
npm run dev
```

