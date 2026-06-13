"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, MessageCircle, ChevronDown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookingMessages, type ChatMessage } from "@/api/services/messages";
import { socketClient } from "@/lib/socket";

interface ChatDrawerProps {
  bookingId: string;
  currentUserId: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ChatDrawer({ bookingId, currentUserId, title, subtitle, onClose, className }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
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
    if (!loading && !minimised) setTimeout(() => inputRef.current?.focus(), 80);
  }, [loading, minimised]);

  const handleSend = () => {
    const text = newMessage.trim();
    if (!text) return;
    socketClient.sendMessage(bookingId, text);
    setNewMessage("");
  };

  return (
    <>
      {/* ── MOBILE: full-screen overlay ── */}
      <div className={cn("sm:hidden fixed inset-0 z-[60] flex flex-col bg-white", className)}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-tertiary text-white safe-area-top">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
            aria-label="Close chat"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold">
            {getInitials(subtitle || title)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate leading-tight">{subtitle || title}</p>
            <p className="text-[11px] text-white/70 truncate">{title}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-tertiary animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-8">
              <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-tertiary opacity-50" />
              </div>
              <p className="text-sm font-medium text-heading">No messages yet</p>
              <p className="text-xs text-muted-foreground">Start the conversation with your worker</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              const senderName = msg.sender?.fullName || "Other";
              return (
                <div key={msg.id} className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-tertiary/20 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-tertiary mb-1">
                      {getInitials(senderName)}
                    </div>
                  )}
                  <div className={cn("max-w-[75%] flex flex-col", isMe ? "items-end" : "items-start")}>
                    {!isMe && (
                      <p className="text-[11px] font-semibold text-tertiary mb-1 px-1">{senderName}</p>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5",
                        isMe
                          ? "bg-tertiary text-white rounded-br-sm"
                          : "bg-white border border-border rounded-bl-sm shadow-sm"
                      )}
                    >
                      <p className={cn("text-sm leading-relaxed", isMe ? "text-white" : "text-heading")}>
                        {msg.content}
                      </p>
                    </div>
                    <p className={cn("text-[10px] mt-1 px-1", isMe ? "text-muted-foreground text-right" : "text-muted-foreground")}>
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
        <div className="px-4 py-3 bg-white border-t border-border flex gap-3 items-center safe-area-bottom">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 text-sm bg-gray-50 border border-border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-11 h-11 rounded-full bg-tertiary text-white flex items-center justify-center disabled:opacity-40 hover:bg-tertiary/90 active:scale-95 transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── DESKTOP: floating chat widget ── */}
      <div className={cn(
        "hidden sm:flex fixed bottom-6 right-6 z-50 w-[370px] flex-col rounded-2xl shadow-2xl overflow-hidden border border-border",
        className
      )}>
        {/* Header */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-3 bg-tertiary text-white cursor-pointer select-none"
          onClick={() => setMinimised((m) => !m)}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">
            {getInitials(subtitle || title)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate leading-tight">{subtitle || title}</p>
            {subtitle && <p className="text-[10px] text-white/70 truncate">{title}</p>}
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

        {/* Body */}
        {!minimised && (
          <>
            <div className="h-80 overflow-y-auto px-3 py-3 space-y-2.5 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-5 h-5 text-tertiary animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-1.5 text-center">
                  <MessageCircle className="w-8 h-8 text-muted-foreground opacity-25" />
                  <p className="text-xs text-muted-foreground">No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  const senderName = msg.sender?.fullName || "Other";
                  return (
                    <div key={msg.id} className={cn("flex items-end gap-1.5", isMe ? "justify-end" : "justify-start")}>
                      {!isMe && (
                        <div className="w-5 h-5 rounded-full bg-tertiary/20 flex items-center justify-center flex-shrink-0 text-[8px] font-bold text-tertiary mb-3">
                          {getInitials(senderName)}
                        </div>
                      )}
                      <div className={cn("max-w-[78%] flex flex-col", isMe ? "items-end" : "items-start")}>
                        {!isMe && (
                          <p className="text-[9px] font-semibold text-tertiary mb-0.5 px-0.5">{senderName}</p>
                        )}
                        <div
                          className={cn(
                            "rounded-2xl px-3 py-1.5",
                            isMe
                              ? "bg-tertiary text-white rounded-br-sm"
                              : "bg-white border border-border rounded-bl-sm shadow-sm"
                          )}
                        >
                          <p className={cn("text-xs leading-snug", isMe ? "text-white" : "text-heading")}>
                            {msg.content}
                          </p>
                        </div>
                        <p className={cn("text-[9px] mt-0.5 px-0.5", isMe ? "text-right text-muted-foreground" : "text-muted-foreground")}>
                          {new Date(msg.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

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
                disabled={!newMessage.trim()}
                className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center disabled:opacity-40 hover:bg-tertiary/90 transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
