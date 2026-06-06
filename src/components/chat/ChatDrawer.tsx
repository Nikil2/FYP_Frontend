"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, MessageCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookingMessages, sendMessage, type ChatMessage } from "@/api/services/messages";
import { socketClient } from "@/lib/socket";

interface ChatDrawerProps {
  bookingId: string;
  currentUserId: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export function ChatDrawer({ bookingId, currentUserId, title, subtitle, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [minimised, setMinimised] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socketClient.isConnected()) socketClient.connect();

    const load = async () => {
      setLoading(true);
      try {
        const result = await getBookingMessages(bookingId);
        const list = Array.isArray(result) ? result : (result.data || []);
        setMessages(list);
      } catch { /* skip */ }
      setLoading(false);
    };
    load();

    socketClient.joinBooking(bookingId);

    const unsub = socketClient.onNewMessage((msg: ChatMessage) => {
      if (msg.bookingId === bookingId) {
        setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
      }
    });

    return () => {
      socketClient.leaveBooking(bookingId);
      unsub();
    };
  }, [bookingId]);

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!loading && !minimised) setTimeout(() => inputRef.current?.focus(), 100);
  }, [loading, minimised]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || sending) return;
    setSending(true);
    setNewMessage("");
    try {
      const sent = await sendMessage({ bookingId, content: text });
      setMessages((prev) => prev.find((m) => m.id === sent.id) ? prev : [...prev, sent]);
    } catch { /* skip */ }
    setSending(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 w-[370px] sm:bottom-6 sm:right-6 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 bg-tertiary text-white cursor-pointer select-none"
        onClick={() => setMinimised((m) => !m)}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate leading-tight">{title}</p>
          {subtitle && <p className="text-[10px] text-white/70 truncate">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setMinimised((m) => !m); }}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronDown className={cn("w-3.5 h-3.5 text-white transition-transform", minimised ? "rotate-180" : "")} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Body — hidden when minimised */}
      {!minimised && (
        <>
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-3 space-y-2.5 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 text-tertiary animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-1.5 text-center">
                <MessageCircle className="w-8 h-8 text-muted-foreground opacity-25" />
                <p className="text-xs text-muted-foreground">No messages yet.</p>
                <p className="text-[10px] text-muted-foreground">Say hello!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3 py-1.5",
                        isMe
                          ? "bg-tertiary text-white rounded-br-sm"
                          : "bg-white border border-border rounded-bl-sm shadow-sm"
                      )}
                    >
                      {!isMe && (
                        <p className="text-[9px] font-semibold text-tertiary mb-0.5">
                          {msg.sender?.fullName || "Other"}
                        </p>
                      )}
                      <p className={cn("text-xs leading-snug", isMe ? "text-white" : "text-heading")}>
                        {msg.content}
                      </p>
                      <p className={cn("text-[9px] mt-0.5 text-right", isMe ? "text-white/60" : "text-muted-foreground")}>
                        {new Date(msg.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 bg-white border-t border-border flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              className="flex-1 text-xs bg-gray-50 border border-border rounded-full px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center disabled:opacity-40 hover:bg-tertiary/90 transition-colors flex-shrink-0"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
