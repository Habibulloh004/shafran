"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ProductItem from "@/components/shared/productItem";
import SidebarFilter from "@/components/shared/sidebarFilter";
import { useTranslation } from "@/i18n";

const PRICE_STEP_FALLBACK = 50000;
const PARAMETER_GROUP_LIMIT = 4;
const PARAMETER_VALUE_LIMIT = 10;

const normalizeKey = (value) =>
  typeof value === "string"
    ? value.trim().toLowerCase()
    : typeof value === "number"
    ? String(value)
    : "";

const slugify = (value) =>
  value
    ? value
        .toLowerCase()
        .replace(/[^a-z0-9а-яё]+/gi, "-")
        .replace(/^-+|-+$/g, "")
    : "";

const splitValueString = (value) => {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => splitValueString(item))
      .flat()
      .filter(Boolean);
  }

  const normalized = String(value)
    .replace(/\r/g, " ")
    .split(/[,;•/]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return normalized;
};

const getProductPrice = (product) => {
  return (
    product?.price?.amount ??
    product?.base_price ??
    product?.shop_prices?.[0]?.retail_price ??
    0
  );
};

const buildParameterGroups = (products) => {
  const buckets = new Map();

  products.forEach((product) => {
    const fields = [
      ...(Array.isArray(product?.product_attributes)
        ? product.product_attributes
        : []),
      ...(Array.isArray(product?.custom_fields) ? product.custom_fields : []),
    ];

    fields.forEach((field) => {
      const rawName =
        field?.attribute_name ||
        field?.custom_field_name ||
        field?.custom_field_system_name;
      const rawValue = field?.attribute_value || field?.custom_field_value;
      const normalizedName = normalizeKey(rawName);

      if (!normalizedName || !rawValue) {
        return;
      }

      if (!buckets.has(normalizedName)) {
        buckets.set(normalizedName, {
          key: normalizedName,
          label: rawName?.toString().trim() || normalizedName,
          values: new Set(),
        });
      }

      const bucket = buckets.get(normalizedName);
      splitValueString(rawValue).forEach((valuePart) =>
        bucket.values.add(valuePart)
      );
    });
  });

  const groups = Array.from(buckets.values())
    .map((bucket) => ({
      id: slugify(bucket.label) || slugify(bucket.key),
      key: bucket.key,
      label: bucket.label,
      values: Array.from(bucket.values)
        .sort((a, b) => a.localeCompare(b))
        .slice(0, PARAMETER_VALUE_LIMIT),
    }))
    .filter((group) => group.id && group.values.length > 0)
    .sort((a, b) => b.values.length - a.values.length)
    .slice(0, PARAMETER_GROUP_LIMIT);

  const keyToGroupId = new Map(groups.map((group) => [group.key, group.id]));

  return { groups, keyToGroupId };
};

const buildProductParameterValues = (products, keyToGroupId) => {
  const map = new Map();

  if (!keyToGroupId.size) {
    products.forEach((product) => map.set(product, {}));
    return map;
  }

  products.forEach((product) => {
    const valueMap = {};
    const fields = [
      ...(Array.isArray(product?.product_attributes)
        ? product.product_attributes
        : []),
      ...(Array.isArray(product?.custom_fields) ? product.custom_fields : []),
    ];

    fields.forEach((field) => {
      const rawName =
        field?.attribute_name ||
        field?.custom_field_name ||
        field?.custom_field_system_name;
      const rawValue = field?.attribute_value || field?.custom_field_value;
      const normalizedName = normalizeKey(rawName);

      if (!normalizedName || !rawValue) {
        return;
      }

      const groupId = keyToGroupId.get(normalizedName);
      if (!groupId) {
        return;
      }

      const values = splitValueString(rawValue);
      if (!values.length) {
        return;
      }

      if (!valueMap[groupId]) {
        valueMap[groupId] = new Set();
      }

      values.forEach((value) => valueMap[groupId].add(value));
    });

    map.set(product, valueMap);
  });

  return map;
};

const buildPriceFilter = (products) => {
  const rawPrices = products
    .map((product) => getProductPrice(product))
    .filter((price) => typeof price === "number" && price >= 0);

  const min = rawPrices.length ? Math.min(...rawPrices) : 0;
  const max = rawPrices.length ? Math.max(...rawPrices) : 0;
  const boundedMin = Math.min(min, max);
  const boundedMax = Math.max(max, boundedMin);
  const delta = boundedMax - boundedMin;

  return {
    min: boundedMin,
    max: boundedMax || boundedMin + PRICE_STEP_FALLBACK,
    step:
      delta > 0 ? Math.max(Math.round(delta / 40), PRICE_STEP_FALLBACK) : PRICE_STEP_FALLBACK,
  };
};

