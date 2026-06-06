"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  Star,
  MessageCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Ban,
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getBookingById, cancelBooking, updateBookingStatus, type Booking } from "@/api/services/bookings";
import { toast } from "sonner";
import { getBookingMessages, sendMessage, type ChatMessage } from "@/api/services/messages";
import { submitFeedback } from "@/api/services/feedback";
import { fileComplaint } from "@/api/services/complaints";
import { getAuthUser } from "@/lib/auth";
import { socketClient } from "@/lib/socket";

type BookingStatus = Booking["status"];

function getStatusConfig(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return { label: "Pending Confirmation", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: AlertCircle, description: "Waiting for worker to confirm your booking" };
    case "NEGOTIATION":
      return { label: "Price Negotiation", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: Clock, description: "Negotiating price with the worker" };
    case "ACCEPTED":
      return { label: "Accepted", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: CheckCircle2, description: "Worker has accepted. They will arrive at scheduled time" };
    case "IN_PROGRESS":
      return { label: "In Progress", color: "text-tertiary", bg: "bg-tertiary/5", border: "border-tertiary/20", icon: Clock, description: "Worker is currently working on your service" };
    case "COMPLETED":
      return { label: "Completed", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2, description: "This service has been completed" };
    case "CANCELLED":
      return { label: "Cancelled", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: XCircle, description: "This booking was cancelled" };
    case "DISPUTED":
      return { label: "Disputed", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: AlertTriangle, description: "A complaint has been filed for this booking" };
    default:
      return { label: status, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200", icon: AlertCircle, description: "" };
  }
}

function StatusTimeline({ status }: { status: BookingStatus }) {
  const steps = [
    { key: "PENDING", label: "Booking Placed" },
    { key: "ACCEPTED", label: "Worker Confirmed" },
    { key: "IN_PROGRESS", label: "Work Started" },
    { key: "COMPLETED", label: "Completed" },
  ];
  const statusOrder = ["PENDING", "NEGOTIATION", "ACCEPTED", "IN_PROGRESS", "COMPLETED"];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === "CANCELLED";
  const isDisputed = status === "DISPUTED";

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isCompleted = !isCancelled && !isDisputed && index <= currentIndex;
        const isCurrent = !isCancelled && !isDisputed && statusOrder[currentIndex] === step.key;
        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", isCompleted ? "bg-tertiary border-tertiary" : "bg-white border-gray-300")}>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              {index < steps.length - 1 && <div className={cn("w-0.5 h-8", isCompleted && index < currentIndex ? "bg-tertiary" : "bg-gray-200")} />}
            </div>
            <div className="pb-6">
              <p className={cn("text-xs font-medium", isCurrent ? "text-tertiary" : isCompleted ? "text-heading" : "text-muted-foreground")}>
                {step.label}
                {isCurrent && <span className="ml-2 text-[10px] bg-tertiary/10 text-tertiary px-1.5 py-0.5 rounded-full">Current</span>}
              </p>
            </div>
          </div>
        );
      })}
      {(isCancelled || isDisputed) && (
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", isCancelled ? "bg-red-500 border-red-500" : "bg-orange-500 border-orange-500")}>
              {isCancelled ? <XCircle className="w-3 h-3 text-white" /> : <AlertTriangle className="w-3 h-3 text-white" />}
            </div>
          </div>
          <p className={cn("text-xs font-medium", isCancelled ? "text-red-600" : "text-orange-600")}>{isCancelled ? "Cancelled" : "Disputed"}</p>
        </div>
      )}
    </div>
  );
}

