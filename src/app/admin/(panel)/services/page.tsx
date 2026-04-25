"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Power } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AdminServiceCategory,
  serviceCategoriesSeed,
} from "@/lib/admin-mock-data";

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminServiceCategory[]>(serviceCategoriesSeed);
  const [name, setName] = useState("");
  const [nameUrdu, setNameUrdu] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !nameUrdu.trim()) {
      return;
    }

    const nextId = Math.max(...services.map((service) => service.id)) + 1;

    setServices((prev) => [
      {
        id: nextId,
        name: name.trim(),
        nameUrdu: nameUrdu.trim(),
        isActive: true,
        workersCount: 0,
      },
      ...prev,
    ]);

    setName("");
    setNameUrdu("");
  };

  const toggleServiceStatus = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, isActive: !service.isActive } : service,
      ),
    );
  };

  const startEditing = (service: AdminServiceCategory) => {
    setEditingId(service.id);
    setEditingName(service.name);
  };

  const saveEditing = () => {
    if (!editingId || !editingName.trim()) {
      setEditingId(null);
      return;
    }

    setServices((prev) =>
      prev.map((service) =>
        service.id === editingId ? { ...service, name: editingName.trim() } : service,
      ),
    );
    setEditingId(null);
    setEditingName("");
  };

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
              Service Name (English)
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
              Service Name (Urdu)
            </label>
            <input
              value={nameUrdu}
              onChange={(event) => setNameUrdu(event.target.value)}
              placeholder="اردو نام"
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
                <th className="px-4 py-3">Urdu</th>
                <th className="px-4 py-3">Workers</th>
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
                  <td className="px-4 py-3 text-paragraph">{service.nameUrdu}</td>
                  <td className="px-4 py-3 text-paragraph">{service.workersCount}</td>
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
                        onClick={() => toggleServiceStatus(service.id)}
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
