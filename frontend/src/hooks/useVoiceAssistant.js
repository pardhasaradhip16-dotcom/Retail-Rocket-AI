import { useState, useRef, useEffect, useCallback } from 'react';
import { enrichProduct } from '../utils/productCatalog';

export function useVoiceAssistant(visitorId, fetchRecommendations, rawRecommendations) {
  const [voiceState, setVoiceState] = useState('IDLE'); // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'RESPONSE'
  const [transcript, setTranscript] = useState('');
  const [spokenResponse, setSpokenResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const latestTranscriptRef = useRef('');
  const recommendationsRef = useRef(rawRecommendations);
  const visitorIdRef = useRef(visitorId);

  useEffect(() => {
    recommendationsRef.current = rawRecommendations;
  }, [rawRecommendations]);

  useEffect(() => {
    visitorIdRef.current = visitorId;
  }, [visitorId]);

  const speakText = useCallback((text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        // Voice response finished speaking
      };
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const processTextCommand = useCallback((inputQuery) => {
    const query = String(inputQuery || latestTranscriptRef.current || 'What products do you recommend?').toLowerCase().trim();
    setTranscript(inputQuery || latestTranscriptRef.current || 'What products do you recommend?');
    setVoiceState('PROCESSING');

    setTimeout(() => {
      let responseText = "";
      const currentRecs = (recommendationsRef.current || []).map(enrichProduct);
      const currentVisitor = visitorIdRef.current || '1000294';

      // 1. Delivery & Payment Queries
      if (
        query.includes('delivery') || 
        query.includes('cod') || 
        query.includes('cash on delivery') || 
        query.includes('track') || 
        query.includes('shipping') ||
        query.includes('credit card') ||
        query.includes('payment')
      ) {
        responseText = `All orders feature free express delivery within 48 to 72 hours. Cash on Delivery is available for all pincodes, along with Credit Cards, Debit Cards, and Instant UPI. You can track your live shipment under tracking ID RR-EXP-984210.`;
      }
      // 2. Audio & Headphones Category Queries
      else if (
        query.includes('headphone') || 
        query.includes('audio') || 
        query.includes('earbud') || 
        query.includes('speaker') || 
        query.includes('music') ||
        query.includes('sound')
      ) {
        const audioItems = currentRecs.filter(r => r.category && r.category.toLowerCase().includes('audio'));
        if (audioItems.length > 0) {
          const names = audioItems.slice(0, 2).map(r => `${r.name} for ${r.price}`).join(', and ');
          responseText = `For audio and electronics, I recommend ${names}. These offer top-tier noise cancellation and immersive audio.`;
        } else {
          responseText = `Top recommended audio products include Sony WH-1000XM5 Headphones at ₹29,990 and JBL Charge 5 Bluetooth Speaker at ₹14,999 with Cash on Delivery available.`;
        }
      }
      // 3. Computing & Work Category Queries
      else if (
        query.includes('laptop') || 
        query.includes('macbook') || 
        query.includes('computer') || 
        query.includes('mouse') || 
        query.includes('keyboard') ||
        query.includes('work') ||
        query.includes('desk')
      ) {
        const compItems = currentRecs.filter(r => 
          r.category && (
            r.category.toLowerCase().includes('computer') || 
            r.category.toLowerCase().includes('laptop') ||
            r.category.toLowerCase().includes('peripherals')
          )
        );
        if (compItems.length > 0) {
          const names = compItems.slice(0, 2).map(r => `${r.name} at ${r.price}`).join(', and ');
          responseText = `For your workstation, I recommend ${names}. These are optimized for high productivity.`;
        } else {
          responseText = `Top productivity products include the Logitech MX Master 3S Mouse at ₹8,995 and Apple MacBook Pro 16-inch at ₹2,49,900.`;
        }
      }
      // 4. Budget / Price Queries
      else if (query.includes('budget') || query.includes('cheap') || query.includes('under') || query.includes('price')) {
        const affordable = [...currentRecs].sort((a, b) => (a.price_num || 0) - (b.price_num || 0));
        if (affordable.length > 0) {
          const cheapest = affordable.slice(0, 2).map(r => `${r.name} at ${r.price}`).join(' and ');
          responseText = `Here are the best value recommendations matching your budget: ${cheapest}. Both are eligible for free delivery.`;
        } else {
          responseText = `Great budget choices include the Herschel Everyday Backpack at ₹6,499 and Logitech MX Master 3S at ₹8,995.`;
        }
      }
      // 5. Visitor Switch Query
      else if (query.includes('switch') || query.includes('visitor')) {
        const matchedNumber = query.match(/\d+/);
        if (matchedNumber && fetchRecommendations) {
          const newId = matchedNumber[0];
          fetchRecommendations(newId);
          responseText = `Switched active shopper profile to visitor ${newId}. Generating personalized collaborative filtering recommendations now.`;
        } else {
          responseText = `You can switch between shopper profiles like 1000290 for audio gear or 1000291 for computing equipment.`;
        }
      }
      // 6. General / Top Recommendations Query
      else {
        if (currentRecs && currentRecs.length > 0) {
          const topItems = currentRecs.slice(0, 3);
          const topList = topItems.map((r, i) => `#${i + 1}: ${r.name} priced at ${r.price}`).join(', ');
          responseText = `Based on shopping activity for visitor ${currentVisitor}, here are your top 3 recommendations: ${topList}. Free shipping and Cash on Delivery are available.`;
        } else {
          responseText = `Based on your recent interest patterns, top recommendations include Sony WH-1000XM5 Wireless Headphones at ₹29,990 and Apple Watch Series 9 at ₹41,900.`;
        }
      }

      setSpokenResponse(responseText);
      setVoiceState('RESPONSE');
      speakText(responseText);
    }, 400);
  }, [fetchRecommendations, speakText]);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setVoiceState('LISTENING');
      setTranscript('');
      setSpokenResponse('');
      latestTranscriptRef.current = '';
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      latestTranscriptRef.current = text;
    };

    recognition.onerror = (e) => {
      console.warn('SpeechRecognition error:', e);
      if (latestTranscriptRef.current) {
        processTextCommand(latestTranscriptRef.current);
      } else {
        setVoiceState('IDLE');
      }
    };

    recognition.onend = () => {
      if (latestTranscriptRef.current) {
        processTextCommand(latestTranscriptRef.current);
      } else {
        setVoiceState('IDLE');
      }
    };

    recognitionRef.current = recognition;
  }, [processTextCommand]);

  const startListening = () => {
    if (recognitionRef.current && voiceState === 'IDLE') {
      try {
        latestTranscriptRef.current = '';
        recognitionRef.current.start();
      } catch (e) {
        // Fallback simulation if already running or mic blocked
        setVoiceState('LISTENING');
        setTranscript('What products do you recommend for me?');
        latestTranscriptRef.current = 'What products do you recommend for me?';
        setTimeout(() => {
          processTextCommand('What products do you recommend for me?');
        }, 1500);
      }
    } else if (!isSupported || voiceState === 'IDLE') {
      setVoiceState('LISTENING');
      setTranscript('What products do you recommend for me?');
      latestTranscriptRef.current = 'What products do you recommend for me?';
      setTimeout(() => {
        processTextCommand('What products do you recommend for me?');
      }, 1500);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState('IDLE');
  };

  const playResponse = () => {
    if (spokenResponse) {
      speakText(spokenResponse);
    }
  };

  return {
    voiceState,
    transcript,
    spokenResponse,
    isSupported,
    startListening,
    stopListening,
    playResponse,
    processTextCommand
  };
}
