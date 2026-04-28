'use client';

import { MessageCircle, Send, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const STORAGE_KEY = 'nctc-chat-state';
const WELCOME =
  "Hi! I'm here 24/7. Got a tree question or need a quote?";
const ERROR_FALLBACK =
  "Sorry — I'm having trouble right now. Please call us at (518) 555-0142.";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hydrate from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { messages?: Message[]; open?: boolean };
      if (Array.isArray(saved.messages)) setMessages(saved.messages);
      if (typeof saved.open === 'boolean') setOpen(saved.open);
    } catch {
      /* ignore corrupt state */
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, open }),
      );
    } catch {
      /* storage may be full or disabled */
    }
  }, [messages, open]);

  // Auto-scroll to bottom on new messages or while streaming
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      // Defer so the panel is mounted before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape closes the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || loading) return;

      const next: Message[] = [...messages, { role: 'user', content: text }];
      setMessages(next);
      setInput('');
      setLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: next }),
        });

        if (!res.ok || !res.body) throw new Error('Bad response');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        // Add an empty assistant message that we'll fill in as tokens arrive
        setMessages((curr) => [...curr, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          setMessages((curr) => {
            const updated = [...curr];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: buffer,
            };
            return updated;
          });
        }
      } catch {
        setMessages((curr) => [
          ...curr,
          { role: 'assistant', content: ERROR_FALLBACK },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages],
  );

  return (
    <>
      {/* Closed state — floating green circle */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        aria-expanded={open}
        className={`fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)] transition-all duration-200 hover:scale-105 hover:bg-forest-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 md:bottom-6 md:right-6 ${
          open ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100'
        }`}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Open state — panel */}
      {open && (
        <aside
          aria-label="Chat with North Country Tree Co."
          className="fixed bottom-0 right-0 z-40 flex h-[100dvh] w-full flex-col bg-white shadow-[0_8px_40px_-8px_rgba(0,0,0,0.25)] md:bottom-6 md:right-6 md:h-[600px] md:max-h-[calc(100vh-3rem)] md:w-[380px] md:rounded-xl md:border md:border-charcoal/10"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between rounded-none bg-forest px-4 py-3 text-cream md:rounded-t-xl">
            <div className="min-w-0">
              <p className="font-serif text-base leading-tight">
                North Country Tree Co.
              </p>
              <p className="text-xs text-cream/80">
                Usually replies in seconds
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-white px-4 py-4"
            aria-live="polite"
            aria-relevant="additions text"
          >
            <Bubble role="assistant">{WELCOME}</Bubble>
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role}>
                {m.content || (m.role === 'assistant' ? <TypingIndicator /> : '')}
              </Bubble>
            ))}
            {loading &&
              messages[messages.length - 1]?.role !== 'assistant' && (
                <Bubble role="assistant">
                  <TypingIndicator />
                </Bubble>
              )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-charcoal/10 bg-white p-3 md:rounded-b-xl"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              aria-label="Message"
              disabled={loading}
              className="flex-1 rounded-md border border-charcoal/15 px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 disabled:bg-charcoal/5"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-forest text-cream transition-colors hover:bg-forest-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}

function Bubble({
  role,
  children,
}: {
  role: 'user' | 'assistant';
  children: ReactNode;
}) {
  if (role === 'user') {
    return (
      <div className="ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-cream px-3.5 py-2.5 text-sm text-charcoal">
        {children}
      </div>
    );
  }
  return (
    <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md border border-charcoal/10 bg-white px-3.5 py-2.5 text-sm text-charcoal">
      {children}
    </div>
  );
}

function TypingIndicator() {
  return (
    <span
      className="inline-flex items-center gap-1 py-1"
      aria-label="Assistant is typing"
    >
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal/45 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal/45 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal/45" />
    </span>
  );
}
