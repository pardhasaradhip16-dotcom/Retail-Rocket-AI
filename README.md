# RetailRocket AI — Full MERN Stack Recommendation Platform

An end-to-end **MERN (MongoDB, Express.js, React, Node.js)** e-commerce intelligence and recommendation dashboard powered by **Collaborative Filtering with Truncated SVD Matrix Factorization**, real-time view intent tracking, dynamic budget filtering, and voice-assisted product discovery.

---

## Architecture Overview

```
                                      +---------------------------------------------+
                                      |             React + Vite Client             |
                                      |   Tailwind CSS / Lucide / Recharts / Speech  |
                                      +----------------------+----------------------+
                                                             |
                                               HTTP / REST   |   WebSocket / Events
                                                             v
                                      +---------------------------------------------+
                                      |             Express.js + Node.js            |
                                      |        REST API & Hybrid Rec Engine         |
                                      +----------------------+----------------------+
                                                             |
                                      +----------------------+----------------------+
                                      |                                             |
                                      v                                             v
                         +--------------------------+                 +---------------------------+
                         |      MongoDB Database    |                 |   Collaborative Filtering |
                         |   Mongoose Models:       |                 |   - Truncated SVD Factors |
                         |   - Products             |                 |   - 60% ML Latent Dot     |
                         |   - Visitors / Users     |                 |   - 25% View Frequency    |
                         |   - Events / Interactions|                 |   - 15% Price Budget Match|
                         |   - Price Preferences    |                 |   - NLP Explanations      |
                         +--------------------------+                 +---------------------------+
```

---

## Tech Stack (MERN)

- **M — MongoDB**: Scalable NoSQL database storing curated product catalogs, customer visitor profiles, interaction event logs (`view`, `addtocart`, `transaction`), and budget preferences with Mongoose ODM.
- **E — Express.js**: High-performance REST API routing requests, validating input parameters, managing CORS, and serving recommendations.
- **R — React (v18)**: Modern interactive dashboard built with Vite, Tailwind CSS, Lucide Icons, Framer Motion, and Web Speech API.
- **N — Node.js (v20+)**: Unified JavaScript runtime powering the server and the matrix-factorization recommendation engine.

---

## Recommendation Engine Algorithm

The hybrid scoring engine combines collaborative signals, real-time intent, and user constraints:

$$\text{Final Score} = 0.60 \times S_{\text{ML}} + 0.25 \times I_{\text{View}} + 0.15 \times C_{\text{Price}}$$

1. **60% Latent Collaborative Filtering ($S_{\text{ML}}$)**:
   - Decomposes the user-item interaction matrix into low-rank latent vectors using regularized matrix factorization / Truncated SVD.
   - Interaction weights:
     - `view` = **1.0x** (Browsing intent)
     - `addtocart` = **3.0x** (High purchase consideration)
     - `transaction` = **5.0x** (Confirmed conversion)
2. **25% Real-Time View Frequency Boost ($I_{\text{View}}$)**:
   - Evaluates direct product views and related category view frequency during the current shopping session.
3. **15% Price Compatibility ($C_{\text{Price}}$)**:
   - Scores items based on compliance with the visitor's preferred budget range.
4. **Dynamic Natural Language Explanations**:
   - Every recommendation includes an explainable AI rationale (e.g., *"Recommended because you viewed this product 3 times and it is within your preferred price range"*).

---

## Directory Structure

```
Retail Data/
├── server/                           # Express.js + Node.js + MongoDB Backend
│   ├── config/
│   │   └── db.js                     # MongoDB connection & standalone fallback
│   ├── models/
│   │   ├── Product.js                # Product schema (₹ pricing, images, categories)
│   │   ├── Visitor.js                # Visitor behavior profiles
│   │   ├── Event.js                  # View, add-to-cart, purchase events
│   │   └── PricePreference.js        # Min/Max price filters
│   ├── controllers/
│   │   ├── recommendationController.js
│   │   ├── userController.js
│   │   ├── eventController.js
│   │   └── productController.js
│   ├── routes/
│   │   └── api.js                    # REST API endpoints
│   ├── services/
│   │   └── recommendationEngine.js   # SVD Matrix Factorization in Node.js
│   ├── scripts/
│   │   └── seed.js                   # Database seeder (15 products, 50 users, 719 events)
│   ├── server.js                     # Express entry point (Port 5000)
│   ├── .env.example
│   └── package.json
├── frontend/                         # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx           # Tab navigation & dataset indicators
│   │   │   ├── Header.jsx            # Live connection status & theme toggle
│   │   │   ├── VisitorSearch.jsx     # Visitor lookup & voice trigger
│   │   │   ├── StatsCards.jsx        # Views, cart actions, transactions, score
│   │   │   ├── RecommendationSection.jsx # Carousel & product grid
│   │   │   ├── RecommendationCard.jsx    # SVD rank, score progress, pricing
│   │   │   ├── BehaviorChart.jsx     # Recharts activity timeline
│   │   │   ├── TopProducts.jsx       # Ranked products leaderboard
│   │   │   ├── AIInsight.jsx         # Pipeline explainer & speech synthesis
│   │   │   └── VoiceAssistant.jsx    # Pulsing microphone & Web Speech recognition
│   │   ├── hooks/
│   │   │   ├── useRecommendations.js # Data fetching and health monitoring
│   │   │   └── useVoiceAssistant.js  # Voice command handler
│   │   ├── pages/
│   │   │   └── Dashboard.jsx         # Complete multi-tab dashboard
│   │   ├── services/
│   │   │   └── api.js                # API client with auto-port detection
│   │   └── utils/
│   │       └── productCatalog.js     # Curated catalog definitions
│   ├── vite.config.js                # Proxy configuration for Express API
│   └── package.json
├── data/
│   └── events.csv                    # 719 historical interaction events
├── package.json                      # Monorepo runner (concurrently)
└── README.md
```

---

## Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20 & v25)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` OR a MongoDB Atlas URI)

### 2. Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```

### 3. Seed MongoDB
Pre-populate MongoDB with all catalog products, customer profiles, and 719 interaction events:
```bash
npm run seed
```

### 4. Run the Full MERN Stack
Start both the Express backend (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## Individual Component Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts Express server & React Vite client concurrently |
| `npm run server` | Starts only the Express server (`http://localhost:5000`) |
| `npm run client` | Starts only the React frontend (`http://localhost:5173`) |
| `npm run seed` | Seeds MongoDB collections from `events.csv` |
| `npm run build` | Builds the production Vite bundle in `frontend/dist` |

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System status, user count, product count, interaction totals |
| `GET` | `/recommend/:visitorId` | Top recommendations for visitor (supports `?limit=10&min_price=X&max_price=Y`) |
| `GET` | `/users/sample` | Returns a random visitor ID from the dataset |
| `GET` | `/user/:visitorId/stats` | Interaction metrics (views, cart, transactions, score) |
| `GET` | `/user/:visitorId/history` | Timeline behavior data for charts |
| `GET` | `/user/:visitorId/views` | Recent viewing history |
| `POST` | `/events/view` | Logs a product view in real time (`{ visitor_id, item_id }`) |
| `POST` | `/user/:visitorId/price-preference` | Sets visitor price range preference (`{ min_price, max_price }`) |
| `GET` | `/user/:visitorId/price-preference` | Retrieves active price range preference |
| `GET` | `/api/products` | Complete catalog of products from MongoDB |
| `GET` | `/api/products/:id` | Product detail by item ID |

---

## License
MIT

