import { useState, useRef, useEffect } from 'react';
import { enrichProduct } from '../utils/productCatalog';

export function useVoiceAssistant(visitorId, fetchRecommendations, rawRecommendations) {
  const [voiceState, setVoiceState] = useState('IDLE'); // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'RESPONSE'
  const [transcript, setTranscript] = useState('');
  const [spokenResponse, setSpokenResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);

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
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = () => {
      setVoiceState('IDLE');
    };

    recognition.onend = () => {
      setVoiceState('PROCESSING');
      setTimeout(() => {
        processVoiceCommand();
      }, 800);
    };

    recognitionRef.current = recognition;
  }, [visitorId, rawRecommendations]);

  const processVoiceCommand = () => {
    let responseText = "";
    const enrichedList = (rawRecommendations || []).map(enrichProduct);

    if (enrichedList && enrichedList.length > 0) {
      const topProductNames = enrichedList.slice(0, 3).map(r => r.name).join(', ');
      responseText = `Based on your previous shopping activity, I recommend these top products: ${topProductNames}. These items match your recent interaction patterns.`;
    } else {
      responseText = `I checked activity for visitor ${visitorId}, but could not find enough interaction history to generate product recommendations.`;
    }

    setSpokenResponse(responseText);
    setVoiceState('RESPONSE');

    // Speech Synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && voiceState === 'IDLE') {
      try {
        recognitionRef.current.start();
      } catch {
        setVoiceState('IDLE');
      }
    } else if (!isSupported) {
      setVoiceState('LISTENING');
      setTranscript('What products should I buy?');
      setTimeout(() => {
        setVoiceState('PROCESSING');
        setTimeout(() => {
          processVoiceCommand();
        }, 1000);
      }, 2000);
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
    if (spokenResponse && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenResponse);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    voiceState,
    transcript,
    spokenResponse,
    isSupported,
    startListening,
    stopListening,
    playResponse
  };
}
