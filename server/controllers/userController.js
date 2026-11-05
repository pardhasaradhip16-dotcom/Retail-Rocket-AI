import recommendationEngine from '../services/recommendationEngine.js';
import { Visitor } from '../models/Visitor.js';
import { PricePreference } from '../models/PricePreference.js';
import { isDbConnected } from '../config/db.js';

export async function getSampleVisitor(req, res) {
  try {
    const visitorId = recommendationEngine.getRandomVisitor();
    return res.json({ visitor_id: visitorId });
  } catch (error) {
    return res.status(500).json({ detail: "Failed to fetch sample visitor" });
  }
}

export async function getUserStats(req, res) {
  try {
    const { visitorId } = req.params;
    const stats = recommendationEngine.getUserStats(visitorId);

    // If MongoDB connected, sync visitor stats
    if (isDbConnected()) {
      try {
        await Visitor.findOneAndUpdate(
          { visitor_id: visitorId },
          {
            $set: {
              total_views: stats.views,
              total_add_to_cart: stats.add_to_cart,
              total_transactions: stats.transactions,
              interaction_score: stats.interaction_score,
              last_active: new Date()
            }
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        // Silently continue
      }
    }

    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

export async function getUserHistory(req, res) {
  try {
    const { visitorId } = req.params;
    const history = recommendationEngine.getUserHistory(visitorId);
    return res.json({
      visitor_id: visitorId,
      history
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

export async function getUserViews(req, res) {
  try {
    const { visitorId } = req.params;
    const viewsList = recommendationEngine.visitorViewEvents[visitorId] || [];
    const counts = recommendationEngine.visitorViewCounts[visitorId] || {};

    return res.json({
      visitor_id: visitorId,
      total_views: viewsList.length,
      view_counts: counts,
      recent_views: viewsList.slice(-20)
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

export async function setPricePreference(req, res) {
  try {
    const { visitorId } = req.params;
    const { min_price, max_price } = req.body;

    const pref = recommendationEngine.setPricePreference(visitorId, min_price, max_price);

    if (isDbConnected()) {
      try {
        await PricePreference.findOneAndUpdate(
          { visitor_id: visitorId },
          { min_price: Number(min_price), max_price: Number(max_price) },
          { upsert: true }
        );
      } catch (err) {
        // Silently continue
      }
    }

    return res.json({
      status: "success",
      visitor_id: visitorId,
      price_preference: pref
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

export async function getPricePreference(req, res) {
  try {
    const { visitorId } = req.params;
    let pref = recommendationEngine.getPricePreference(visitorId);

    if (isDbConnected()) {
      try {
        const dbPref = await PricePreference.findOne({ visitor_id: visitorId });
        if (dbPref) {
          pref = { min_price: dbPref.min_price, max_price: dbPref.max_price };
        }
      } catch (err) {
        // Silently continue
      }
    }

    return res.json({
      visitor_id: visitorId,
      price_preference: pref
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

