import React from 'react';
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
import { Badge } from '@/components/ui/badge';

export default function OrdersSection() {
  const orders = [
    { id: '#7473567', date: '2025/10/12', price: '$399', status: 'delivered' },
    { id: '#7473568', date: '2025/10/12', price: '$599', status: 'delivered' },
    { id: '#7473569', date: '2025/10/10', price: '$299', status: 'processing' },
    { id: '#7473570', date: '2025/10/08', price: '$149', status: 'cancelled' },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return { label: 'Доставлен', variant: 'success' };
      case 'processing':
        return { label: 'В обработке', variant: 'default' };
      case 'cancelled':
        return { label: 'Отменен', variant: 'destructive' };
      default:
        return { label: 'Неизвестно', variant: 'secondary' };
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
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Номер заказа</TableHead>
                  <TableHead className="font-semibold">Дата</TableHead>
                  <TableHead className="font-semibold">Сумма</TableHead>
                  <TableHead className="font-semibold">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="text-muted-foreground">{order.date}</TableCell>
                      <TableCell className="font-semibold">{order.price}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className="font-medium">
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <div key={index} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{order.id}</span>
                    <Badge variant={statusConfig.variant} className="text-xs">
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">Дата:</span>
                      <p className="font-medium">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground text-xs">Сумма:</span>
                      <p className="font-semibold">{order.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}