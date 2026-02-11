"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGet } from "@/lib/api/client";
import { useTranslation } from "@/i18n";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shipped: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function OrdersPage() {
  const { t } = useTranslation();

  const statusOptions = [
    { value: "all", label: t("admin.all") },
    { value: "pending", label: t("admin.pending") },
    { value: "processing", label: t("admin.processing") },
    { value: "shipped", label: t("admin.shipped") },
    { value: "delivered", label: t("admin.delivered") },
    { value: "cancelled", label: t("admin.cancelled") },
  ];

  const statusLabels = {
    pending: t("admin.pending"),
    processing: t("admin.processing"),
    shipped: t("admin.shipped"),
    delivered: t("admin.delivered"),
    cancelled: t("admin.cancelled"),
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ current_page: 1, total_items: 0, items_per_page: 50 });
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const data = await apiGet(`/api/admin/orders?${params.toString()}`);
      const ordersList = data?.data || [];
      setPagination(data?.pagination || { current_page: 1, total_items: 0, items_per_page: 50 });
      setOrders(ordersList);
    } catch (error) {
      console.error(t("admin.ordersLoadError"), error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price == null) return "0 UZS";
    return new Intl.NumberFormat("uz-UZ").format(price) + " UZS";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("uz-UZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const totalPages = Math.ceil(pagination.total_items / pagination.items_per_page);

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t("admin.orders")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("admin.totalOrders", { count: pagination.total_items })}
          </p>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
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
              placeholder={t("admin.orderNumber")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("common.status")} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" variant="outline" size="sm">
            {t("common.search")}
          </Button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.order")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("admin.customer")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">{t("admin.products")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("common.amount")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">{t("admin.paymentCol")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t("common.status")}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">{t("common.date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {t("admin.orderNotFound")}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <span className="font-medium text-foreground">{order.order_number}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {order.user
                            ? `${order.user.first_name} ${order.user.last_name}`
                            : t("common.unknown")}
                        </p>
                        <p className="text-sm text-muted-foreground">{order.user?.phone || "-"}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground hidden md:table-cell">
                      {order.items?.length || 0} {t("common.items")}
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="p-4 text-sm text-foreground hidden lg:table-cell">
                      {order.payment_method || "-"}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || ""}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {formatDate(order.placed_at)}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">{t("admin.pending")}</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">{t("admin.processing")}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {orders.filter((o) => o.status === "processing").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">{t("admin.delivered")}</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {orders.filter((o) => o.status === "delivered").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">{t("admin.cancelled")}</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {orders.filter((o) => o.status === "cancelled").length}
          </p>
        </div>
      </div>
    </div>
  );
}
