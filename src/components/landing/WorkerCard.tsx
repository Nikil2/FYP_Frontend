import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Worker } from "@/interfaces/landing-interfaces";
import { Star, MapPin, MessageSquare, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkerCardProps {
  worker: Worker;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Avatar with Online Status */}
        <div className="relative w-20 h-20 mx-auto bg-[#7EA13C]/10 rounded-full">
          <Avatar
            src={worker.profileImage}
            alt={worker.name}
            size="xl"
            className="w-full h-full"
          />
          {worker.isOnline && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-600 border-2 border-card rounded-full" />
          )}
        </div>

        {/* Worker Info */}
        <div className="text-center space-y-2">
          <div className="flex-center gap-2">
            <h3 className="text-lg font-semibold text-heading">
              {worker.name}
            </h3>
            {worker.verified && (
              <BadgeCheck className="w-5 h-5 text-tertiary flex-shrink-0" />
            )}
          </div>

          <Badge variant="tertiary" className="text-xs">
            {worker.skill}
          </Badge>
        </div>

        {/* Rating */}
        <div className="flex-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(worker.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted",
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-heading">
            {worker.rating}
          </span>
          <span className="text-sm text-paragraph">({worker.reviewCount})</span>
        </div>

        {/* Distance */}
        <div className="flex items-center justify-center gap-1 text-sm text-paragraph">
          <MapPin className="w-4 h-4" />
          <span>{worker.distance} km away</span>
        </div>

        {/* Visiting Fee */}
        <div className="text-center py-3 bg-secondary-background rounded-lg">
          <div className="text-sm text-paragraph">Visiting Fee</div>
          <div className="text-2xl font-bold text-tertiary">
            Rs. {worker.visitingFee}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/worker/${worker.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </Link>
          <Link href={`/worker/${worker.id}`} className="flex-1">
            <Button variant="tertiary" size="sm" className="w-full">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
