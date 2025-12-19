"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Foydalanuvchilarni local API proxy orqali yuklash (Billz token kerak)
  const fetchUsers = async () => {
    try {
      // Billz API orqali foydalanuvchilar ro'yxatini olish (local proxy ishlatamiz)
      const response = await fetch("/api/billz/v1/client");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Foydalanuvchilar yuklandi:", data);
      // API dan kelgan ma'lumotlarni formatlash
      const clientsList = data?.clients || data?.data || data || [];
      const formattedUsers = clientsList.map((user) => ({
        id: user.id || user.uuid,
        first_name: user.first_name || user.firstName || user.name?.split(" ")[0] || "Noma'lum",
        last_name: user.last_name || user.lastName || user.name?.split(" ")[1] || "",
        phone: user.phone || user.phone_number || "-",
        email: user.email || "-",
        orders_count: user.orders_count || user.ordersCount || 0,
        total_spent: user.total_spent || user.totalSpent || "0 UZS",
        created_at: user.created_at || user.createdAt || new Date().toISOString(),
      }));
      setUsers(formattedUsers.length > 0 ? formattedUsers : getDemoUsers());
    } catch (error) {
      console.error("Foydalanuvchilarni yuklashda xatolik:", error);
      // Xatolik bo'lsa demo ma'lumotlarni ko'rsatamiz
      setUsers(getDemoUsers());
    } finally {
      setLoading(false);
    }
  };

  // Demo ma'lumotlar (API ishlamagan holat uchun)
  const getDemoUsers = () => [
    {
      id: "1",
      first_name: "Alisher",
      last_name: "Karimov",
      phone: "+998 90 123 45 67",
      email: "alisher@email.com",
      orders_count: 5,
      total_spent: "2,450,000 UZS",
      created_at: "2024-01-15",
    },
    {
      id: "2",
      first_name: "Madina",
      last_name: "Rahimova",
      phone: "+998 91 234 56 78",
      email: "madina@email.com",
      orders_count: 12,
      total_spent: "8,900,000 UZS",
      created_at: "2024-02-20",
    },
    {
      id: "3",
      first_name: "Bobur",
      last_name: "Toshmatov",
      phone: "+998 93 345 67 89",
      email: "bobur@email.com",
      orders_count: 3,
      total_spent: "1,200,000 UZS",
      created_at: "2024-03-10",
    },
    {
      id: "4",
      first_name: "Nilufar",
      last_name: "Yusupova",
      phone: "+998 94 456 78 90",
      email: "nilufar@email.com",
      orders_count: 8,
      total_spent: "4,320,000 UZS",
      created_at: "2024-04-05",
    },
    {
      id: "5",
      first_name: "Sardor",
      last_name: "Abdullayev",
      phone: "+998 95 567 89 01",
      email: "sardor@email.com",
      orders_count: 2,
      total_spent: "650,000 UZS",
      created_at: "2024-05-12",
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      user.phone.includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Foydalanuvchilar</h2>
          <p className="text-sm text-muted-foreground">
            Jami {users.length} ta foydalanuvchi
          </p>
        </div>

        {/* Search */}
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
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Foydalanuvchi
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Telefon
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Buyurtmalar
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Jami xarid
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Ro'yxatdan o'tgan
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Foydalanuvchi topilmadi
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {user.first_name[0]}
                            {user.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground">{user.phone}</td>
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
                        {user.orders_count}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground hidden lg:table-cell">
                      {user.total_spent}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {new Date(user.created_at).toLocaleDateString("uz-UZ")}
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
    </div>
  );
}
