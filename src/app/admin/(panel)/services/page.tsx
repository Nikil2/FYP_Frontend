"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Power,
  Search,
  Wrench,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  activateService,
  createService,
  deactivateService,
  getAllServices,
  updateService,
} from "@/api/services/admin";
import { cn } from "@/lib/utils";

interface ServiceItem {
  id: number;
  name: string;
  iconUrl?: string;
  categoryId: string;
  categoryName: string;
  categoryIcon?: string;
  isActive: boolean;
}

interface CategoryGroup {
  categoryId: string;
  categoryName: string;
  categoryIcon?: string;
  services: ServiceItem[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIconUrl, setNewIconUrl] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // Expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await getAllServices();
        const data = response.data || response;
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  // Group services by category
  const categories = useMemo(() => {
    const grouped = new Map<string, CategoryGroup>();
    const filtered = search
      ? services.filter(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.categoryName.toLowerCase().includes(search.toLowerCase())
        )
      : services;

    for (const service of filtered) {
      const key = service.categoryId;
      if (!grouped.has(key)) {
        grouped.set(key, {
          categoryId: service.categoryId,
          categoryName: service.categoryName,
          categoryIcon: service.categoryIcon,
          services: [],
        });
      }
      grouped.get(key)!.services.push(service);
    }

    return Array.from(grouped.values()).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );
  }, [services, search]);

  // Unique categories for dropdown
  const uniqueCategories = useMemo(() => {
    const map = new Map<string, { id: string; name: string; icon?: string }>();
    for (const s of services) {
      if (!map.has(s.categoryId)) {
        map.set(s.categoryId, {
          id: s.categoryId,
          name: s.categoryName,
          icon: s.categoryIcon,
        });
      }
    }
    return Array.from(map.values());
  }, [services]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(categories.map((c) => c.categoryId)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim() || !newCategoryId) return;

    const selectedCat = uniqueCategories.find((c) => c.id === newCategoryId);
    if (!selectedCat) return;

    setCreating(true);
    try {
      const response = await createService(
        newName.trim(),
        newIconUrl.trim() || undefined,
        newCategoryId,
        selectedCat.name,
        selectedCat.icon,
      );
      const newService = (response as any).data || response;
      setServices((prev) => [...prev, newService]);
      setNewName("");
      setNewIconUrl("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create service:", error);
    }
    setCreating(false);
  };

  const toggleServiceStatus = async (service: ServiceItem) => {
    try {
      if (service.isActive) {
        await deactivateService(service.id);
      } else {
        await activateService(service.id);
      }
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, isActive: !s.isActive } : s
        )
      );
    } catch (error) {
      console.error("Failed to update service status:", error);
    }
  };

  const startEditing = (service: ServiceItem) => {
    setEditingId(service.id);
    setEditingName(service.name);
  };

  const saveEditing = async () => {
    if (!editingId || !editingName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await updateService(editingId, { name: editingName.trim() });
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...s, name: editingName.trim() } : s
        )
      );
    } catch (error) {
      console.error("Failed to edit service:", error);
    }
    setEditingId(null);
    setEditingName("");
  };

  // Stats
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.isActive).length;
  const totalCategories = uniqueCategories.length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
        <p className="text-heading">Loading services...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Service Categories"
        description="Manage services organized by category. Create, rename, and toggle service availability."
      />

      {/* Stats Row */}
      <section className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="rounded-2xl border-border/70 bg-card/95 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-paragraph">Total Categories</p>
          <p className="text-2xl font-bold text-heading mt-1">{totalCategories}</p>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-paragraph">Total Services</p>
          <p className="text-2xl font-bold text-heading mt-1">{totalServices}</p>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-paragraph">Active Services</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{activeServices}</p>
          <p className="text-xs text-paragraph mt-0.5">{totalServices - activeServices} disabled</p>
        </Card>
      </section>

      {/* Search & Controls */}
      <Card className="rounded-2xl border-border/70 bg-card/95 mb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-paragraph" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services or categories..."
              className="w-full rounded-xl border border-border bg-white pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
            <Button
              size="sm"
              className="bg-[#0d1f1a] text-white hover:bg-[#123128]"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </div>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="rounded-2xl border-emerald-200 bg-emerald-50/50 mb-4">
          <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-600" />
            Add New Service
          </h3>
          <form className="grid gap-3 md:grid-cols-4" onSubmit={handleCreate}>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-paragraph">
                Category
              </label>
              <select
                value={newCategoryId}
                onChange={(e) => setNewCategoryId(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
                required
              >
                <option value="">Select category</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-paragraph">
                Service Name
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. AC Deep Cleaning"
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-paragraph">
                Icon (emoji/URL)
              </label>
              <input
                value={newIconUrl}
                onChange={(e) => setNewIconUrl(e.target.value)}
                placeholder="e.g. ❄️"
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Category Accordion */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <Card className="rounded-2xl border-border/70 bg-card/95 p-8 text-center">
            <FolderOpen className="h-10 w-10 text-paragraph mx-auto mb-2 opacity-40" />
            <p className="text-sm text-paragraph">
              {search ? "No services match your search." : "No services found."}
            </p>
          </Card>
        ) : (
          categories.map((category) => {
            const isExpanded = expandedCategories.has(category.categoryId);
            const activeCount = category.services.filter((s) => s.isActive).length;

            return (
              <Card key={category.categoryId} className="rounded-2xl border-border/70 bg-card/95 p-0 overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.categoryId)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.categoryIcon || "📦"}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-heading">{category.categoryName}</h3>
                      <p className="text-xs text-paragraph">
                        {category.services.length} services • {activeCount} active
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700">
                      {category.services.length}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-paragraph transition-transform" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-paragraph transition-transform" />
                    )}
                  </div>
                </button>

                {/* Expanded Services */}
                {isExpanded && (
                  <div className="border-t border-border/70">
                    {category.services.map((service, idx) => (
                      <div
                        key={service.id}
                        className={cn(
                          "flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors",
                          idx < category.services.length - 1 && "border-b border-border/50"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-base flex-shrink-0">{service.iconUrl || "⚙️"}</span>
                          {editingId === service.id ? (
                            <input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && saveEditing()}
                              className="flex-1 rounded-lg border border-emerald-300 bg-white px-2 py-1 text-sm outline-none focus:border-emerald-400"
                              autoFocus
                            />
                          ) : (
                            <div className="min-w-0">
                              <p className={cn("text-sm font-medium truncate", service.isActive ? "text-heading" : "text-paragraph line-through")}>
                                {service.name}
                              </p>
                              <p className="text-[10px] text-paragraph">ID: #{service.id}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <Badge className={service.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                            {service.isActive ? "Active" : "Disabled"}
                          </Badge>
                          {editingId === service.id ? (
                            <Button size="sm" variant="outline" onClick={saveEditing}>
                              Save
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => startEditing(service)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className={service.isActive ? "text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"}
                            onClick={() => toggleServiceStatus(service)}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
