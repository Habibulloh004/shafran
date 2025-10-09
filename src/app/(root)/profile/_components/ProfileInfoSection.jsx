import React from 'react';
import { User, Phone, Home, Lock, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const InputField = ({ icon: Icon, label, value, type = 'text', onEdit }) => (
  <div className="space-y-2">
    <Label htmlFor={label} className="text-sm font-medium">
      {label}
    </Label>
    <div className="relative flex items-center">
      <Icon className="absolute left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
      <Input
        id={label}
        type={type}
        value={value}
        readOnly
        className="pl-10 pr-12 bg-background"
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-1 h-8 w-8 text-primary hover:bg-primary/10"
        onClick={onEdit}
      >
        <Edit2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default function ProfileInfoSection() {
  const handleEdit = (field) => {
    console.log(`Edit ${field}`);
  };

  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Профиль</h2>
        <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
          Управляйте своей персональной информацией
        </p>
      </div>
      
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 space-y-1">
          <CardTitle className="text-base sm:text-lg">Личная информация</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Обновите свои личные данные
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <InputField
              icon={User}
              label="Имя"
              value="Имя фамилия"
              onEdit={() => handleEdit('name')}
            />
            <InputField
              icon={Phone}
              label="Номер телефона"
              value="+998 99 999-99-99"
              onEdit={() => handleEdit('phone')}
            />
            <div className="sm:col-span-2">
              <InputField
                icon={Home}
                label="Адрес"
                value="Яшнабадский рй. улица Ботки..."
                onEdit={() => handleEdit('address')}
              />
            </div>
            <InputField
              icon={Lock}
              label="Пароль"
              value="••••••••••••"
              type="password"
              onEdit={() => handleEdit('password')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}