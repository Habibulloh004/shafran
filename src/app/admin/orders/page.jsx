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
import { getData } from "../../../../actions/get";

const statusOptions = [
  { value: "all", label: "Barchasi" },
  { value: "pending", label: "Kutilmoqda" },
  { value: "processing", label: "Jarayonda" },
  { value: "shipped", label: "Yo'lda" },
  { value: "delivered", label: "Yetkazildi" },
  { value: "cancelled", label: "Bekor qilindi" },
];

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shipped: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const statusLabels = {
  pending: "Kutilmoqda",
  processing: "Jarayonda",
  shipped: "Yo'lda",
  delivered: "Yetkazildi",
  cancelled: "Bekor qilindi",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Buyurtmalarni Server Action orqali yuklash
  const fetchOrders = async () => {
    try {
      // Backend API dan buyurtmalarni olish
      const data = await getData({
        endpoint: "/api/orders/",
        tag: "orders",
        revalidate: 0
      });
      console.log("Buyurtmalar yuklandi:", data);
      // API dan kelgan ma'lumotlarni formatlash
      const ordersList = data?.data || data || [];
      const formattedOrders = ordersList.map((order) => ({
        id: order.id || `ORD-${String(order.uuid || "").slice(0, 6)}`,
        customer: order.user?.display_name || order.customer_name || "Noma'lum",
        phone: order.user?.phone || order.phone || "-",
        items: order.items?.length || order.items_count || 0,
        total: formatPrice(order.total_amount || order.total || 0),
        status: order.status || "pending",
        payment: order.payment_method || "Noma'lum",
        date: formatDate(order.created_at || order.createdAt),
      }));
      setOrders(formattedOrders.length > 0 ? formattedOrders : getDemoOrders());
    } catch (error) {
      console.error("Buyurtmalarni yuklashda xatolik:", error);
      // Xatolik bo'lsa demo ma'lumotlarni ko'rsatamiz
      setOrders(getDemoOrders());
    } finally {
      setLoading(false);
    }
  };

  // Narxni formatlash
  const formatPrice = (price) => {
    if (typeof price === "string") return price;
    return new Intl.NumberFormat("uz-UZ").format(price) + " UZS";
  };

  // Sanani formatlash
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

  // Demo ma'lumotlar (API ishlamagan holat uchun)
  const getDemoOrders = () => [
    {
      id: "ORD-001",
      customer: "Alisher Karimov",
      phone: "+998 90 123 45 67",
      items: 3,
      total: "450,000 UZS",
      status: "pending",
      payment: "Naqd",
      date: "2024-12-13 14:30",
    },
    {
      id: "ORD-002",
      customer: "Madina Rahimova",
      phone: "+998 91 234 56 78",
      items: 5,
      total: "890,000 UZS",
      status: "delivered",
      payment: "Karta",
      date: "2024-12-13 12:15",
    },
    {
      id: "ORD-003",
      customer: "Bobur Toshmatov",
      phone: "+998 93 345 67 89",
      items: 2,
      total: "1,200,000 UZS",
      status: "processing",
      payment: "Payme",
      date: "2024-12-12 18:45",
    },
    {
      id: "ORD-004",
      customer: "Nilufar Yusupova",
      phone: "+998 94 456 78 90",
      items: 1,
      total: "320,000 UZS",
      status: "shipped",
      payment: "Naqd",
      date: "2024-12-12 16:20",
    },
    {
      id: "ORD-005",
      customer: "Sardor Abdullayev",
      phone: "+998 95 567 89 01",
      items: 4,
      total: "650,000 UZS",
      status: "cancelled",
      payment: "Karta",
      date: "2024-12-11 10:00",
    },
    {
      id: "ORD-006",
      customer: "Aziza Mahmudova",
      phone: "+998 97 678 90 12",
      items: 2,
      total: "780,000 UZS",
      status: "delivered",
      payment: "Payme",
      date: "2024-12-10 15:30",
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
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
          <h2 className="text-xl font-semibold text-foreground">Buyurtmalar</h2>
          <p className="text-sm text-muted-foreground">
            Jami {orders.length} ta buyurtma
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
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
              placeholder="ID, mijoz yoki telefon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Buyurtma
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Mijoz
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Mahsulotlar
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Summa
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  To'lov
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Sana
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Buyurtma topilmadi
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <span className="font-medium text-foreground">{order.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.phone}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground hidden md:table-cell">
                      {order.items} ta
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground">
                      {order.total}
                    </td>
                    <td className="p-4 text-sm text-foreground hidden lg:table-cell">
                      {order.payment}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {order.date}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Kutilmoqda</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Jarayonda</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {orders.filter((o) => o.status === "processing").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Yetkazildi</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {orders.filter((o) => o.status === "delivered").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Bekor qilindi</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {orders.filter((o) => o.status === "cancelled").length}
          </p>
        </div>
      </div>
    </div>
  );
}
