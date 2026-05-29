import Link from "next/link";
import { ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";

// Map category IDs to icons
const CATEGORY_ICONS: Record<string, keyof typeof Icons> = {
  "electrician": "Zap",
  "plumber": "Droplet",
  "carpenter": "Hammer",
  "painter": "Palette",
  "ac_technician": "Snowflake",
  "mason": "Grid",
  "mechanic": "Settings",
  "home_cleaner": "Sparkles",
  "tailoring": "Scissors",
  "car_care": "Car",
  "home_construction": "HardHat",
  "pest_control": "Bug",
};

interface CategoryItem {
  id: string;
  name: string;
  description: string;
}

interface ServiceCategoriesProps {
  categories: CategoryItem[];
}

export function ServiceCategories({ categories }: ServiceCategoriesProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No service categories available
      </div>
    );
  }

  return (
    <div className="py-3 px-4 md:px-6">
      <h2 className="text-lg font-bold text-heading mb-4">Mehnati Services</h2>

      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {categories.map((category) => {
          const iconName = CATEGORY_ICONS[category.id] || "Wrench";
          const Icon = Icons[iconName] as React.ComponentType<{
            className?: string;
          }>;

          return (
            <Link
              key={category.id}
              href={`/customer/category/${category.id}`}
              className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md hover:border-tertiary/30 transition-all group"
            >
              {/* Category Icon */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-tertiary/10 to-tertiary/5 flex items-center justify-center flex-shrink-0 group-hover:from-tertiary/20 group-hover:to-tertiary/10 transition-colors">
                {Icon ? (
                  <Icon className="w-8 h-8 text-tertiary" />
                ) : (
                  <span className="text-2xl">🔧</span>
                )}
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-heading group-hover:text-tertiary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {category.description}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-tertiary transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
