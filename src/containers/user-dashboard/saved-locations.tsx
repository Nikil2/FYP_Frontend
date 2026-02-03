"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trash2, Edit2, Plus } from "lucide-react";
import { getSavedLocations } from "@/lib/mock-bookings";

function SavedLocations() {
  const savedLocations = useMemo(() => getSavedLocations(), []);
  const [locations, setLocations] = useState(savedLocations);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ==================== HANDLERS ==================== */
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
      {/* ==================== PAGE HEADER ==================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-heading">Saved Locations</h1>
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
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* ==================== ADD/EDIT LOCATION FORM ==================== */}
      {(isAddingNew || editingId) && (
        <Card className="bg-secondary-background p-6">
          <h2 className="mb-4 text-xl font-bold text-heading">
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
            {/* Location Name Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Location Name
              </label>
              <input
                type="text"
                placeholder="e.g., Home, Office, Parents' House"
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-paragraph placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary"
                defaultValue={locations.find((l) => l.id === editingId)?.name || ""}
              />
            </div>

            {/* Address Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Address
              </label>
              <textarea
                placeholder="Enter your complete address"
                className="w-full resize-none rounded-lg border border-border bg-card px-4 py-2 text-paragraph placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary"
                rows={3}
                defaultValue={locations.find((l) => l.id === editingId)?.address || ""}
              />
            </div>

            {/* Form Actions */}
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

      {/* ==================== LOCATIONS GRID ==================== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {locations.map((location) => (
          <Card key={location.id} className="relative p-6">
            {/* Default Badge */}
            {location.isDefault && (
              <Badge variant="tertiary" className="absolute right-4 top-4">
                Default
              </Badge>
            )}

            <div className="pr-16">
              {/* ==================== LOCATION INFO ==================== */}
              <div className="mb-4 flex items-start gap-3">
                <MapPin className="mt-0.5 h-6 w-6 flex-shrink-0 text-tertiary" />
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-lg font-bold text-heading">
                    {location.name}
                  </h3>
                  <p className="break-words text-sm text-paragraph">
                    {location.address}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* ==================== ACTION BUTTONS ==================== */}
              <div className="flex items-center gap-2 border-t border-border pt-4">
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
                  <Edit2 className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(location.id)}
                  disabled={location.isDefault}
                  className="flex-1"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ==================== EMPTY STATE ==================== */}
      {locations.length === 0 && !isAddingNew && (
        <Card className="p-12 text-center">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <h2 className="mb-2 text-xl font-bold text-heading">
            No Saved Locations
          </h2>
          <p className="mb-6 text-paragraph">
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

export default SavedLocations;
