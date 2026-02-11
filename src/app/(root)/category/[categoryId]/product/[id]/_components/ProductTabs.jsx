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
import { useTranslation } from "@/i18n";

export default function ProductTabs({ product }) {
  const { t } = useTranslation();

  const genderLabel = (gender) => {
    if (gender === "female") return t("common.female");
    if (gender === "male") return t("common.male");
    if (gender === "unisex" || gender === "uni") return t("common.unisex");
    return gender || "";
  };

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
    if (Array.isArray(product?.specifications) && product.specifications.length) {
      return [...product.specifications]
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((spec) => ({
          label: spec.label,
          value: spec.value,
        }))
        .filter((row) => row.value);
    }

    if (Array.isArray(product?.product_attributes) && product.product_attributes.length) {
      return product.product_attributes.map((attr) => ({
        label: attr.attribute_name,
        value: attr.attribute_value,
      })).filter((row) => row.value);
    }

    if (Array.isArray(product?.custom_fields) && product.custom_fields.length) {
      return product.custom_fields.map((field) => ({
        label: field.custom_field_name || field.cusom_field_name,
        value: field.custom_field_value,
      })).filter((row) => row.value);
    }

    const fallback = [
      { label: t("common.brand"), value: product?.brand?.name || product?.brand_name },
      {
        label: t("common.type"),
        value: product?.product_types
          ?.map((type) => type.name)
          .filter(Boolean)
          .join(", "),
      },
      { label: t("common.releaseYear"), value: product?.release_year },
      {
        label: t("common.gender"),
        value: genderLabel(
          product?.gender_audience || product?.category?.gender_audience
        ),
      },
      {
        label: t("common.country"),
        value: product?.country_of_origin || product?.brand?.country,
      },
      {
        label: t("common.notes"),
        value: product?.fragrance_notes
          ?.map((note) => note.name)
          .filter(Boolean)
          .join(", "),
      },
      {
        label: t("common.seasons"),
        value: product?.seasons
          ?.map((season) => season.name)
          .filter(Boolean)
          .join(", "),
      },
    ].filter((row) => row.value);

    return fallback;
  }, [product, t]);

  const variants = Array.isArray(product?.variants) ? product.variants : [];

  return (
    <div className="w-full">
      <Tabs defaultValue="params" className="w-full">
        <TabsList className="flex gap-4 border-b mb-4 bg-transparent border-none">
          <TabsTrigger
            value="params"
            className="data-[state=active]:bg-transparent  data-[state=active]:text-black text-primary  data-[state=active]:font-bold shadow-none  data-[state=active]:shadow-none dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent"
          >
            {t("common.parameters")}
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-transparent  data-[state=active]:text-black text-primary  data-[state=active]:font-bold shadow-none  data-[state=active]:shadow-none dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent"
          >
            {t("common.description")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="space-y-6">
          <div className="bg-primary/10 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">{t("common.characteristic")}</TableHead>
                  <TableHead>{t("common.value")}</TableHead>
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
                      {t("common.specsComingSoon")}
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
                    <TableHead>{t("common.variant")}</TableHead>
                    <TableHead>{t("common.volume")}</TableHead>
                    <TableHead>{t("common.price")}</TableHead>
                    <TableHead>{t("common.availability")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id || variant.sku}>
                      <TableCell className="font-medium">
                        {variant.label || variant.sku}
                      </TableCell>
                      <TableCell>
                        {variant.volume_ml ? `${variant.volume_ml} ${t("common.ml")}` : "-"}
                      </TableCell>
                      <TableCell>
                        {variant.price
                          ? `${variant.price} ${variant.currency || ""}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {variant.is_active
                          ? `${t("common.inStock")}: ${variant.inventory_quantity ?? 0}`
                          : t("common.unavailable")}
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
              {t("common.descriptionComingSoon")}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
