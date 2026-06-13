"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Send, Loader2, MessageCircle, ChevronDown, ArrowLeft, ImagePlus, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookingMessages, uploadChatImage, type ChatMessage } from "@/api/services/messages";
import { socketClient } from "@/lib/socket";

interface ChatDrawerProps {
  bookingId: string;
  currentUserId: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  className?: string;
}

// Pending optimistic image message (shown immediately, replaced by real one)
interface PendingImage {
  tempId: string;
  blobUrl: string;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── Message bubble ─────────────────────────────────────────────────────────
function MessageBubble({
  msg,
  isMe,
  compact = false,
  pending = false,
}: {
  msg: ChatMessage;
  isMe: boolean;
  compact?: boolean;
  pending?: boolean;
}) {
  const senderName = msg.sender?.fullName || "Other";
  const isImage = msg.type === "IMAGE";

  return (
    <div className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
      {!isMe && (
        <div className={cn(
          "rounded-full bg-tertiary/20 flex items-center justify-center flex-shrink-0 font-bold text-tertiary",
          compact ? "w-5 h-5 text-[8px] mb-3" : "w-7 h-7 text-[10px] mb-1"
        )}>
          {getInitials(senderName)}
        </div>
      )}
      <div className={cn("flex flex-col", isMe ? "items-end" : "items-start", compact ? "max-w-[78%]" : "max-w-[75%]")}>
        {!isMe && (
          <p className={cn("font-semibold text-tertiary mb-0.5 px-0.5", compact ? "text-[9px]" : "text-[11px]")}>
            {senderName}
          </p>
        )}
        <div className={cn(
          "overflow-hidden relative",
          isImage ? "rounded-2xl" : cn("rounded-2xl px-3", compact ? "py-1.5" : "py-2.5"),
          isMe
            ? cn("bg-tertiary text-white", !isImage && "rounded-br-sm")
            : cn("bg-white border border-border shadow-sm", !isImage && "rounded-bl-sm"),
          pending && "opacity-70"
        )}>
          {isImage ? (
            <>
              <img
                src={msg.content}
                alt="Shared image"
                className={cn("object-cover rounded-2xl block", compact ? "max-w-[180px] max-h-[140px]" : "max-w-[220px] max-h-[200px]")}
              />
              {/* Sending overlay on optimistic messages */}
              {pending && (
                <div className="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </>
          ) : (
            <p className={cn("leading-relaxed", isMe ? "text-white" : "text-heading", compact ? "text-xs" : "text-sm")}>
              {msg.content}
            </p>
          )}
        </div>
        <p className={cn("mt-0.5 px-0.5 text-muted-foreground", compact ? "text-[9px]" : "text-[10px]", isMe && "text-right")}>
          {pending ? "Sending…" : new Date(msg.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

// ── Input bar ──────────────────────────────────────────────────────────────
function InputBar({
  bookingId,
  currentUserId,
  inputRef,
  newMessage,
  setNewMessage,
  onSend,
  onOptimisticImage,
  compact = false,
}: {
  bookingId: string;
  currentUserId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  newMessage: string;
  setNewMessage: (v: string) => void;
  onSend: () => void;
  onOptimisticImage: (tempId: string, blobUrl: string, file: File) => void;
  compact?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(blobUrl);
    e.target.value = "";
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSendImage = () => {
    if (!imageFile || !imagePreview) return;
    const tempId = `pending-${Date.now()}`;
    // Pass blob URL + file up — parent shows optimistic bubble and uploads
    onOptimisticImage(tempId, imagePreview, imageFile);
    setImageFile(null);
    setImagePreview(null);
  };

  const canSend = imageFile ? true : newMessage.trim().length > 0;

  return (
    <div className={cn("bg-white border-t border-border", compact ? "px-3 py-2.5" : "px-4 py-3")}>
      {/* Image preview strip */}
      {imagePreview && (
        <div className="relative inline-block mb-2">
          <img src={imagePreview} alt="preview" className="h-20 rounded-xl object-cover border border-border" />
          <button
            onClick={clearImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
          >
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex gap-2 items-center">
        {/* Image picker button */}
        <button
          onClick={() => fileRef.current?.click()}
          className={cn(
            "flex-shrink-0 rounded-full text-muted-foreground hover:text-tertiary hover:bg-tertiary/10 transition-colors flex items-center justify-center",
            compact ? "w-7 h-7" : "w-10 h-10"
          )}
          aria-label="Attach image"
        >
          <ImagePlus className={compact ? "w-4 h-4" : "w-5 h-5"} />
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

        {/* Text input */}
        {!imageFile && (
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Type a message..."
            className={cn(
              "flex-1 bg-gray-50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-tertiary/30",
              compact ? "text-xs px-3.5 py-2" : "text-sm px-4 py-3"
            )}
          />
        )}

        {/* Send button */}
        <button
          onClick={imageFile ? handleSendImage : onSend}
          disabled={!canSend}
          className={cn(
            "flex-shrink-0 rounded-full bg-tertiary text-white flex items-center justify-center disabled:opacity-40 hover:bg-tertiary/90 active:scale-95 transition-all",
            compact ? "w-8 h-8" : "w-11 h-11"
          )}
          aria-label="Send"
        >
          <Send className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function ChatDrawer({ bookingId, currentUserId, title, subtitle, onClose, className }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [minimised, setMinimised] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
      if (msg.bookingId !== bookingId) return;
      setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
    });

    return () => {
      socketClient.leaveBooking(bookingId);
      unsub();
    };
  }, [bookingId]);

  useEffect(scrollToBottom, [messages, pendingImages, scrollToBottom]);

  useEffect(() => {
    if (!loading && !minimised) setTimeout(() => inputRef.current?.focus(), 80);
  }, [loading, minimised]);

  const handleSendText = () => {
    const text = newMessage.trim();
    if (!text) return;
    socketClient.sendMessage(bookingId, text, "TEXT");
    setNewMessage("");
  };

  /**
   * Optimistic image flow:
   * 1. Show blob URL immediately as a pending bubble
   * 2. Compress + upload to Cloudinary in background
   * 3. Once CDN URL arrives, send via socket (real message replaces pending)
   * 4. Remove pending bubble (socket will add the real message)
   */
  const handleOptimisticImage = useCallback(async (tempId: string, blobUrl: string, file: File) => {
    // 1. Show immediately
    setPendingImages((prev) => [...prev, { tempId, blobUrl }]);

    try {
      // 2. Compress + upload (fast — already a compressed JPEG after compressImage)
      const { url } = await uploadChatImage(file);
      // 3. Send real message via socket
      socketClient.sendMessage(bookingId, url, "IMAGE");
    } catch {
      // Upload failed — keep pending bubble with error look (no retry for now)
    } finally {
      // 4. Remove optimistic bubble (real message arrives via socket)
      setPendingImages((prev) => prev.filter((p) => p.tempId !== tempId));
      URL.revokeObjectURL(blobUrl);
    }
  }, [bookingId]);

  const sharedInputProps = {
    bookingId,
    currentUserId,
    inputRef,
    newMessage,
    setNewMessage,
    onSend: handleSendText,
    onOptimisticImage: handleOptimisticImage,
  };

  const EmptyState = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-8">
      <div className={cn("rounded-full bg-tertiary/10 flex items-center justify-center", compact ? "w-12 h-12" : "w-16 h-16")}>
        <MessageCircle className={cn("text-tertiary opacity-50", compact ? "w-6 h-6" : "w-8 h-8")} />
      </div>
      <p className={cn("font-medium text-heading", compact ? "text-xs" : "text-sm")}>No messages yet</p>
      <p className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>
        Start the conversation — you can also share photos
      </p>
    </div>
  );

  // Fake sender for optimistic bubbles
  const optimisticSender = { id: currentUserId, fullName: "You", role: "CUSTOMER", profilePicUrl: undefined };

  return (
    <>
      {/* ── MOBILE: full-screen ── */}
      <div className={cn("sm:hidden fixed inset-0 z-[60] flex flex-col bg-white", className)}>
        <div className="flex items-center gap-3 px-4 py-3 bg-tertiary text-white">
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0" aria-label="Close chat">
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

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-tertiary animate-spin" />
            </div>
          ) : messages.length === 0 && pendingImages.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === currentUserId} />
              ))}
              {pendingImages.map((p) => (
                <MessageBubble
                  key={p.tempId}
                  msg={{ id: p.tempId, bookingId, senderId: currentUserId, content: p.blobUrl, type: "IMAGE", sender: optimisticSender, createdAt: new Date().toISOString() }}
                  isMe
                  pending
                />
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <InputBar {...sharedInputProps} />
      </div>

      {/* ── DESKTOP: floating widget ── */}
      <div className={cn("hidden sm:flex fixed bottom-6 right-6 z-50 w-[370px] flex-col rounded-2xl shadow-2xl overflow-hidden border border-border", className)}>
        <div className="flex items-center gap-2.5 px-3.5 py-3 bg-tertiary text-white cursor-pointer select-none" onClick={() => setMinimised((m) => !m)}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">
            {getInitials(subtitle || title)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate leading-tight">{subtitle || title}</p>
            {subtitle && <p className="text-[10px] text-white/70 truncate">{title}</p>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); setMinimised((m) => !m); }} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <ChevronDown className={cn("w-3.5 h-3.5 text-white transition-transform", minimised ? "rotate-180" : "")} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {!minimised && (
          <>
            <div className="h-80 overflow-y-auto px-3 py-3 space-y-2.5 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-5 h-5 text-tertiary animate-spin" />
                </div>
              ) : messages.length === 0 && pendingImages.length === 0 ? (
                <EmptyState compact />
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === currentUserId} compact />
                  ))}
                  {pendingImages.map((p) => (
                    <MessageBubble
                      key={p.tempId}
                      msg={{ id: p.tempId, bookingId, senderId: currentUserId, content: p.blobUrl, type: "IMAGE", sender: optimisticSender, createdAt: new Date().toISOString() }}
                      isMe
                      compact
                      pending
                    />
                  ))}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
            <InputBar {...sharedInputProps} compact />
          </>
        )}
      </div>
    </>
  );
}
