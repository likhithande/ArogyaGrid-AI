import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Send, Mic, MicOff, X, User,
  ArrowRight, CheckCircle2, AlertTriangle, TrendingUp,
  ChevronRight, Shield, BarChart2, Zap
} from 'lucide-react';
import { askCopilot } from '../services/api';
import { CopilotResponse, Language, Role } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  data?: CopilotResponse;
}

interface ArogyaCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentRole: Role;
  onNavigateToView: (view: string) => void;
  onApproveRedistribution: () => void;
  onRunSurgeSimulation: () => void;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="typing-dot w-1.5 h-1.5 rounded-full"
        style={{
          background: '#06B6D4',
          animation: `typing-dot 1.4s ease-in-out ${i * 0.15}s infinite`,
        }}
      />
    ))}
  </div>
);

export const ArogyaCopilotModal: React.FC<ArogyaCopilotModalProps> = ({
  isOpen,
  onClose,
  language,
  currentRole,
  onNavigateToView,
  onApproveRedistribution,
  onRunSurgeSimulation
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: '',
      timestamp: 'Just now',
      data: {
        answer: 'I monitor 1,248 PHCs across 8 states in real time. District Krishna is currently under critical stock-out pressure for ORS and Paracetamol due to monsoon conditions. How can I assist?',
        language: 'en',
        supporting_metrics: [
          { label: 'Active PHCs', value: '1,248', badge: 'LIVE' },
          { label: 'Resilience Index', value: '84.8/100', badge: 'STABLE' },
          { label: 'Imminent Shortages', value: '3', badge: 'URGENT' }
        ],
        recommended_actions: [
          'Inspect District Krishna shortage',
          'Approve 800-unit ORS transfer from Guntur',
          'Simulate 40% patient surge'
        ],
        suggested_followups: [
          'Which PHCs are at highest risk?',
          'What medicines may run out within 72h?',
          'Why is District Krishna at risk?'
        ],
        explanation: 'Real-time federated synthesis across state warehouses and community clinics.'
      }
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const samplePrompts: Record<Language, string[]> = {
    en: [
      'Which PHCs are at stock-out risk?',
      'What changed in the last 24h?',
      'Why is District Krishna at risk?',
      'Simulate a 40% demand increase',
      'Find districts with surplus inventory',
      'Generate today\'s situation report',
    ],
    te: [
      'ఏ PHCలకు స్టాక్ అయిపోయే ప్రమాదం ఉంది?',
      'గత 24 గంటల్లో ఏం మారింది?',
      'కృష్ణా జిల్లాలో ఎందుకు రిస్క్ ఉంది?',
    ],
    hi: [
      'किन PHCs में स्टॉक-आउट का जोखिम है?',
      'पिछले 24 घंटों में क्या बदला?',
      'कृष्णा जिले में जोखिम क्यों है?',
    ]
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await askCopilot(textToSend, language, currentRole);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: response
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'AI service temporarily unavailable. Using cached intelligence.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    if (isListening) { setIsListening(false); return; }
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SR();
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const t = event.results[0][0].transcript;
        setInputQuery(t);
        setIsListening(false);
        handleSend(t);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch { setIsListening(false); }
  };

  const handleActionClick = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('approve') || a.includes('transfer')) {
      onApproveRedistribution();
      onNavigateToView('redistribution');
    } else if (a.includes('simulate') || a.includes('surge')) {
      onRunSurgeSimulation();
      onNavigateToView('simulation');
    } else if (a.includes('krishna') || a.includes('shortage') || a.includes('inspect')) {
      onNavigateToView('map');
    } else {
      onNavigateToView('overview');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end"
      style={{ background: 'rgba(3,6,15,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Side Panel */}
      <div
        className="relative w-full max-w-[480px] flex flex-col h-full ag-slide-in-right"
        style={{
          background: '#080D1C',
          borderLeft: '1px solid #1A2438',
          animation: 'ag-slide-in-right 0.22s ease-out both',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid #1A2438' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #1E40AF, #0369A1)',
                border: '1px solid rgba(6,182,212,0.3)',
              }}
            >
              <Sparkles className="w-4.5 h-4.5 text-cyan-200" style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-extrabold tracking-tight" style={{ color: '#F1F5F9' }}>
                  Arogya Copilot
                </h3>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase"
                  style={{ background: 'rgba(6,182,212,0.1)', color: '#22D3EE', border: '1px solid rgba(6,182,212,0.2)' }}
                >
                  Grounded · RAG
                </span>
              </div>
              <p className="text-[11px]" style={{ color: '#3A4A63' }}>Healthcare Network Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: '#3A4A63' }}
            aria-label="Close Copilot"
          >
            <X className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Context Bar */}
        <div
          className="flex items-center gap-3 px-5 py-2.5 text-[10.5px] flex-shrink-0"
          style={{ background: '#070B14', borderBottom: '1px solid #1A2438', fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div className="flex items-center gap-1.5" style={{ color: '#3A4A63' }}>
            <Shield className="w-3 h-3" style={{ color: '#22C55E' }} />
            <span style={{ color: '#22C55E' }}>Hallucination Guard</span>
          </div>
          <span style={{ color: '#1A2438' }}>·</span>
          <span style={{ color: '#3A4A63' }}>Context: District Krishna · Monsoon season</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'assistant';
            return (
              <div key={m.id} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} gap-1`}>
                {/* Sender label */}
                <div className="flex items-center gap-1.5 px-1">
                  {isAi
                    ? <span className="ag-ai-label text-[9px]">Arogya Copilot</span>
                    : <span className="text-[10px] font-semibold" style={{ color: '#475569' }}>You</span>
                  }
                  <span className="text-[9px]" style={{ color: '#3A4A63', fontFamily: "'JetBrains Mono', monospace" }}>{m.timestamp}</span>
                </div>

                {/* Bubble */}
                {isAi ? (
                  <div className="space-y-2.5 w-full">
                    {/* Main answer */}
                    {(m.text || m.data?.answer) && (
                      <div
                        className="px-4 py-3.5 rounded-xl w-full"
                        style={{
                          background: '#0C1424',
                          border: '1px solid #1A2438',
                          borderLeft: '3px solid #2563EB',
                        }}
                      >
                        <p className="text-[13px] leading-relaxed" style={{ color: '#CBD5E1' }}>
                          {m.data?.answer || m.text}
                        </p>
                      </div>
                    )}

                    {/* Supporting Metrics */}
                    {m.data?.supporting_metrics && m.data.supporting_metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {m.data.supporting_metrics.map((metric, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg text-center"
                            style={{ background: '#0C1424', border: '1px solid #1A2438' }}
                          >
                            <div className="text-[16px] font-black font-mono mb-0.5" style={{ color: '#F1F5F9' }}>
                              {metric.value}
                            </div>
                            <div className="text-[10px]" style={{ color: '#475569' }}>{metric.label}</div>
                            {metric.badge && (
                              <span
                                className={`text-[9px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded`}
                                style={{
                                  background: metric.badge === 'URGENT' ? 'rgba(220,38,38,0.1)' : metric.badge === 'LIVE' ? 'rgba(6,182,212,0.1)' : 'rgba(22,163,74,0.1)',
                                  color: metric.badge === 'URGENT' ? '#F87171' : metric.badge === 'LIVE' ? '#22D3EE' : '#4ADE80',
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}
                              >
                                {metric.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommended Actions */}
                    {m.data?.recommended_actions && m.data.recommended_actions.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10.5px] font-bold uppercase tracking-wider px-1" style={{ color: '#3A4A63', fontFamily: "'JetBrains Mono', monospace" }}>
                          Recommended Actions
                        </p>
                        {m.data.recommended_actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(action)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all cursor-pointer group"
                            style={{
                              background: '#0C1424',
                              border: '1px solid #1A2438',
                            }}
                          >
                            <span className="text-[12.5px] font-medium" style={{ color: '#CBD5E1' }}>{action}</span>
                            <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: '#06B6D4' }} />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Follow-up suggestions */}
                    {m.data?.suggested_followups && m.data.suggested_followups.length > 0 && (
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider px-1 mb-1.5" style={{ color: '#3A4A63', fontFamily: "'JetBrains Mono', monospace" }}>
                          Ask Next
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.data.suggested_followups.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(q)}
                              className="text-[11px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              style={{
                                background: 'rgba(6,182,212,0.06)',
                                border: '1px solid rgba(6,182,212,0.15)',
                                color: '#22D3EE',
                              }}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="max-w-[90%] px-4 py-3 rounded-xl"
                    style={{ background: '#2563EB', borderRadius: '14px 14px 4px 14px' }}
                  >
                    <p className="text-[13px] text-white leading-relaxed">{m.text}</p>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2">
              <div
                className="px-4 py-2 rounded-xl"
                style={{ background: '#0C1424', border: '1px solid #1A2438' }}
              >
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length < 3 && (
          <div className="px-4 pb-2 flex-shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts[language].slice(0, 4).map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="text-[11px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{
                    background: 'rgba(37,99,235,0.06)',
                    border: '1px solid rgba(37,99,235,0.2)',
                    color: '#60A5FA',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div
          className="px-4 pb-4 pt-3 flex-shrink-0"
          style={{ borderTop: '1px solid #1A2438' }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: '#0C1424', border: '1px solid #1A2438' }}
          >
            <input
              ref={inputRef}
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about PHC risk, demand forecast, supply routes…"
              className="flex-1 bg-transparent outline-none text-[13px] placeholder-opacity-40"
              style={{ color: '#CBD5E1' }}
            />
            <button
              onClick={handleToggleVoice}
              className="p-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
              style={{ color: isListening ? '#22D3EE' : '#3A4A63' }}
              title="Voice input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || loading}
              className="p-2 rounded-lg transition-all cursor-pointer flex-shrink-0 disabled:opacity-40"
              style={{ background: '#2563EB', color: '#fff' }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-[10px] mt-2" style={{ color: '#1A2438', fontFamily: "'JetBrains Mono', monospace" }}>
            AI recommendations require human approval · Grounded on live telemetry
          </p>
        </div>
      </div>
    </div>
  );
};
