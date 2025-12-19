"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/components/admin/StatsCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    banners: 0,
    users: 0,
    orders: 0,
    todaySales: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ma'lumotlarni yuklash
    const fetchData = async () => {
      try {
        // Bannerlar sonini olish
        const bannersRes = await fetch("/api/banner");
        const bannersData = await bannersRes.json();
        const bannersCount = bannersData?.data?.length || 0;

        setStats({
          banners: bannersCount,
          users: 156, // Demo ma'lumot
          orders: 89, // Demo ma'lumot
          todaySales: "12,450,000", // Demo ma'lumot
        });

        // Demo buyurtmalar
        setRecentOrders([
          { id: 1, customer: "Alisher Karimov", total: "450,000 UZS", status: "pending", date: "Bugun, 14:30" },
          { id: 2, customer: "Madina Rahimova", total: "890,000 UZS", status: "completed", date: "Bugun, 12:15" },
          { id: 3, customer: "Bobur Toshmatov", total: "1,200,000 UZS", status: "processing", date: "Kecha, 18:45" },
          { id: 4, customer: "Nilufar Yusupova", total: "320,000 UZS", status: "completed", date: "Kecha, 16:20" },
        ]);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    completed: "bg-green-500/10 text-green-600 dark:text-green-400",
    cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  const statusLabels = {
    pending: "Kutilmoqda",
    processing: "Jarayonda",
    completed: "Bajarildi",
    cancelled: "Bekor qilindi",
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
          title="Bannerlar"
          value={stats.banners}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Foydalanuvchilar"
          value={stats.users}
          color="green"
          trend="up"
          trendValue="+12%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Buyurtmalar"
          value={stats.orders}
          color="orange"
          trend="up"
          trendValue="+8%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        <StatsCard
          title="Bugungi savdo"
          value={`${stats.todaySales} UZS`}
          color="purple"
          trend="up"
          trendValue="+23%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
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
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">Yangi banner</p>
              <p className="text-sm text-muted-foreground">Banner qo'shish</p>
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
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">Buyurtmalar</p>
              <p className="text-sm text-muted-foreground">Barcha buyurtmalar</p>
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
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">Foydalanuvchilar</p>
              <p className="text-sm text-muted-foreground">Ro'yxatni ko'rish</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">So'nggi buyurtmalar</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            Barchasini ko'rish
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Mijoz</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Summa</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-sm text-foreground">{order.customer}</td>
                  <td className="p-3 text-sm text-foreground font-medium">{order.total}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
