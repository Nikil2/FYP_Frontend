import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallbackColor?: string;
}

const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
];

export function Avatar({
  src,
  alt,
  className,
  size = "md",
  fallbackColor,
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-xl",
    xl: "w-20 h-20 text-2xl",
  };

  // Generate consistent color based on name if not provided
  const getColor = (name: string) => {
    if (fallbackColor) return fallbackColor;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  };

  const bgColor = getColor(alt);

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center overflow-hidden flex-shrink-0",
        sizeClasses[size],
        !src && bgColor,
        !src && "text-white font-bold",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