export default function CategoryProductsWithFilters({
  products,
  section,
  genderParam,
  categoryId,
  pagination,
}) {
  const { t } = useTranslation();
  const priceFilter = useMemo(() => buildPriceFilter(products), [products]);
  const [selectedPrice, setSelectedPrice] = useState([
    priceFilter.min,
    priceFilter.max,
  ]);
  const brandOptions = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const brandId =
        product?.brand_id || product?.brand?.id || product?.brand_id;
      const name =
        product?.brand_name ||
        product?.brand?.name ||
        product?.brand?.description ||
        "";
      if (brandId && name) {
        map.set(brandId, { id: brandId, name });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [products]);

  const { groups: parameterGroups, keyToGroupId } = useMemo(
    () => buildParameterGroups(products),
    [products]
  );

  const productParameterValues = useMemo(
    () => buildProductParameterValues(products, keyToGroupId),
    [products, keyToGroupId]
  );

  const [selectedBrands, setSelectedBrands] = useState(() => new Set());
  const [selectedParameters, setSelectedParameters] = useState({});

  useEffect(() => {
    setSelectedPrice([priceFilter.min, priceFilter.max]);
  }, [priceFilter.min, priceFilter.max]);

  useEffect(() => {
    setSelectedBrands(new Set());
  }, [brandOptions]);

  useEffect(() => {
    setSelectedParameters((previous) => {
      const next = {};
      parameterGroups.forEach((group) => {
        next[group.id] = new Set(previous[group.id] ?? []);
      });
      return next;
    });
  }, [parameterGroups]);

  const handlePriceChange = useCallback((range) => {
    setSelectedPrice(range);
  }, []);

  const handleBrandToggle = useCallback((brandId) => {
    setSelectedBrands((previous) => {
      const next = new Set(previous);
      if (next.has(brandId)) {
        next.delete(brandId);
      } else {
        next.add(brandId);
      }
      return next;
    });
  }, []);

  const handleParameterToggle = useCallback((groupId, value) => {
    setSelectedParameters((previous) => {
      const next = { ...previous };
      const currentSet = new Set(previous[groupId] ?? []);
      if (currentSet.has(value)) {
        currentSet.delete(value);
      } else {
        currentSet.add(value);
      }
      next[groupId] = currentSet;
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedPrice([priceFilter.min, priceFilter.max]);
    setSelectedBrands(new Set());
    setSelectedParameters((previous) => {
      const next = {};
      parameterGroups.forEach((group) => {
        next[group.id] = new Set();
      });
      return next;
    });
  }, [priceFilter.min, priceFilter.max, parameterGroups]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = getProductPrice(product);
      const withinPrice =
        typeof price === "number" &&
        price >= selectedPrice[0] &&
        price <= selectedPrice[1];
      if (!withinPrice) {
        return false;
      }

      if (selectedBrands.size > 0) {
        const brandId =
          product?.brand_id || product?.brand?.id || product?.brand_id;
        if (!brandId || !selectedBrands.has(brandId)) {
          return false;
        }
      }

      if (parameterGroups.length > 0) {
        const productValues = productParameterValues.get(product) ?? {};
        for (const group of parameterGroups) {
          const selections = selectedParameters[group.id];
          if (selections && selections.size > 0) {
            const availableValues = productValues[group.id];
            if (!availableValues) {
              return false;
            }
            const matches = Array.from(selections).some((value) =>
              availableValues.has(value)
            );
            if (!matches) {
              return false;
            }
          }
        }
      }

      return true;
    });
  }, [
    products,
    selectedPrice,
    selectedBrands,
    selectedParameters,
    parameterGroups,
    productParameterValues,
  ]);

  const filters = useMemo(
    () => ({
      price: priceFilter,
      brands: brandOptions,
      parameters: parameterGroups,
    }),
    [priceFilter, brandOptions, parameterGroups]
  );

  const selectedFilters = useMemo(
    () => ({
      price: selectedPrice,
      brands: selectedBrands,
      parameters: selectedParameters,
    }),
    [selectedPrice, selectedBrands, selectedParameters]
  );

  return (
    <div className="relative flex gap-6">
      <aside className="max-md:hidden w-64 shrink-0">
        <SidebarFilter
          filters={filters}
          selectedFilters={selectedFilters}
          onPriceChange={handlePriceChange}
          onBrandToggle={handleBrandToggle}
          onParameterToggle={handleParameterToggle}
          onClear={clearFilters}
        />
      </aside>

      <main className="flex-1 min-h-screen">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/60 dark:bg-black/50 border border-border/50 py-16">
            <p className="text-sm md:text-base text-muted-foreground">
              {t("common.productsNotFound")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredProducts.map((product) => (
              <ProductItem
                key={product.id ?? product.sku}
                product={product}
                section={section}
                genderParam={genderParam}
                categoryIdOverride={categoryId}
              />
            ))}
          </div>
        )}

        {pagination?.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <p className="text-xs text-muted-foreground">
              {t("common.page")} {pagination.current_page} {t("common.of")} {pagination.total_pages}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
