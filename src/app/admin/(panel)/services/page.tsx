"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Power } from "lucide-react";
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
import type { ServiceCategory } from "@/api/services/admin";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await getAllServices();
        setServices(response.data);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      const response = await createService(name.trim(), iconUrl.trim() || undefined);
      setServices((prev) => [response.data, ...prev]);
      setName("");
      setIconUrl("");
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  const toggleServiceStatus = async (service: ServiceCategory) => {
    try {
      if (service.isActive) {
        await deactivateService(service.id);
      } else {
        await activateService(service.id);
      }

      setServices((prev) =>
        prev.map((entry) =>
          entry.id === service.id ? { ...entry, isActive: !entry.isActive } : entry,
        ),
      );
    } catch (error) {
      console.error("Failed to update service status:", error);
    }
  };

  const startEditing = (service: ServiceCategory) => {
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
        prev.map((service) =>
          service.id === editingId ? { ...service, name: editingName.trim() } : service,
        ),
      );
    } catch (error) {
      console.error("Failed to edit service:", error);
    }

    setEditingId(null);
    setEditingName("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-heading">Loading services...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Service Categories"
        description="Create, rename, and activate or deactivate service categories for the marketplace."
      />

      <Card className="rounded-2xl border-border/70 bg-card/95">
        <form className="grid gap-3 md:grid-cols-5" onSubmit={handleCreate}>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
              Service Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Solar Maintenance"
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
              Icon URL (Optional)
            </label>
            <input
              value={iconUrl}
              onChange={(event) => setIconUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-[#0d1f1a] text-white hover:bg-[#123128]">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-4 rounded-2xl border-border/70 bg-card/95 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-[0.12em] text-paragraph">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Icon</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-border/70 text-sm">
                  <td className="px-4 py-3 text-paragraph">#{service.id}</td>
                  <td className="px-4 py-3 font-medium text-heading">
                    {editingId === service.id ? (
                      <input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="w-full rounded-lg border border-border bg-white px-2 py-1 text-sm outline-none focus:border-emerald-400"
                      />
                    ) : (
                      service.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-paragraph">{service.iconUrl || "-"}</td>
                  <td className="px-4 py-3">
                    <Badge className={service.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                      {service.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {editingId === service.id ? (
                        <Button size="sm" variant="outline" onClick={saveEditing}>
                          Save
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEditing(service)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className={service.isActive ? "text-red-700" : "text-emerald-700"}
                        onClick={() => toggleServiceStatus(service)}
                      >
                        <Power className="h-4 w-4" />
                        {service.isActive ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
