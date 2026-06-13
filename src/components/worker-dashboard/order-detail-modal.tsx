"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import {
  X,
  MapPin,
  Clock,
  Star,
  Phone,
  User,
  FileText,
  Navigation,
  Check,
  XCircle,
  Loader2,
  CheckCircle2,
  ArrowRightLeft,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import type { ProviderOrder } from "@/types/provider";
import {
  updateBookingStatus,
  getBookingById,
  acceptProposal,
  createProposal,
  markJobDone,
  type Feedback,
  type PriceProposal,
} from "@/api/services/bookings";
import { getAuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { socketClient } from "@/lib/socket";

interface OrderDetailModalProps {
  order: ProviderOrder | any;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate?: () => void;
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
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [proposals, setProposals] = useState<PriceProposal[]>([]);
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [isCountering, setIsCountering] = useState(false);
  const currentUser = getAuthUser();

  // Fetch booking detail (proposals + feedback) when modal opens
  useEffect(() => {
    if (!isOpen || !order?.id) return;
    getBookingById(order.id)
      .then((booking) => {
        setFeedback(booking.feedback ?? null);
        setProposals(booking.proposals ?? []);
        setStatus(booking.status.toLowerCase());
      })
      .catch(() => {});
  }, [isOpen, order?.id]);

  // Real-time: new price proposals from the customer
  useEffect(() => {
    if (!isOpen || !order?.id) return;
    const unsubProposal = socketClient.onNewProposal((data) => {
      if (data.bookingId !== order.id) return;
      setProposals((prev) => {
        if (prev.some((p) => p.id === data.id)) return prev;
        return [...prev, data];
      });
    });
    const unsubStatus = socketClient.onBookingStatusUpdate((data) => {
      if (data.bookingId !== order.id) return;
      setStatus(data.status.toLowerCase());
      if (onOrderUpdate) onOrderUpdate();
    });
    return () => {
      unsubProposal();
      unsubStatus();
    };
  }, [isOpen, order?.id, onOrderUpdate]);

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

  const pendingProposals = proposals.filter((p) => p.status === "PENDING");
  const pendingProposal = pendingProposals[pendingProposals.length - 1];
  const latestProposalIsFromCustomer =
    pendingProposal && pendingProposal.proposedBy === (order.customerId ?? order.customer?.id ?? "");

  const handleAcceptProposal = async () => {
    if (!pendingProposal) return;
    setIsUpdating(true);
    // Optimistic UI — update state immediately, don't wait for list refresh
    setProposals((prev) =>
      prev.map((p) =>
        p.id === pendingProposal.id
          ? { ...p, status: "ACCEPTED" as const }
          : p.status === "PENDING"
          ? { ...p, status: "REJECTED" as const }
          : p
      )
    );
    setStatus("accepted");
    try {
      await acceptProposal(order.id, pendingProposal.id);
      toast.success("Price accepted! Booking confirmed.");
      if (onOrderUpdate) onOrderUpdate(); // background list refresh
      setTimeout(() => onClose(), 1200);
    } catch (error) {
      // Revert optimistic update on failure
      setProposals((prev) =>
        prev.map((p) =>
          p.id === pendingProposal.id ? { ...p, status: "PENDING" as const } : p
        )
      );
      setStatus("negotiation");
      toast.error(error instanceof Error ? error.message : "Failed to accept price.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCounterProposal = async () => {
    const amount = parseFloat(counterAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    setIsCountering(true);
    setShowCounterInput(false);
    setCounterAmount("");
    try {
      const newProposal = await createProposal(order.id, amount);
      setProposals((prev) => [...prev, newProposal]);
      toast.success(`Counter offer of Rs. ${amount.toLocaleString()} sent to customer.`);
      // No list refresh needed — status stays NEGOTIATION, only proposal list changed
    } catch (error) {
      setShowCounterInput(true); // re-open input on failure
      toast.error(error instanceof Error ? error.message : "Failed to send counter offer.");
    } finally {
      setIsCountering(false);
    }
  };

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
      setStatus("cancelled");
      if (onOrderUpdate) onOrderUpdate();
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("Failed to reject order:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reject order.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkComplete = async () => {
    setIsUpdating(true);
    try {
      // Worker marks done → awaits customer confirmation (job counts only then).
      await markJobDone(order.id);
      setStatus("pending_confirmation");
      toast.success("Marked as done! Waiting for customer to confirm.");
      if (onOrderUpdate) onOrderUpdate();
      setTimeout(() => onClose(), 1200);
    } catch (error) {
      console.error("Failed to complete order:", error);
      toast.error(error instanceof Error ? error.message : "Failed to mark as complete.");
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
      case "negotiation":
        return "text-purple-700 bg-purple-50 border-purple-200";
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
      case "negotiation":
        return t.negotiation;
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

  const hasCoordinates =
    Number.isFinite(order.customerLat) && Number.isFinite(order.customerLng);
  const addressQuery = order.location ? encodeURIComponent(order.location) : "";

  // Google Maps embed URL for the customer's location
  const mapEmbedUrl = hasCoordinates
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${order.customerLat},${order.customerLng}&zoom=15&maptype=roadmap`
    : addressQuery
      ? `https://www.google.com/maps?q=${addressQuery}&output=embed`
      : null;

  // Google Maps directions link (worker can open in Google Maps app)
  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${order.customerLat},${order.customerLng}`
    : addressQuery
      ? `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`
      : null;

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
            <div className={cn(
              "rounded-xl border p-4",
              status.toLowerCase() === "negotiation" || status.toLowerCase() === "pending"
                ? "border-purple-200 bg-purple-50"
                : "border-border"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-tertiary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {order.agreedPrice > 0 ? t.agreedPrice : "Proposed"}
                </p>
              </div>
              {order.agreedPrice > 0 ? (
                <p className="text-2xl font-bold text-tertiary">
                  Rs. {order.agreedPrice.toLocaleString()}
                </p>
              ) : pendingProposal ? (
                <p className="text-2xl font-bold text-purple-700">
                  Rs. {Number(pendingProposal.amount).toLocaleString()}
                </p>
              ) : (
                <p className="text-sm font-semibold text-muted-foreground">No price yet</p>
              )}
            </div>
          </div>

          {/* ── Price Negotiation Panel ── */}
          {["negotiation", "pending"].includes(status.toLowerCase()) && (
            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-semibold text-purple-800">Price Negotiation</h4>
              </div>

              {/* Proposal history */}
              {proposals.length > 0 && (
                <div className="space-y-2">
                  {proposals.map((p) => {
                    const isFromCustomer = p.proposedBy === (order.customerId ?? "");
                    return (
                      <div
                        key={p.id}
                        className={cn(
                          "flex items-center justify-between text-xs px-3 py-2 rounded-lg",
                          p.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : p.status === "REJECTED"
                            ? "bg-red-50 text-red-600 line-through opacity-60"
                            : isFromCustomer
                            ? "bg-white border border-purple-200 text-purple-900"
                            : "bg-tertiary/10 border border-tertiary/20 text-heading"
                        )}
                      >
                        <span className="font-medium">
                          {isFromCustomer ? "Customer" : "You (Worker)"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">Rs. {Number(p.amount).toLocaleString()}</span>
                          {p.status === "ACCEPTED" && <Check className="w-3.5 h-3.5 text-green-600" />}
                          {p.status === "PENDING" && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">Pending</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action: Accept price or counter */}
              {pendingProposal && latestProposalIsFromCustomer && !showCounterInput && (
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleAcceptProposal}
                    variant="tertiary"
                    size="sm"
                    className="flex-1 text-white font-semibold"
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                    Accept Rs. {Number(pendingProposal.amount).toLocaleString()}
                  </Button>
                  <Button
                    onClick={() => setShowCounterInput(true)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-purple-700 border-purple-300 hover:bg-purple-50 font-semibold"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-1" />
                    Counter Offer
                  </Button>
                </div>
              )}

              {pendingProposal && !latestProposalIsFromCustomer && !showCounterInput && (
                <p className="text-xs text-center text-purple-600 font-medium py-1">
                  Waiting for customer to respond to your offer...
                </p>
              )}

              {!pendingProposal && status.toLowerCase() === "pending" && !showCounterInput && (
                <Button
                  onClick={() => setShowCounterInput(true)}
                  variant="outline"
                  size="sm"
                  className="w-full text-tertiary border-tertiary/40 hover:bg-tertiary/10 font-semibold"
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  Propose Your Price
                </Button>
              )}

              {/* Counter offer input */}
              {showCounterInput && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-purple-800">Your Counter Price (Rs.)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center border border-purple-300 rounded-lg bg-white px-3 gap-1">
                      <span className="text-sm text-muted-foreground font-medium">Rs.</span>
                      <input
                        type="number"
                        min="1"
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        placeholder="e.g. 1500"
                        className="flex-1 py-2 text-sm font-semibold text-heading bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <Button
                      onClick={handleCounterProposal}
                      variant="tertiary"
                      size="sm"
                      disabled={isCountering || !counterAmount}
                      className="text-white font-semibold px-4"
                    >
                      {isCountering ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
                    </Button>
                    <Button
                      onClick={() => { setShowCounterInput(false); setCounterAmount(""); }}
                      variant="outline"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Job Notes ── */}
          {order.notes && (
            <div className="rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-heading mb-2">
                Job Notes
              </h4>
              <p className="text-sm text-paragraph">{order.notes}</p>
            </div>
          )}

          {/* ── Customer Images ── */}
          {order.imageUrls && order.imageUrls.length > 0 && (
            <div className="rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-tertiary" />
                Service Images ({order.imageUrls.length})
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {order.imageUrls.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={`Job image ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border border-border hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
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

          {/* ── Customer Feedback ── */}
          {["completed", "COMPLETED"].includes(status) && (
            <div className="rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Customer Review
              </h4>
              {feedback ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < feedback.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200 fill-gray-200"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-heading">
                      {feedback.rating}/5
                    </span>
                  </div>
                  {feedback.comment && (
                    <p className="text-sm text-paragraph leading-relaxed bg-muted/50 rounded-lg px-3 py-2">
                      "{feedback.comment}"
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No review left yet by the customer.
                </p>
              )}
            </div>
          )}

          {/* ── Action Buttons ── */}
          {["pending", "negotiation"].includes(status.toLowerCase()) ? (
            /* PENDING / NEGOTIATION → only Reject (accept is in negotiation panel) */
            <div className="pt-2">
              <Button
                onClick={handleReject}
                variant="outline"
                size="sm"
                className="w-full rounded-xl text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 font-semibold transition-colors"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-red-600" /> : <XCircle className="w-4 h-4 mr-2 text-red-600" />}
                {isUpdating ? "Rejecting..." : "Reject & Cancel"}
              </Button>
            </div>
          ) : ["accepted", "in_progress"].includes(status.toLowerCase()) ? (
            /* ACCEPTED or IN_PROGRESS → Mark Complete + Call/Navigate */
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleMarkComplete}
                variant="tertiary"
                size="sm"
                className="flex-1 rounded-xl text-white font-semibold transition-colors bg-green-600 hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" /> : <CheckCircle2 className="w-4 h-4 mr-2 text-white" />}
                {isUpdating ? "Completing..." : "Mark as Complete"}
              </Button>
              {directionsUrl ? (
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-xl font-semibold hover:bg-muted">
                    <Navigation className="w-4 h-4 mr-2 text-heading" />
                    Navigate
                  </Button>
                </a>
              ) : (
                <a href={`tel:${order.customerPhone}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-xl font-semibold hover:bg-muted">
                    <Phone className="w-4 h-4 mr-2 text-heading" />
                    Call Customer
                  </Button>
                </a>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
