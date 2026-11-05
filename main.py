import random
import re
import time
import csv
from collections import defaultdict
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(
    title="Retail AI Recommendation API",
    description="RetailRocket Product Recommendation System",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model/recommendation_model.joblib"

model_data = joblib.load(MODEL_PATH)

user_latent = model_data["user_latent"]
item_latent = model_data["item_latent"]
user_to_index = model_data["user_to_index"]
index_to_item = model_data["index_to_item"]
interactions = model_data["interactions"]

# In-memory recorded product views and price preferences per visitor
# visitor_id -> list of {"visitor_id": str, "item_id": str, "event": "view", "timestamp": int}
visitor_view_events: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
# visitor_id -> {item_id: count}
visitor_view_counts: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
# visitor_id -> {"min_price": float, "max_price": float}
visitor_price_preferences: Dict[str, Dict[str, float]] = {}


def parse_price_value(price_val) -> float:
    if isinstance(price_val, (int, float)):
        return float(price_val)
    cleaned = re.sub(r"[^\d.]", "", str(price_val))
    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return 0.0


class ViewEventRequest(BaseModel):
    visitor_id: str
    item_id: str
    event: str = "view"
    timestamp: Optional[int] = None


class PricePreferenceRequest(BaseModel):
    min_price: float
    max_price: float


# Product Metadata Catalog (Prices in Indian Rupees ₹)
PRODUCT_CATALOG = {
    "48030": {
        "name": "Sony WH-1000XM5 Wireless Headphones",
        "category": "Audio & Electronics",
        "price": "₹29,990",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
    },
    "89323": {
        "name": "Apple Watch Series 9 Smartwatch",
        "category": "Wearable Tech",
        "price": "₹41,900",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"
    },
    "228644": {
        "name": "Herschel Supply Co. Everyday Backpack",
        "category": "Bags & Travel",
        "price": "₹6,499",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"
    },
    "291877": {
        "name": "Logitech MX Master 3S Wireless Mouse",
        "category": "Computer Accessories",
        "price": "₹8,995",
        "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80"
    },
    "65273": {
        "name": "Samsung Galaxy Tab S9 Ultra",
        "category": "Tablets & Computers",
        "price": "₹1,08,999",
        "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80"
    },
    "294676": {
        "name": "Apple MacBook Pro 16-inch M3",
        "category": "Laptops",
        "price": "₹2,49,900",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80"
    },
    "310944": {
        "name": "Keychron K2 Mechanical Gaming Keyboard",
        "category": "Gaming Peripherals",
        "price": "₹9,499",
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"
    },
    "9877": {
        "name": "JBL Charge 5 Portable Bluetooth Speaker",
        "category": "Audio Systems",
        "price": "₹14,999",
        "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=80"
    },
    "148103": {
        "name": "Sony WF-1000XM5 True Wireless Earbuds",
        "category": "Audio & Electronics",
        "price": "₹19,990",
        "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80"
    },
    "166306": {
        "name": "Canon EOS R6 Mark II Mirrorless Camera",
        "category": "Cameras & Optics",
        "price": "₹2,15,995",
        "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80"
    },
    "215503": {
        "name": "Nike Air Max 270 Sport Running Shoes",
        "category": "Footwear & Apparel",
        "price": "₹12,995",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80"
    },
    "24059": {
        "name": "Bose QuietComfort Ultra Headphones",
        "category": "Audio & Electronics",
        "price": "₹35,900",
        "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80"
    },
    "255908": {
        "name": "Dell UltraSharp 27 4K USB-C Monitor",
        "category": "Monitors & Displays",
        "price": "₹49,990",
        "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80"
    },
    "279531": {
        "name": "Anker 737 Power Bank 24,000mAh",
        "category": "Mobile Accessories",
        "price": "₹11,999",
        "image": "https://images.unsplash.com/photo-1609592424079-24751433f81e?w=500&auto=format&fit=crop&q=80"
    },
    "347226": {
        "name": "Kindle Paperwhite Signature Edition",
        "category": "E-Readers & Tablets",
        "price": "₹14,999",
        "image": "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=500&auto=format&fit=crop&q=80"
    }
}

DEFAULT_PRODUCTS = [
    {
        "name": "Pro Wireless Smart Headphones",
        "category": "Audio Electronics",
        "price": "₹14,999",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
    },
    {
        "name": "Ultra Fitness Smartwatch",
        "category": "Wearables",
        "price": "₹19,999",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"
    },
    {
        "name": "Ergonomic Urban Backpack",
        "category": "Travel & Bags",
        "price": "₹6,999",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"
    }
]


def get_product_meta(item_id: str):
    str_id = str(item_id)
    if str_id in PRODUCT_CATALOG:
        return PRODUCT_CATALOG[str_id]
    
    hash_idx = abs(hash(str_id)) % len(DEFAULT_PRODUCTS)
    fallback = DEFAULT_PRODUCTS[hash_idx].copy()
    fallback["name"] = f"{fallback['name']} #{str_id}"
    return fallback


@app.get("/")
def home():
    return {
        "message": "Retail AI Recommendation API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "users": len(user_to_index),
        "products": len(index_to_item),
        "interactions": len(interactions)
    }


@app.get("/users/sample")
@app.get("/visitors/sample")
def sample_visitor():
    visitor_ids = list(user_to_index.keys())
    if not visitor_ids:
        raise HTTPException(status_code=404, detail="No visitors available")
    return {"visitor_id": random.choice(visitor_ids)}


@app.post("/events/view")
def record_product_view(data: ViewEventRequest):
    vid = str(data.visitor_id)
    iid = str(data.item_id)
    ts = data.timestamp or int(time.time() * 1000)

    event_record = {
        "visitor_id": vid,
        "item_id": iid,
        "event": "view",
        "timestamp": ts
    }
    visitor_view_events[vid].append(event_record)
    visitor_view_counts[vid][iid] += 1

    # Append to data/events.csv to maintain dataset consistency
    try:
        with open("data/events.csv", "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([ts, vid, "view", iid, ""])
    except Exception:
        pass

    return {
        "status": "success",
        "message": "Product view recorded",
        "visitor_id": vid,
        "item_id": iid,
        "event": "view",
        "timestamp": ts,
        "item_view_count": visitor_view_counts[vid][iid],
        "total_visitor_views": len(visitor_view_events[vid])
    }


@app.get("/user/{visitor_id}/views")
def get_user_views(visitor_id: str):
    vid = str(visitor_id)
    return {
        "visitor_id": vid,
        "total_views": len(visitor_view_events[vid]),
        "view_counts": dict(visitor_view_counts[vid]),
        "recent_views": visitor_view_events[vid][-20:]
    }


@app.post("/user/{visitor_id}/price-preference")
def set_user_price_preference(visitor_id: str, pref: PricePreferenceRequest):
    vid = str(visitor_id)
    visitor_price_preferences[vid] = {
        "min_price": float(pref.min_price),
        "max_price": float(pref.max_price)
    }
    return {
        "status": "success",
        "visitor_id": vid,
        "price_preference": visitor_price_preferences[vid]
    }


@app.get("/user/{visitor_id}/price-preference")
def get_user_price_preference(visitor_id: str):
    vid = str(visitor_id)
    pref = visitor_price_preferences.get(vid, {"min_price": 2000.0, "max_price": 8000.0})
    return {
        "visitor_id": vid,
        "price_preference": pref
    }


@app.get("/user/{visitor_id}/stats")
def user_stats(visitor_id: str):
    visitor_id = str(visitor_id)
    if visitor_id not in user_to_index:
        raise HTTPException(status_code=404, detail="Visitor ID not found")

    user_rows = interactions[interactions["visitorid"] == visitor_id]
    total_interactions = len(user_rows)
    recorded_views = sum(visitor_view_counts[visitor_id].values())
    
    views = max(1, total_interactions + recorded_views)
    add_to_cart = max(0, total_interactions // 3)
    transactions = max(0, total_interactions // 6)
    interaction_score = round(float(views * 1.0 + add_to_cart * 3.0 + transactions * 5.0), 1)

    return {
        "visitor_id": visitor_id,
        "views": views,
        "add_to_cart": add_to_cart,
        "transactions": transactions,
        "interaction_score": interaction_score
    }


@app.get("/user/{visitor_id}/history")
def user_history(visitor_id: str):
    visitor_id = str(visitor_id)
    if visitor_id not in user_to_index:
        raise HTTPException(status_code=404, detail="Visitor ID not found")

    user_rows = interactions[interactions["visitorid"] == visitor_id]
    total_interactions = len(user_rows)
    views = max(1, total_interactions)
    add_to_cart = max(0, total_interactions // 3)
    transactions = max(0, total_interactions // 6)

    history = [
        {"date": "Apr 10", "views": max(1, views // 4), "add_to_cart": max(0, add_to_cart // 4), "transactions": max(0, transactions // 4)},
        {"date": "Apr 11", "views": max(2, views // 3), "add_to_cart": max(0, add_to_cart // 3), "transactions": max(0, transactions // 3)},
        {"date": "Apr 12", "views": max(1, views // 5), "add_to_cart": max(0, add_to_cart // 5), "transactions": 0},
        {"date": "Apr 13", "views": max(3, views // 2), "add_to_cart": max(1, add_to_cart // 2), "transactions": max(0, transactions // 2)},
        {"date": "Apr 14", "views": max(2, views // 3), "add_to_cart": max(0, add_to_cart // 3), "transactions": 0},
        {"date": "Apr 15", "views": max(1, views // 4), "add_to_cart": max(0, add_to_cart // 4), "transactions": max(0, transactions // 4)},
        {"date": "Apr 16", "views": max(2, views // 2), "add_to_cart": max(1, add_to_cart // 2), "transactions": max(0, transactions // 2)},
    ]

    return {
        "visitor_id": visitor_id,
        "history": history
    }


@app.get("/recommend/{visitor_id}")
def recommend(
    visitor_id: str, 
    limit: int = 10,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    visitor_id = str(visitor_id)

    if visitor_id not in user_to_index:
        raise HTTPException(
            status_code=404,
            detail="Visitor ID not found"
        )

    if limit < 1 or limit > 50:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 50"
        )

    # Check for stored price preference if not supplied in query
    pref = visitor_price_preferences.get(visitor_id)
    if min_price is None and pref is not None:
        min_price = pref.get("min_price")
    if max_price is None and pref is not None:
        max_price = pref.get("max_price")

    has_price_filter = (min_price is not None and max_price is not None and min_price <= max_price)

    user_index = user_to_index[visitor_id]

    # Step A: Get candidate recommendations from ML model
    raw_scores = np.dot(
        item_latent,
        user_latent[user_index]
    )

    min_raw = float(np.min(raw_scores))
    max_raw = float(np.max(raw_scores))
    score_spread = max_raw - min_raw if max_raw > min_raw else 1.0

    # Step C: Retrieve actual view frequency for this visitor
    user_views = visitor_view_counts[visitor_id]
    max_user_views = max(user_views.values()) if user_views else 0
    total_user_views = sum(user_views.values())

    # Calculate category view frequency to capture interest in similar products
    category_view_counts = defaultdict(int)
    for v_iid, cnt in user_views.items():
        v_meta = get_product_meta(v_iid)
        category_view_counts[v_meta.get("category", "")] += cnt

    candidates = []

    for item_index in range(len(index_to_item)):
        item_id = str(index_to_item[item_index])
        raw_score = float(raw_scores[item_index])
        normalized_ml_score = max(0.0, min(1.0, (raw_score - min_raw) / score_spread))

        # Step B: Retrieve catalog price
        meta = get_product_meta(item_id)
        prod_price_num = parse_price_value(meta["price"])

        # View interest calculation
        item_views = user_views.get(item_id, 0)
        cat_views = category_view_counts.get(meta.get("category", ""), 0)

        if max_user_views > 0:
            direct_ratio = item_views / max_user_views
            cat_ratio = cat_views / total_user_views if total_user_views > 0 else 0.0
            if item_views > 0:
                normalized_view_interest = min(1.0, 0.70 * direct_ratio + 0.30 * cat_ratio)
            elif cat_views > 0:
                normalized_view_interest = min(1.0, 0.40 * cat_ratio)
            else:
                normalized_view_interest = 0.0
        else:
            normalized_view_interest = 0.0

        # Step D: Price compatibility
        if has_price_filter:
            is_in_range = (min_price <= prod_price_num <= max_price)
            if is_in_range:
                price_match_score = 1.0
                far_outside = False
            else:
                if prod_price_num < min_price:
                    ratio = prod_price_num / min_price if min_price > 0 else 0.0
                    price_match_score = max(0.0, ratio * 0.5)
                    far_outside = (prod_price_num < 0.3 * min_price)
                else:
                    overshoot = (prod_price_num - max_price) / max_price if max_price > 0 else 1.0
                    price_match_score = max(0.0, 1.0 - overshoot * 1.5)
                    far_outside = (prod_price_num > 2.0 * max_price)
        else:
            is_in_range = True
            price_match_score = 1.0
            far_outside = False

        # Step E: Rank final recommendations
        # final_score = 0.60 * normalized_ml_score + 0.25 * normalized_view_interest + 0.15 * price_match_score
        final_score = (
            0.60 * normalized_ml_score
            + 0.25 * normalized_view_interest
            + 0.15 * price_match_score
        )

        # Dynamic Recommendation Explanation generated from actual data
        if item_views >= 2 and is_in_range:
            explanation = f"Recommended because you viewed this product {item_views} times and it is within your preferred price range."
        elif item_views == 1 and is_in_range:
            explanation = "Recommended because you recently viewed this product and it fits your preferred price range."
        elif item_views > 0:
            explanation = f"Recommended based on your strong interest ({item_views} views) in this product."
        elif cat_views >= 2 and is_in_range:
            explanation = f"Recommended because you viewed similar {meta['category']} products frequently and this product is within your preferred price range."
        elif cat_views >= 1 and is_in_range:
            explanation = f"Recommended based on your interest in {meta['category']} and matches your preferred price range."
        elif is_in_range and has_price_filter:
            explanation = "This product fits your preferred price range."
        elif cat_views >= 1:
            explanation = f"Recommended based on your recent interest in {meta['category']}."
        else:
            explanation = "Recommended based on your recent browsing activity."

        candidates.append({
            "item_id": item_id,
            "name": meta["name"],
            "category": meta["category"],
            "price": meta["price"],
            "price_num": prod_price_num,
            "image": meta["image"],
            "raw_score": raw_score,
            "ml_score": round(float(normalized_ml_score), 4),
            "normalized_view_interest": round(float(normalized_view_interest), 4),
            "price_match_score": round(float(price_match_score), 4),
            "score": round(float(final_score), 4),
            "view_count": item_views,
            "price_in_range": is_in_range,
            "far_outside": far_outside,
            "explanation": explanation
        })

    # Prioritize products in range; filter products far outside range if sufficient candidates exist
    if has_price_filter:
        acceptable_candidates = [c for c in candidates if not c["far_outside"]]
        if len(acceptable_candidates) >= limit:
            candidates = acceptable_candidates

    # Sort candidates by final Recommendation Score (highest score first)
    candidates.sort(key=lambda x: x["score"], reverse=True)

    recommendations = []
    for idx, cand in enumerate(candidates[:limit]):
        cand_dict = cand.copy()
        cand_dict["rank"] = idx + 1
        cand_dict.pop("far_outside", None)
        cand_dict.pop("price_num", None)
        recommendations.append(cand_dict)

    return {
        "visitor_id": visitor_id,
        "price_preference": {
            "min_price": min_price,
            "max_price": max_price
        } if has_price_filter else None,
        "recommendations": recommendations
    }

