'use client';

import React from 'react';
import { Gift, TrendingUp, TrendingDown, Coins } from 'lucide-react';
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
import { useTranslation } from "@/i18n";

export default function BonusSection({ balance = 0, transactions = [] }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t("profile.profile")}</h2>
        <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
          {t("profile.bonusHistory")}
        </p>
      </div>

      {/* Compact Balance Card */}
      <Card className="p-0 border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10" />

        <CardContent className="p-4 sm:p-6 relative z-10">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium text-white/90">
              {t("profile.availableBalance")}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {balance.toLocaleString()}
            </span>
            <span className="text-base sm:text-lg font-semibold text-white/90">{t("common.sum")}</span>
          </div>
          <p className="text-xs text-white/80">{t("profile.purchaseBonuses")}</p>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            {t("profile.transactionHistory")}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {t("profile.allBonusOperations")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">{t("common.date")}</TableHead>
                  <TableHead className="font-semibold">{t("common.amount")}</TableHead>
                  <TableHead className="font-semibold">{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      {t("profile.noBonusOperations")}
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction, index) => {
                    const isPositive = transaction.type === 'earned';
                    const Icon = isPositive ? TrendingUp : TrendingDown;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-4 h-4 ${
                                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}
                            />
                            <span
                              className={`font-semibold ${
                                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {isPositive ? '+' : '-'} {transaction.amount} {t("common.sum")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isPositive ? 'success' : 'destructive'}
                            className="font-medium"
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">
                {t("profile.noBonusOperations")}
              </p>
            ) : (
              transactions.map((transaction, index) => {
                const isPositive = transaction.type === 'earned';
                const Icon = isPositive ? TrendingUp : TrendingDown;

                return (
                  <div key={index} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{transaction.id}</span>
                      <Badge
                        variant={isPositive ? 'success' : 'destructive'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{transaction.date}</span>
                      <div className="flex items-center gap-1.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        />
                        <span
                          className={`font-semibold ${
                            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {isPositive ? '+' : '-'} {transaction.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
