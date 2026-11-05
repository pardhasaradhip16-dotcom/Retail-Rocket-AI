import { useState, useEffect, useCallback, useRef } from 'react';
import { getRecommendations, getUserStats, getUserHistory, getHealth, getSampleUser } from '../services/api';

export function useRecommendations(initialVisitorId = '1000294') {
  const [visitorId, setVisitorId] = useState(initialVisitorId);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [userHistory, setUserHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiConnected, setApiConnected] = useState(false);
  const [datasetHealth, setDatasetHealth] = useState(null);

  const visitorIdRef = useRef(visitorId);
  useEffect(() => {
    visitorIdRef.current = visitorId;
  }, [visitorId]);

  // Live health monitoring
  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      try {
        const data = await getHealth();
        if (isMounted) {
          setApiConnected(true);
          setDatasetHealth(data);
        }
      } catch {
        if (isMounted) {
          setApiConnected(false);
        }
      }
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleFetchRecommendations = useCallback(async (targetId) => {
    const idToFetch = String(targetId !== undefined && targetId !== null ? targetId : visitorIdRef.current).trim();
    if (!idToFetch) {
      setError("Please enter a visitor ID");
      return;
    }

    setVisitorId(idToFetch);
    setLoading(true);
    setError("");

    try {
      const [recData, statsData, historyData] = await Promise.all([
        getRecommendations(idToFetch, 10),
        getUserStats(idToFetch).catch(() => null),
        getUserHistory(idToFetch).catch(() => null)
      ]);

      setSelectedVisitor(recData.visitor_id || idToFetch);
      setRecommendations(recData.recommendations || []);
      setUserStats(statsData);
      setUserHistory(historyData?.history || null);
      setApiConnected(true);
    } catch (err) {
      setRecommendations([]);
      setSelectedVisitor(null);
      setUserStats(null);
      setUserHistory(null);

      if (err.status === 404) {
        setError("Visitor ID not found");
      } else {
        setError(err.message || "Unable to get recommendations");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial visitor recommendations ONLY ONCE on mount
  useEffect(() => {
    handleFetchRecommendations(initialVisitorId);
  }, []);

  const generateSampleVisitor = async () => {
    try {
      const data = await getSampleUser();
      if (data && data.visitor_id) {
        setVisitorId(data.visitor_id);
        handleFetchRecommendations(data.visitor_id);
      }
    } catch {
      handleFetchRecommendations('1000290');
    }
  };

  return {
    visitorId,
    setVisitorId,
    selectedVisitor,
    recommendations,
    userStats,
    userHistory,
    loading,
    error,
    apiConnected,
    datasetHealth,
    handleFetchRecommendations,
    generateSampleVisitor
  };
}
