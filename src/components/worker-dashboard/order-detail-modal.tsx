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
} from "lucide-react";
import { MOCK_BOOKINGS } from "@/lib/mock-bookings";
import type { ProviderOrder, OrderStatus } from "@/types/provider";

interface OrderDetailModalProps {
  order: ProviderOrder | any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  const { t } = useLanguage();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>(order?.status || "pending");

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

  const handleAccept = () => {
    // Update in MOCK_BOOKINGS array
    const booking = MOCK_BOOKINGS.find((b) => b.id === order.id);
    if (booking) {
      (booking as any).status = "accepted";
    }
    
    // Update localStorage too
    const stored = JSON.parse(localStorage.getItem("user_bookings") || "[]");
    const storedBooking = stored.find((b: any) => b.id === order.id);
    if (storedBooking) {
      storedBooking.status = "accepted";
      localStorage.setItem("user_bookings", JSON.stringify(stored));
    }
    
    setStatus("accepted");
    setTimeout(() => onClose(), 1000);
  };

  const handleReject = () => {
    // Update in MOCK_BOOKINGS array
    const booking = MOCK_BOOKINGS.find((b) => b.id === order.id);
    if (booking) {
      (booking as any).status = "rejected";
    }
    
    // Update localStorage too
    const stored = JSON.parse(localStorage.getItem("user_bookings") || "[]");
    const storedBooking = stored.find((b: any) => b.id === order.id);
    if (storedBooking) {
      storedBooking.status = "rejected";
      localStorage.setItem("user_bookings", JSON.stringify(stored));
    }
    
    setStatus("rejected");
    setTimeout(() => onClose(), 1000);
  };

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-500 bg-red-50 border-red-200";
      case "rejected":
        return "text-red-500 bg-red-50 border-red-200";
      case "in-progress":
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
    switch (status) {
      case "completed":
        return t.completed;
      case "cancelled":
        return t.cancelled;
      case "rejected":
        return "Rejected";
      case "in-progress":
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

          {/* ── Action Buttons ── */}
          {status === "pending" ? (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAccept}
                variant="tertiary"
                size="sm"
                className="flex-1 rounded-xl"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept Order
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Order
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
                    className="w-full rounded-xl"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate to Customer
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-60" />
                  </Button>
                </a>
              )}
              <a href={`tel:${order.customerPhone}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl"
                >
                  <Phone className="w-4 h-4 mr-2" />
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