function formatRating(value: unknown): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "N/A";
  }
  return numeric.toFixed(1);
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
    if (!socketClient.isConnected()) {
      socketClient.connect();
    }

    const loadMessages = async () => {
      try {
        const result = await getBookingMessages(bookingId);
        const messageList = Array.isArray(result) ? result : (result.data || []);
        setMessages(messageList);
      } catch { /* skip */ }
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
      const sent = await sendMessage({ bookingId, content: newMessage.trim() });
      setMessages((prev) => {
        if (prev.find((m) => m.id === sent.id)) return prev;
        return [...prev, sent];
      });
      setNewMessage("");
    } catch { /* skip */ }
    setSending(false);
  };

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-heading flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-tertiary" /> Chat
        </h3>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">No messages yet. Start a conversation!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-3 py-2", isMe ? "bg-tertiary text-white rounded-br-sm" : "bg-white border border-border rounded-bl-sm")}>
                  {!isMe && <p className="text-[10px] font-medium text-tertiary mb-0.5">{msg.sender?.fullName}</p>}
                  <p className={cn("text-xs", isMe ? "text-white" : "text-heading")}>{msg.content}</p>
                  <p className={cn("text-[9px] mt-1", isMe ? "text-white/60" : "text-muted-foreground")}>
                    {new Date(msg.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-border flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-gray-50 border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="w-9 h-9 rounded-full bg-tertiary text-white flex items-center justify-center disabled:opacity-50 hover:bg-tertiary-hover transition-colors"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ==================== REVIEW FORM ====================
function ReviewForm({ bookingId, onSubmitted }: { bookingId: string; onSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    try {
      await submitFeedback({ bookingId, rating, comment: comment || undefined });
      toast.success("Review submitted. Thank you!");
      onSubmitted();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.toLowerCase().includes("already")) {
        toast.error("You have already submitted a review for this booking.");
        onSubmitted(); // re-fetch so booking.feedback populates and hides the form
      } else {
        toast.error(message || "Failed to submit review. Please try again.");
      }
    }
    setSubmitting(false);
  };

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-heading mb-4">Leave a Review</h3>

      {/* Stars */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i + 1)}
              className="p-1 transition-transform active:scale-90"
            >
              <Star
                className={cn(
                  "w-9 h-9 transition-colors",
                  i < (hoverRating || rating)
                    ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                    : "text-gray-300 fill-gray-100"
                )}
              />
            </button>
          ))}
        </div>
        <span className={cn(
          "text-sm font-medium transition-colors",
          rating > 0 ? "text-amber-600" : "text-muted-foreground"
        )}>
          {rating > 0 ? labels[rating] : "Tap a star to rate"}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review (optional)..."
        className="w-full text-sm bg-gray-50 border border-border rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-tertiary/30 mb-3"
      />
      <Button
        type="button"
        variant="tertiary"
        size="sm"
        className="w-full"
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
      </Button>
    </div>
  );
}

