'use client';

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AddAddressModal from './AddAddressModal';
import { adaptServerAddress, useAddressStore } from '@/store/addressStore';
import { syncAddressWithBillz } from '../actions';
import { useUserProfileStore } from '@/store/userProfileStore';

const normalizeLabel = (label) => {
  switch ((label || "").toLowerCase()) {
    case "home":
      return "Дом";
    case "work":
      return "Работа";
    case "other":
      return "Другое";
    default:
      return label || "Адрес";
  }
};

export default function AddressesSection({ addresses = [], profile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSyncing, startTransition] = useTransition();
  const localAddresses = useAddressStore((state) => state.addresses);
  const hydrateFromServer = useAddressStore((state) => state.hydrateFromServer);
  const addAddress = useAddressStore((state) => state.addAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const setProfileAddresses = useUserProfileStore((state) => state.setAddresses);

  useEffect(() => {
    if (addresses?.length) {
      const normalized = addresses
        .map((entry) => adaptServerAddress(entry))
        .filter(Boolean);
      hydrateFromServer(normalized);
    }
  }, [addresses, hydrateFromServer]);

  const resolvedAddresses = useMemo(() => {
    if (localAddresses.length > 0) {
      return localAddresses;
    }
    return (addresses || [])
      .map((entry) => adaptServerAddress(entry))
      .filter(Boolean);
  }, [localAddresses, addresses]);

  useEffect(() => {
    setProfileAddresses(resolvedAddresses);
  }, [resolvedAddresses, setProfileAddresses]);

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const shortenAddress = (value = "") => {
    const trimmed = value.trim();
    if (trimmed.length <= 60) return trimmed || "Не указан";
    return `${trimmed.slice(0, 57)}...`;
  };

  const handleSaveAddress = useCallback(
    async (address) => {
      let entry;
      if (address.id) {
        updateAddress(address.id, {
          ...address,
          label: address.label,
          fullAddress: address.fullAddress,
          latitude: address.latitude,
          longitude: address.longitude,
        });
        entry = { ...address };
      } else if (editingAddress?.id) {
        updateAddress(editingAddress.id, {
          ...editingAddress,
          ...address,
        });
        entry = { ...editingAddress, ...address };
      } else {
        entry = addAddress(address);
      }

      startTransition(async () => {
        try {
          await syncAddressWithBillz(entry);
        } catch (error) {
          console.error("Billz sync failed", error);
        }
      });
      setEditingAddress(null);
    },
    [addAddress, editingAddress, updateAddress]
  );

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Адреса доставки</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Управляйте адресами и быстро выбирайте точку доставки
          </p>
        </div>
        <Button onClick={handleAddNew} className="">
          <Plus className="w-4 h-4 mr-2" />
          {isSyncing ? "Сохраняем..." : "Добавить адрес"}
        </Button>
      </div>

      {resolvedAddresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Вы ещё не добавили адреса доставки.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Название</TableHead>
                <TableHead>Адрес</TableHead>
                <TableHead className="w-24 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resolvedAddresses.map((address, index) => (
                <TableRow key={address.id || index}>
                  <TableCell className="font-semibold">
                    {normalizeLabel(address.label) || `Адрес ${index + 1}`}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {shortenAddress(address.fullAddress || address.value)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(address)}
                      aria-label="Редактировать адрес"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddAddressModal
        open={isModalOpen}
        onOpenChange={(next) => {
          setIsModalOpen(next);
          if (!next) {
            setEditingAddress(null);
          }
        }}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
      />
    </div>
  );
}
