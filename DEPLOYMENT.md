# 🚀 RetailRocket AI — Full-Stack MERN Deployment Guide
### Complete Deployment Instructions for **Vercel** and **Render**

This production MERN stack application can be deployed in two battle-tested ways:
- **Approach A (Recommended — 1 Single Unified Service on Render)**: Hosts the Express server, SVD AI engine, and compiled React frontend together under a single URL with zero CORS configuration.
- **Approach B (Vercel Frontend + Render Backend or Vercel Serverless)**: Hosts the Vite React frontend on Vercel's global edge network, communicating with the backend API.

---

## 📦 Step 0: Push Your Code to GitHub (Prerequisite)

Before deploying to either Vercel or Render, commit your local project to a GitHub repository:

1. Open your terminal in the project directory:
   ```bash
   git add .
   git commit -m "Production MERN Stack AI Recommender with Cart, Delivery, and JWT Auth"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g. `retail-rocket-mern`).
3. Link and push your repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

---

## 🌐 Method 1: Deploy to Render (Unified Full-Stack MERN — Easiest & Most Reliable)

Render provides persistent Node.js servers, making it ideal for hosting the Express backend, Truncated SVD AI model, and React dashboard together under **one single URL**.

### Step 1: Get a Free MongoDB Atlas Database (2 minutes)
*(Note: If you skip this, the app still functions normally using its automatic in-memory cache!)*
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a **Free Shared Cluster (M0)**.
3. Under **Security → Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (`0.0.0.0/0`)**.
4. Under **Security → Database Access**, create a user (e.g. `admin` and a password).
5. Click **Connect → Drivers** and copy your connection string:
   ```text
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/retailrocket?retryWrites=true&w=majority
   ```

### Step 2: Deploy on Render
1. Log in to [Render.com](https://render.com/).
2. Click the blue **"New +"** button in the top right and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and select your GitHub repository.
4. Fill in the service settings:
   - **Name**: `retailrocket-mern` (or your choice)
   - **Language / Environment**: `Node`
   - **Branch**: `main`
   - **Region**: Closest to you (e.g., `Singapore`, `Frankfurt`, or `Oregon`)
   - **Build Command**:
     ```bash
     npm run install:all && npm run seed && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run server
     ```
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(Paste your MongoDB Atlas connection string from Step 1)*
6. Click **"Deploy Web Service"**.
7. Render will build the React bundle, seed the dataset, and start the unified server. Once complete, your live site will be ready at:
   ```text
   https://retailrocket-mern.onrender.com
   ```

---

## ⚡ Method 2: Deploy to Vercel (Vite Frontend & Serverless Backend)

Vercel deploys the compiled Vite SPA to its edge CDN and executes API routes via serverless functions defined in `/api`.

### Step 1: Import Project to Vercel
1. Log in to [Vercel.com](https://vercel.com/).
2. Click **"Add New..." → "Project"**.
3. Import your GitHub repository (`retail-rocket-mern`).

### Step 2: Configure Build Settings
In the configuration screen:
- **Framework Preset**: `Vite` (or `Other`)
- **Root Directory**: `./` (leave as root)
- **Build Command**:
  ```bash
  npm run client:build
  ```
- **Output Directory**:
  ```bash
  frontend/dist
  ```
- **Install Command**:
  ```bash
  npm install
  ```

### Step 3: Add Environment Variables
Under the **Environment Variables** section, add:
- `MONGO_URI`: *(Your MongoDB Atlas connection string)*
- `NODE_ENV`: `production`
*(Optional)* If you are hosting the backend separately on Render:
- `VITE_API_URL`: `https://retailrocket-mern.onrender.com`

### Step 4: Click Deploy
1. Click **"Deploy"**.
2. Vercel will build the frontend assets using `vercel.json` routing and deploy to a URL like:
   ```text
   https://retailrocket-mern.vercel.app
   ```

---

## 🔄 Method 3: Hybrid Architecture (Vercel Frontend + Render API)

If you want the maximum performance of Vercel's global CDN for your frontend while running your continuous AI recommendations on Render:

1. **Deploy Backend on Render** (following Method 1 above).
   - Your API will be at: `https://your-backend.onrender.com`
2. **Deploy Frontend on Vercel** (following Method 2 above).
   - In Vercel Project Settings → Environment Variables, add:
     - Key: `VITE_API_URL`
     - Value: `https://your-backend.onrender.com`
3. Click **Redeploy** on Vercel.
4. The frontend will automatically route all recommendation, cart, voice assistant, and auth calls to your Render backend with zero CORS restrictions.

---

## 🧪 Post-Deployment Verification Checklist

Once deployed, verify that the application is operating smoothly:
1. **Health Check**: Open `https://<your-domain>/health` in your browser. It should return:
   ```json
   {
     "status": "healthy",
     "users": 50,
     "products": 15,
     "interactions": 719,
     "model_type": "TruncatedSVD Collaborative Filtering (MERN Native)",
     "database": "MongoDB with Standalone Fallback Cache"
   }
   ```
2. **Demo Judge Login**: Click **"Sign In / Register"** in the top-right header and use 1-click **"⚖️ Judge / Evaluator"** (`judge@retailrocket.ai` / `judge123`).
3. **Cart & COD**: Click **"+ Add to Cart"** on any item, open the Cart drawer, and click **"Place Order with COD & Track Live"**.
4. **Behavior Chart**: Switch between personas (Alex, David, Sarah, Elena) and confirm that each persona displays unique dates and activity trends.
