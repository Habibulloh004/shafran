"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";

const genderLabel = (gender) => {
  if (gender === "female") return "Женский";
  if (gender === "male") return "Мужской";
  if (gender === "unisex" || gender === "uni") return "Унисекс";
  return gender || "";
};

export default function ProductTabs({ product }) {
  const descriptionBlocks = useMemo(() => {
    if (Array.isArray(product?.description_blocks) && product.description_blocks.length) {
      return [...product.description_blocks]
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((block) => block.content)
        .filter(Boolean);
    }

    if (product?.long_description) {
      return product.long_description.split(/\n{2,}/).filter(Boolean);
    }

    if (product?.short_description) {
      return [product.short_description];
    }

    return [];
  }, [product]);

  const specRows = useMemo(() => {
    // 1. specifications massividan (agar mavjud bo'lsa)
    if (Array.isArray(product?.specifications) && product.specifications.length) {
      return [...product.specifications]
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((spec) => ({
          label: spec.label,
          value: spec.value,
        }))
        .filter((row) => row.value);
    }

    // 2. product_attributes massividan (API format - doc/product_info.md ga qarab)
    if (Array.isArray(product?.product_attributes) && product.product_attributes.length) {
      return product.product_attributes.map((attr) => ({
        label: attr.attribute_name,
        value: attr.attribute_value,
      })).filter((row) => row.value);
    }

    // 3. custom_fields massividan
    if (Array.isArray(product?.custom_fields) && product.custom_fields.length) {
      return product.custom_fields.map((field) => ({
        label: field.custom_field_name || field.cusom_field_name,
        value: field.custom_field_value,
      })).filter((row) => row.value);
    }

    // 4. Fallback - mavjud maydonlardan xarakteristikalar
    const fallback = [
      { label: "Бренд", value: product?.brand?.name || product?.brand_name },
      {
        label: "Тип",
        value: product?.product_types
          ?.map((type) => type.name)
          .filter(Boolean)
          .join(", "),
      },
      { label: "Год выпуска", value: product?.release_year },
      {
        label: "Пол",
        value: genderLabel(
          product?.gender_audience || product?.category?.gender_audience
        ),
      },
      {
        label: "Страна",
        value: product?.country_of_origin || product?.brand?.country,
      },
      {
        label: "Ноты",
        value: product?.fragrance_notes
          ?.map((note) => note.name)
          .filter(Boolean)
          .join(", "),
      },
      {
        label: "Сезоны",
        value: product?.seasons
          ?.map((season) => season.name)
          .filter(Boolean)
          .join(", "),
      },
    ].filter((row) => row.value);

    return fallback;
  }, [product]);

  const variants = Array.isArray(product?.variants) ? product.variants : [];

  return (
    <div className="w-full">
      <Tabs defaultValue="params" className="w-full">
        <TabsList className="flex gap-4 border-b mb-4 bg-transparent border-none">
          <TabsTrigger
            value="params"
            className="data-[state=active]:bg-transparent  data-[state=active]:text-black text-primary  data-[state=active]:font-bold shadow-none  data-[state=active]:shadow-none dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent"
          >
            ПАРАМЕТРЫ
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-transparent  data-[state=active]:text-black text-primary  data-[state=active]:font-bold shadow-none  data-[state=active]:shadow-none dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent"
          >
            ОПИСАНИЕ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="space-y-6">
          <div className="bg-primary/10 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Характеристика</TableHead>
                  <TableHead>Значение</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specRows.length ? (
                  specRows.map((row) => (
                    <TableRow key={`${row.label}-${row.value}`}>
                      <TableCell className="font-medium">{row.label}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Характеристики будут добавлены позже.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {variants.length > 0 && (
            <div className="bg-primary/10 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Вариант</TableHead>
                    <TableHead>Объем</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Наличие</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id || variant.sku}>
                      <TableCell className="font-medium">
                        {variant.label || variant.sku}
                      </TableCell>
                      <TableCell>
                        {variant.volume_ml ? `${variant.volume_ml} мл` : "-"}
                      </TableCell>
                      <TableCell>
                        {variant.price
                          ? `${variant.price} ${variant.currency || ""}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {variant.is_active
                          ? `На складе: ${variant.inventory_quantity ?? 0}`
                          : "Недоступно"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="description"
          className="space-y-4 text-xs md:text-sm leading-relaxed"
        >
          {descriptionBlocks.length ? (
            descriptionBlocks.map((block, index) => (
              <p key={index}>{block}</p>
            ))
          ) : (
            <p className="text-muted-foreground">
              Подробное описание появится позднее.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
