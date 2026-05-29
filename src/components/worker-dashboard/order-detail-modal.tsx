"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import {
  X,
  MapPin,
  Clock,
  Phone,
  User,
  FileText,
  Navigation,
  ExternalLink,
  Check,
  XCircle,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import type { ProviderOrder } from "@/types/provider";
import { updateBookingStatus } from "@/api/services/bookings";
import { getBookingMessages, sendMessage, type ChatMessage } from "@/api/services/messages";
import { socketClient } from "@/lib/socket";
import { getAuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface OrderDetailModalProps {
  order: ProviderOrder | any;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate?: () => void;
}

// ==================== CHAT SECTION ====================
function ChatSection({ bookingId, currentUserId }: { bookingId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const result = await getBookingMessages(bookingId);
        const messageList = Array.isArray(result) ? result : (result.data || []);
        setMessages(messageList);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();

    // Join booking room for real-time
    socketClient.joinBooking(bookingId);

    // Listen for new messages via Socket.IO
    const unsubscribe = socketClient.onNewMessage((message: ChatMessage) => {
      if (message.bookingId === bookingId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });

    return () => {
      socketClient.leaveBooking(bookingId);
      unsubscribe();
    };
  }, [bookingId]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage({ bookingId, content: newMessage.trim() });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
    setSending(false);
  };

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm my-4">
      <div className="px-4 py-3 border-b border-border bg-gray-50 flex items-center gap-2">
        <MessageSquare className="w-4.5 h-4.5 text-tertiary" />
        <h4 className="text-sm font-semibold text-heading">Chat with Customer</h4>
      </div>
      <div className="h-44 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No messages yet. Start a conversation!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-2xl px-3 py-1.5", isMe ? "bg-tertiary text-white rounded-br-sm" : "bg-white border border-border rounded-bl-sm")}>
                  {!isMe && <p className="text-[10px] font-semibold text-tertiary mb-0.5">{msg.sender?.fullName || "Customer"}</p>}
                  <p className={cn("text-xs", isMe ? "text-white" : "text-heading")}>{msg.content}</p>
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
      <div className="p-2.5 border-t border-border flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 text-xs bg-gray-50 border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center disabled:opacity-50 hover:bg-tertiary-hover transition-colors"
        >
          {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN MODAL ====================
export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onOrderUpdate,
}: OrderDetailModalProps) {
  const { t } = useLanguage();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>(order?.status || "pending");
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = getAuthUser();

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleAccept = async () => {
    setIsUpdating(true);
    try {
      await updateBookingStatus(order.id, "ACCEPTED");
      setStatus("accepted");
      if (onOrderUpdate) onOrderUpdate();
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("Failed to accept order:", error);
      alert("Failed to accept order. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    try {
      await updateBookingStatus(order.id, "CANCELLED");
      setStatus("rejected");
      if (onOrderUpdate) onOrderUpdate();
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("Failed to reject order:", error);
      alert("Failed to reject order. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-500 bg-red-50 border-red-200";
      case "rejected":
        return "text-red-500 bg-red-50 border-red-200";
      case "in-progress":
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "accepted":
        return "text-tertiary bg-tertiary/10 border-tertiary/20";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-paragraph bg-muted border-border";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return t.completed;
      case "cancelled":
        return t.cancelled;
      case "rejected":
        return "Rejected";
      case "in-progress":
      case "in_progress":
        return t.inProgress;
      case "accepted":
        return t.accepted;
      case "pending":
        return t.pending;
      default:
        return status;
    }
  };

  const hasCoordinates = order.customerLat && order.customerLng;

  // Google Maps embed URL for the customer's location
  const mapEmbedUrl = hasCoordinates
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${order.customerLat},${order.customerLng}&zoom=15&maptype=roadmap`
    : null;

  // Google Maps directions link (worker can open in Google Maps app)
  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${order.customerLat},${order.customerLng}`
    : null;

  const isChatActive = ["accepted", "in-progress", "in_progress"].includes(status.toLowerCase());

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-white border-b border-border rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-tertiary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-heading">Order Details</h2>
              <p className="text-xs text-muted-foreground">
                {t.serviceId}: {order.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ── Service & Status ── */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-tertiary">
                {order.serviceName}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Booked on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getStatusColor(status)}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>

          {/* ── Customer Info ── */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <h4 className="text-sm font-semibold text-heading flex items-center gap-2">
              <User className="w-4 h-4 text-tertiary" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium text-heading">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="font-medium text-tertiary flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {order.customerPhone}
                </a>
              </div>
            </div>
          </div>

          {/* ── Schedule & Price ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-tertiary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Schedule
                </p>
              </div>
              <p className="font-bold text-heading">{order.scheduledTime}</p>
              <p className="text-sm text-paragraph">{order.scheduledDate}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-tertiary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.agreedPrice}
                </p>
              </div>
              <p className="text-2xl font-bold text-tertiary">
                Rs. {order.agreedPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* ── Job Notes ── */}
          {order.notes && (
            <div className="rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-heading mb-2">
                Job Notes
              </h4>
              <p className="text-sm text-paragraph">{order.notes}</p>
            </div>
          )}

          {/* ── Location & Map ── */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="p-4">
              <h4 className="text-sm font-semibold text-heading flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-tertiary" />
                Customer Location
              </h4>
              <p className="text-sm text-paragraph">{order.location}</p>
            </div>

            {/* Google Maps Embed */}
            {mapEmbedUrl ? (
              <div className="relative">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="Customer Location Map"
                />

                {/* Live Location Indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-xs font-semibold text-heading">
                    Live Location
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                  <p className="text-sm text-muted-foreground">
                    Map not available
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Chat Section ── */}
          {isChatActive && currentUser && (
            <ChatSection bookingId={order.id} currentUserId={currentUser.id} />
          )}

          {/* ── Action Buttons ── */}
          {status.toLowerCase() === "pending" ? (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAccept}
                variant="tertiary"
                size="sm"
                className="flex-1 rounded-xl text-white font-semibold transition-colors"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2 text-white" />
                    Accept Order
                  </>
                )}
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 font-semibold transition-colors"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-red-600" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                    Reject Order
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="tertiary"
                    size="sm"
                    className="w-full rounded-xl text-white font-semibold"
                  >
                    <Navigation className="w-4 h-4 mr-2 text-white" />
                    Navigate to Customer
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-60 text-white" />
                  </Button>
                </a>
              )}
              <a href={`tel:${order.customerPhone}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl font-semibold hover:bg-muted"
                >
                  <Phone className="w-4 h-4 mr-2 text-heading" />
                  Call Customer
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
