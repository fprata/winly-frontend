'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TenderChatbotProps {
  tenderId: string;
}

/**
 * Renders a lightweight subset of markdown:
 * **bold**, bullet lines (• or -), \n as breaks, and inline `code`.
 */
function RichText({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1.5" />;

        const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ');
        const content = isBullet ? trimmed.slice(2) : trimmed;

        // Parse **bold** and `code` spans
        const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-black text-slate-900">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={j} className="px-1.5 py-0.5 bg-slate-200/60 rounded text-[10px] font-mono text-slate-700">{part.slice(1, -1)}</code>;
          }
          return <span key={j}>{part}</span>;
        });

        if (isBullet) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-[7px] flex-shrink-0" />
              <span className="leading-relaxed">{rendered}</span>
            </div>
          );
        }

        return <p key={i} className="leading-relaxed">{rendered}</p>;
      })}
    </div>
  );
}

export function TenderChatbot({ tenderId }: TenderChatbotProps) {
  const t = useTranslations('tenders');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderId,
          question: text.trim(),
          conversationHistory: messages.slice(-10),
          locale,
        }),
      });

      if (!res.ok) throw new Error('Chat failed');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.answer || t('chatbot.error') }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chatbot.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    t('chatbot.quickQuestions.risks'),
    t('chatbot.quickQuestions.competitors'),
    t('chatbot.quickQuestions.price'),
    t('chatbot.quickQuestions.requirements'),
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/30 flex items-center justify-center hover:bg-slate-800 hover:scale-105 transition-all z-50 border border-slate-700"
        >
          <MessageCircle size={22} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse border-2 border-white" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-full sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[600px] bg-white sm:rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                <Sparkles size={16} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest">{t('chatbot.title')}</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Powered by Winly AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-blue-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Assistant</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{t('chatbot.welcome')}</p>
                </div>

                {/* Quick Questions */}
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-left px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Sparkles size={10} className="text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white font-medium px-4 py-3'
                      : 'bg-white text-slate-600 font-medium px-4 py-3.5 border border-slate-200 shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <RichText text={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <Sparkles size={10} className="text-blue-400" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-sm flex items-center gap-2.5 text-sm text-slate-400 font-medium">
                  <Loader2 size={13} className="animate-spin text-blue-500" />
                  {t('chatbot.thinking')}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-30 disabled:pointer-events-none flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
