"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/components/admin/StatsCard";
import { apiGet } from "@/lib/api/client";
import { useTranslation } from "@/i18n";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          apiGet("/api/admin/stats"),
          apiGet("/api/admin/recent-orders"),
        ]);

        setStats(statsRes?.data || null);
        setRecentOrders(recentRes?.data || []);
      } catch (error) {
        console.error(t("admin.dataLoadError"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => {
    if (price == null) return "0";
    return new Intl.NumberFormat("uz-UZ").format(price);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();

      const time = date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
      if (isToday) return `${t("common.today")}, ${time}`;
      if (isYesterday) return `${t("common.yesterday")}, ${time}`;
      return date.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" }) + `, ${time}`;
    } catch {
      return dateStr;
    }
  };

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    completed: "bg-green-500/10 text-green-600 dark:text-green-400",
    delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
    cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  const statusLabels = {
    pending: t("admin.pending"),
    processing: t("admin.processing"),
    completed: t("admin.completed"),
    delivered: t("admin.delivered"),
    cancelled: t("admin.cancelled"),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t("admin.banners")}
          value={stats?.total_banners ?? 0}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          title={t("admin.users")}
          value={stats?.total_users ?? 0}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title={t("admin.orders")}
          value={stats?.total_orders ?? 0}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        <StatsCard
          title={t("admin.todaySales")}
          value={`${formatPrice(stats?.today_revenue ?? 0)} UZS`}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Revenue Summary */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground">{t("admin.totalRevenue")}</p>
        <p className="text-2xl font-bold text-foreground">{formatPrice(stats?.total_revenue ?? 0)} UZS</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/banners"
          className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">{t("admin.newBanner")}</p>
              <p className="text-sm text-muted-foreground">{t("admin.addBanner")}</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">{t("admin.orders")}</p>
              <p className="text-sm text-muted-foreground">{t("admin.allOrders")}</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">{t("admin.users")}</p>
              <p className="text-sm text-muted-foreground">{t("admin.viewList")}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Orders by Status */}
      {stats?.orders_by_status && Object.keys(stats.orders_by_status).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.orders_by_status).map(([status, count]) => (
            <div key={status} className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground">{statusLabels[status] || status}</p>
              <p className={`text-2xl font-bold ${statusColors[status]?.split(" ").slice(1).join(" ") || "text-foreground"}`}>
                {count}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">{t("admin.recentOrders")}</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            {t("admin.viewAll")}
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("admin.noOrdersYet")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t("admin.customer")}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t("common.amount")}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t("common.status")}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t("common.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-sm text-foreground">
                      {order.user
                        ? `${order.user.first_name} ${order.user.last_name}`
                        : t("common.unknown")}
                    </td>
                    <td className="p-3 text-sm text-foreground font-medium">
                      {formatPrice(order.total_amount)} {order.currency || "UZS"}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || ""}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{formatDate(order.placed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
