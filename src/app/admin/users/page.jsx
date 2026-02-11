"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api/client";
import { useTranslation } from "@/i18n";

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ current_page: 1, total_items: 0, items_per_page: 50 });
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const data = await apiGet(`/api/admin/users?${params.toString()}`);
      setUsers(data?.data || []);
      setPagination(data?.pagination || { current_page: 1, total_items: 0, items_per_page: 50 });
    } catch (error) {
      console.error(t("admin.usersLoadError"), error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const formatPrice = (price) => {
    if (price == null) return "0 UZS";
    return new Intl.NumberFormat("uz-UZ").format(price) + " UZS";
  };

  const totalPages = Math.ceil(pagination.total_items / pagination.items_per_page);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t("admin.users")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("admin.totalUsers", { count: pagination.total_items })}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder={t("admin.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            {t("common.search")}
          </Button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.user")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("common.phone")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">{t("admin.orders")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">{t("admin.totalPurchase")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">{t("admin.registered")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {t("admin.userNotFound")}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {(user.first_name || "?")[0]}
                            {(user.last_name || "?")[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.first_name} {user.last_name}
                          </p>
                          {user.display_name && user.display_name !== `${user.first_name} ${user.last_name}` && (
                            <p className="text-sm text-muted-foreground">{user.display_name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground">{user.phone || "-"}</td>
                    <td className="p-4 text-sm text-foreground hidden md:table-cell">
                      <span className="inline-flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        {user.order_count ?? 0}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground hidden lg:table-cell">
                      {formatPrice(user.total_spent)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {new Date(user.created_at).toLocaleDateString("uz-UZ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            {t("common.previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            {t("common.next")}
          </Button>
        </div>
      )}
    </div>
  );
}