// ==================== MAIN PAGE ====================
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [complaintDesc, setComplaintDesc] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [filingComplaint, setFilingComplaint] = useState(false);
  const [completing, setCompleting] = useState(false);
  const currentUser = getAuthUser();

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch { /* skip */ }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // Listen for real-time booking status updates
  useEffect(() => {
    const unsub = socketClient.onBookingStatusUpdate((data) => {
      if (data.bookingId === id) {
        fetchBooking();
      }
    });
    return unsub;
  }, [id, fetchBooking]);

  const handleCancel = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      await cancelBooking(id);
      await fetchBooking();
      setShowCancelModal(false);
    } catch { /* skip */ }
    setCancelling(false);
  };

  const handleMarkComplete = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      await updateBookingStatus(id, "COMPLETED");
      await fetchBooking();
      setShowCompleteModal(false);
      toast.success("Booking marked as complete. Thank you!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as complete.");
    }
    setCompleting(false);
  };

  const handleFileComplaint = async () => {
    if (!complaintDesc.trim() || filingComplaint) return;
    setFilingComplaint(true);
    try {
      await fileComplaint({ bookingId: id, description: complaintDesc.trim() });
      setShowComplaintModal(false);
      setComplaintDesc("");
      await fetchBooking();
    } catch { /* skip */ }
    setFilingComplaint(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-tertiary animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Booking not found</p>
          <button onClick={() => router.push("/customer/orders")} className="mt-3 text-sm text-tertiary font-medium">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;
  const isActive = ["PENDING", "NEGOTIATION", "ACCEPTED", "IN_PROGRESS"].includes(booking.status);
  const canReview = booking.status === "COMPLETED" && !booking.feedback;
  const canComplaint = ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(booking.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <button onClick={() => router.push("/customer/orders")} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors md:hidden">
          <ChevronLeft className="w-5 h-5 text-heading" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-heading">Order Details</h1>
          <p className="text-[10px] text-muted-foreground">{booking.id.slice(0, 8)}...</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Banner */}
        <div className={cn("rounded-xl p-4 border", statusConfig.bg, statusConfig.border)}>
          <div className="flex items-center gap-3">
            <StatusIcon className={cn("w-8 h-8", statusConfig.color)} />
            <div>
              <h2 className={cn("text-sm font-bold", statusConfig.color)}>{statusConfig.label}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{statusConfig.description}</p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-4">Order Timeline</h3>
          <StatusTimeline status={booking.status} />
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-3">Service Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Service</span>
              <span className="text-sm font-medium text-heading">{booking.service?.name || "Service"}</span>
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Price</span>
              <span className="text-base font-bold text-heading">
                {booking.finalPrice ? `Rs. ${Number(booking.finalPrice).toLocaleString()}` : "Price TBD"}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-3">Schedule & Location</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-tertiary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-heading">
                  {new Date(booking.scheduledAt || booking.createdAt).toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-tertiary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-heading">{booking.jobAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-2">Work Description</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{booking.description}</p>
        </div>

        {/* Service Images */}
        {booking.imageUrls && booking.imageUrls.length > 0 && (
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-heading mb-3">
              Service Images ({booking.imageUrls.length})
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {booking.imageUrls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    alt={`Service image ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-border hover:opacity-90 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Worker Info */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-heading mb-3">Assigned Worker</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-tertiary/20 flex items-center justify-center overflow-hidden">
              {booking.worker?.user?.profilePicUrl ? (
                <img src={booking.worker.user.profilePicUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-tertiary" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-heading">{booking.worker?.user?.fullName || "Worker"}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs text-muted-foreground">{formatRating(booking.worker?.averageRating)} rating</span>
              </div>
            </div>
          </div>
          {isActive && (
            <div className="flex gap-2 mt-4">
              <a href={`tel:${booking.worker?.user?.phoneNumber}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-tertiary/10 text-tertiary rounded-lg text-xs font-medium">
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            </div>
          )}
        </div>

        {/* Chat Section */}
        {isActive && currentUser && <ChatSection bookingId={booking.id} currentUserId={currentUser.id} />}

        {/* Review Section */}
        {canReview && <ReviewForm bookingId={booking.id} onSubmitted={fetchBooking} />}

        {/* Existing Review */}
        {booking.feedback && (() => {
          const reviewLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
          const r = booking.feedback.rating;
          return (
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-amber-50/60">
                <h3 className="text-sm font-semibold text-heading flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Your Review
                </h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(booking.feedback.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              <div className="px-4 py-4 space-y-3">
                {/* Stars + label */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-6 h-6",
                          i < r ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-100"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-amber-600">
                    {r}/5 — {reviewLabels[r]}
                  </span>
                </div>

                {/* Comment */}
                {booking.feedback.comment ? (
                  <div className="rounded-lg bg-gray-50 border border-border px-3 py-2.5">
                    <p className="text-sm text-paragraph leading-relaxed">"{booking.feedback.comment}"</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No written comment.</p>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom Actions */}
      {isActive && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border p-4 md:bottom-0">
          <div className="max-w-lg mx-auto flex flex-col gap-2">
            {booking.status === "IN_PROGRESS" && (
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={() => setShowCompleteModal(true)}
              >
                <CheckCircle2 className="w-4 h-4" /> Mark as Complete
              </Button>
            )}
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setShowCancelModal(true)}>
                <Ban className="w-4 h-4" /> Cancel Booking
              </Button>
              {canComplaint && (
                <Button variant="outline" size="sm" className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => setShowComplaintModal(true)}>
                  <AlertTriangle className="w-4 h-4" /> File Complaint
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6">
            <h3 className="text-lg font-bold text-heading mb-2">Mark as Complete?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Confirm that the worker has finished the job and you are satisfied with the service. You can leave a review after.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCompleteModal(false)}>Not Yet</Button>
              <Button variant="primary" className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleMarkComplete} disabled={completing}>
                {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Complete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 animate-slide-in-right">
            <h3 className="text-lg font-bold text-heading mb-2">Cancel Booking?</h3>
            <p className="text-sm text-muted-foreground mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>Keep Booking</Button>
              <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 animate-slide-in-right">
            <h3 className="text-lg font-bold text-heading mb-2">File a Complaint</h3>
            <p className="text-sm text-muted-foreground mb-4">Describe the issue with this booking.</p>
            <textarea
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              placeholder="Describe the problem..."
              className="w-full text-sm bg-gray-50 border border-border rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-tertiary/30 mb-4"
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowComplaintModal(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={handleFileComplaint} disabled={!complaintDesc.trim() || filingComplaint}>
                {filingComplaint ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Complaint"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
