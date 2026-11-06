import recommendationEngine from '../services/recommendationEngine.js';
import { Event } from '../models/Event.js';
import { isDbConnected } from '../config/db.js';

export async function recordViewEvent(req, res) {
  try {
    const { visitor_id, item_id, timestamp = Date.now() } = req.body;

    if (!visitor_id || !item_id) {
      return res.status(400).json({ detail: "visitor_id and item_id are required" });
    }

    const result = recommendationEngine.recordView(visitor_id, item_id, timestamp);

    // Save to MongoDB if available
    if (isDbConnected()) {
      try {
        await Event.create({
          timestamp: timestamp || Date.now(),
          visitor_id: String(visitor_id),
          event: 'view',
          item_id: String(item_id),
          transaction_id: ''
        });
      } catch (err) {
        console.warn('[EventController] DB write skipped:', err.message);
      }
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

export async function recordGenericEvent(req, res) {
  try {
    const { visitor_id, item_id, event = 'view', transaction_id = '', timestamp = Date.now() } = req.body;

    if (!visitor_id || !item_id) {
      return res.status(400).json({ detail: "visitor_id and item_id are required" });
    }

    if (event === 'view') {
      recommendationEngine.recordView(visitor_id, item_id, timestamp);
    } else if (event === 'addtocart') {
      recommendationEngine.recordCart(visitor_id, item_id, timestamp);
    }

    if (isDbConnected()) {
      await Event.create({
        timestamp: timestamp || Date.now(),
        visitor_id: String(visitor_id),
        event,
        item_id: String(item_id),
        transaction_id
      });
    }

    return res.json({
      status: "success",
      message: `Event '${event}' recorded for item ${item_id}`,
      visitor_id,
      item_id,
      event,
      timestamp
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

