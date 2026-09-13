import React, { useState, useRef, useEffect } from 'react';

const SUGGESTED_QUERIES = [
  'Summarize risk levels for ICU patients today',
  'What OT slots are open this afternoon?',
  'Which inventory items need reordering?',
  'Show me the latest prescriptions dispatched',
];

export default function AIConversationTab() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm the MedoNext AI assistant. Ask me about EMR clinical records, rapid prescriptions, OT schedules, or smart inventory analytics.",
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  async function send(text) {
    const query = (text ?? input).trim();
    if (!query) return;

    setMessages((m) => [...m, { role: 'user', text: query }]);
    setInput('');
    setThinking(true);

    // TODO: connect to backend — replace with a real call to your AI
    // assistant endpoint, e.g.:
    // const res = await fetch('/api/hospital/ai/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: query }),
    // });
    // const data = await res.json();
    // setMessages((m) => [...m, { role: 'assistant', text: data.reply }]);

    await new Promise((r) => setTimeout(r, 800));
    setMessages((m) => [
      ...m,
      {
        role: 'assistant',
        text: `(Demo response) I'd normally pull this from live EMR, scheduling, and inventory data — once the backend is connected, this answers "${query}" with real hospital data.`,
      },
    ]);
    setThinking(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[560px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] text-sm rounded-2xl px-4 py-2.5 ${
                m.role === 'user'
                  ? 'bg-emerald-800 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 text-sm rounded-2xl rounded-bl-sm px-4 py-2.5">
              MedoNext AI is thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested queries */}
      {messages.length === 1 && (
        <div className="px-5 pb-2 flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium px-3 py-1.5 rounded-full transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about EMR, prescriptions, OT schedules, inventory…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || thinking}
          className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-sm font-bold px-5 rounded-xl transition-all active:scale-95"
        >
          Send
        </button>
      </div>
    </div>
  );
}