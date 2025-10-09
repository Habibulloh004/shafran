import React from 'react';
import { Home, Edit2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AddressField = ({ label, value, isDefault, onEdit }) => (
  <Card className="border-border/50 shadow-sm">
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Label className="text-sm font-semibold">{label}</Label>
            {isDefault && (
              <Badge variant="secondary" className="text-xs">
                Основной
              </Badge>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 text-primary hover:bg-primary/10"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative flex items-center">
          <Home className="absolute left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            value={value}
            readOnly
            className="pl-10 bg-background"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AddressesSection() {
  const addresses = [
    {
      label: 'Адрес 1',
      value: 'Яшнабадский рй. улица Ботки...',
      isDefault: true,
    },
    {
      label: 'Адрес 2',
      value: 'Яшнабадский рй. улица Ботки...',
      isDefault: false,
    },
  ];

  const handleEdit = (index) => {
    console.log(`Edit address ${index}`);
  };

  const handleAddNew = () => {
    console.log('Add new address');
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Профиль</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Управляйте адресами доставки
          </p>
        </div>
        <Button onClick={handleAddNew} className="">
          <Plus className="w-4 h-4 mr-2" />
          Добавить адрес
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {addresses.map((address, index) => (
          <AddressField
            key={index}
            {...address}
            onEdit={() => handleEdit(index)}
          />
        ))}
      </div>
    </div>
  );
}