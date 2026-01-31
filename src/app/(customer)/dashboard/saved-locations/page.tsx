"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trash2, Edit2, Plus } from "lucide-react";
import { getSavedLocations } from "@/lib/mock-bookings";

export default function SavedLocationsPage() {
  const savedLocations = useMemo(() => getSavedLocations(), []);
  const [locations, setLocations] = useState(savedLocations);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setLocations(
      locations.map((loc) => ({
        ...loc,
        isDefault: loc.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading mb-1">Saved Locations</h1>
          <p className="text-paragraph">
            Manage your favorite addresses for quick booking
          </p>
        </div>
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Add/Edit Location Form */}
      {(isAddingNew || editingId) && (
        <Card className="p-6 bg-secondary-background">
          <h2 className="text-xl font-bold text-heading mb-4">
            {isAddingNew ? "Add New Location" : "Edit Location"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAddingNew(false);
              setEditingId(null);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Location Name
              </label>
              <input
                type="text"
                placeholder="e.g., Home, Office, Parents' House"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-paragraph placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary"
                defaultValue={locations.find((l) => l.id === editingId)?.name || ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Address
              </label>
              <textarea
                placeholder="Enter your complete address"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-paragraph placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
                rows={3}
                defaultValue={locations.find((l) => l.id === editingId)?.address || ""}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="tertiary" className="flex-1">
                {isAddingNew ? "Add Location" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <Card key={location.id} className="p-6 relative">
            {location.isDefault && (
              <Badge variant="tertiary" className="absolute top-4 right-4">
                Default
              </Badge>
            )}

            <div className="pr-16">
              {/* Location Info */}
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-tertiary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-heading text-lg mb-1">
                    {location.name}
                  </h3>
                  <p className="text-sm text-paragraph break-words">
                    {location.address}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                {!location.isDefault && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSetDefault(location.id)}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditingId(location.id);
                    setIsAddingNew(false);
                  }}
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(location.id)}
                  disabled={location.isDefault}
                  className="flex-1"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {locations.length === 0 && !isAddingNew && (
        <Card className="p-12 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-heading mb-2">
            No Saved Locations
          </h2>
          <p className="text-paragraph mb-6">
            Add your favorite locations for faster booking
          </p>
          <Button variant="tertiary" onClick={() => setIsAddingNew(true)}>
            Add Your First Location
          </Button>
        </Card>
      )}
    </div>
  );
}
