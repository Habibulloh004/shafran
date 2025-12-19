import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const formatOrderAmount = (order) => {
  if (!order) return null;
  const amount =
    order?.total_amount ||
    order?.total?.amount ||
    order?.subtotal ||
    order?.total?.total_amount ||
    0;
  return Number(amount).toLocaleString();
};

const formatOrderDate = (order) => {
  const dateString = order?.placed_at || order?.created_at || order?.date;
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatOrderTime = (order) => {
  const dateString = order?.placed_at || order?.created_at || order?.date;
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [errorState, setErrorState] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        return;
      }

      setErrorState(null);
      setLoadingState(true);
      try {
        const response = await fetch('/api/profile/orders', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || 'Не удалось загрузить заказы.');
        }

        const rawOrders = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.orders)
            ? payload.orders
            : [];

        setOrders(rawOrders);
      } catch (fetchError) {
        console.error('[OrdersSection] Failed to load orders', fetchError);
        setOrders([]);
        setErrorState(fetchError?.message || 'Не удалось загрузить заказы.');
      } finally {
        setLoadingState(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const orderItems = selectedOrder?.items || selectedOrder?.products || [];
  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Профиль</h2>
        <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
          История ваших заказов
        </p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Мои заказы
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Отслеживайте статус ваших заказов
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {errorState ? (
            <p className="text-sm text-destructive px-6 py-4">{errorState}</p>
          ) : loadingState ? (
            <p className="text-sm text-muted-foreground px-6 py-4">
              Загружаем заказы...
            </p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-10">
              Вы ещё не оформляли заказы.
            </p>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">Номер заказа</TableHead>
                      <TableHead className="font-semibold">Дата</TableHead>
                      <TableHead className="font-semibold">Время</TableHead>
                      <TableHead className="font-semibold">Сумма</TableHead>
                      <TableHead className="font-semibold">Оплата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order?.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-900 transition-colors"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDialogOpen(true);
                        }}
                      >
                        <TableCell className="font-medium">
                          {order?.order_number || order?.orderNumber || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatOrderDate(order)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatOrderTime(order)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatOrderAmount(order)}{" "}
                          {order?.currency || order?.total?.currency || ""}
                        </TableCell>
                        <TableCell className="text-muted-foreground uppercase">
                          {(order?.payment_method || order?.paymentMethod || "—").toString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden divide-y divide-border">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 space-y-3 cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        {order?.order_number || order?.orderNumber || "—"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">Дата:</span>
                        <p className="font-medium">{formatOrderDate(order)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Время:</span>
                        <p className="font-medium">{formatOrderTime(order)}</p>
                      </div>
                    </div>
                    <div className="grid text-sm">
                      <div className="text-right">
                        <span className="text-muted-foreground text-xs">Сумма:</span>
                        <p className="font-semibold">{formatOrderAmount(order) || "—"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground text-xs">Оплата:</span>
                        <p className="font-semibold uppercase">
                          {(order?.payment_method || order?.paymentMethod || "—").toString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>
              Заказ {selectedOrder?.order_number || selectedOrder?.orderNumber || "—"}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.status ? `Статус: ${selectedOrder.status}` : "Детали заказа"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {orderItems.length > 0 ? (
              <div className="space-y-2">
                {orderItems.map((item, index) => (
                  <div
                    key={`${selectedOrder?.id || "order"}-${item?.id || item?.product_id || index}`}
                    className="flex justify-between items-center border border-border rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {item?.product_name || item?.name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item?.variant_label || item?.variant || ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {(item?.line_total || item?.unit_price || 0).toLocaleString()} {selectedOrder?.currency || item?.currency || "UZS"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item?.quantity || 1} шт.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Товары не найдены.</p>
            )}
            <section className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Дата</p>
                <p className="font-semibold">{formatOrderDate(selectedOrder)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Сумма</p>
                <p className="font-semibold">
                  {formatOrderAmount(selectedOrder) || "0"} {selectedOrder?.currency || selectedOrder?.total?.currency || "UZS"}
                </p>
              </div>
            </section>
            <section className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Время</p>
                <p className="font-semibold">{formatOrderTime(selectedOrder)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Оплата</p>
                <p className="font-semibold uppercase">
                  {(selectedOrder?.payment_method || selectedOrder?.paymentMethod || "—").toString()}
                </p>
              </div>
            </section>
            {selectedOrder?.notes && (
              <section>
                <p className="text-muted-foreground text-xs">Примечание</p>
                <p className="font-semibold">{selectedOrder.notes}</p>
              </section>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => handleDialogChange(false)}>
                Закрыть
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
