"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, ShieldCheck, ShieldX } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllUsers, blockUser, unblockUser } from "@/api/services/admin";
import type { UserProfile } from "@/api/services/admin";

type RoleFilter = "ALL" | "CUSTOMER" | "WORKER" | "ADMIN";
type StatusFilter = "ALL" | "ACTIVE" | "BLOCKED";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await getAllUsers(1, 100);
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const handleToggleBlock = async (id: string, currentBlocked: boolean) => {
    try {
      if (currentBlocked) {
        await unblockUser(id);
      } else {
        await blockUser(id);
      }
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                isBlocked: !currentBlocked,
              }
            : user,
        ),
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery =
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.phoneNumber.includes(query) ||
        user.id.toLowerCase().includes(query.toLowerCase());

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "BLOCKED" ? user.isBlocked : !user.isBlocked);

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-heading">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="User Management"
        description="Review platform users, inspect verification state, and block or unblock accounts from one table."
        action={<Badge className="bg-emerald-100 text-emerald-700">{filteredUsers.length} users</Badge>}
      />

      <Card className="rounded-2xl border-border/70 bg-card/95 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
              Search by name, phone or ID
            </label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search users..."
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            >
              <option value="ALL">All roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="WORKER">Worker</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-paragraph">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
            >
              <option value="ALL">All status</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden rounded-2xl border-border/70 bg-card/95 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-[0.12em] text-paragraph">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-paragraph">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/70 text-sm">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-heading">{user.fullName}</p>
                      <p className="text-xs text-paragraph">{user.phoneNumber} • {user.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          user.role === "ADMIN"
                            ? "bg-emerald-100 text-emerald-700"
                            : user.role === "WORKER"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-stone-100 text-stone-700"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <ShieldCheck className="h-4 w-4" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700">
                          <Filter className="h-4 w-4" /> No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={user.isBlocked ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-paragraph">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className={user.isBlocked ? "text-emerald-700" : "text-red-700"}
                        onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                      >
                        {user.isBlocked ? (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <ShieldX className="h-4 w-4" />
                            Block
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
