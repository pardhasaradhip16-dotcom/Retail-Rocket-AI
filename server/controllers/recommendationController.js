import recommendationEngine from '../services/recommendationEngine.js';

export async function getRecommendations(req, res) {
  try {
    const { visitorId } = req.params;
    const { limit = 10, min_price, max_price } = req.query;

    if (!visitorId) {
      return res.status(400).json({ detail: "Visitor ID is required" });
    }

    const recResult = recommendationEngine.recommend(visitorId, {
      limit: parseInt(limit, 10),
      min_price,
      max_price
    });

    return res.json(recResult);
  } catch (error) {
    console.error('[RecommendationController] Error:', error);
    return res.status(500).json({ detail: error.message || "Failed to generate recommendations" });
  }
}

