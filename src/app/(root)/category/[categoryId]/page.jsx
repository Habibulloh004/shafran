import CustomBackground from "@/components/shared/customBackground";
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from "@/lib/utils";
import ProductItem from "@/components/shared/productItem";
import SidebarFilter from "@/components/shared/sidebarFilter";
import { getCategoryDetail, getProducts } from "@/lib/api";
import { notFound } from "next/navigation";

const FALLBACK_TITLE = "Категория";
const DEFAULT_PAGINATION = { page: 1, limit: 24 };

const toCsvArray = (value) =>
  typeof value === "string" && value.length > 0
    ? value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

const toNumeric = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default async function CategoryItemPage({ params, searchParams }) {
  const { categoryId } = params;
  let categoryResponse;

  try {
    categoryResponse = await getCategoryDetail(categoryId);
  } catch (error) {
    if (error?.status === 404) {
      notFound();
    }

    throw error;
  }

  const category = categoryResponse?.data || categoryResponse;
  if (!category) {
    notFound();
  }

  const filters = category?.filters || null;
  const section = searchParams?.section || null;
  const gender = searchParams?.gender || category?.gender_audience || null;
  const isUnisexOnly = searchParams?.unisex === "true";

  let productsData = [];
  let pagination = null;

  try {
    const productQuery = {
      page: Number(searchParams?.page) || DEFAULT_PAGINATION.page,
      limit: Number(searchParams?.limit) || DEFAULT_PAGINATION.limit,
      category_id: categoryId,
    };

    const minPrice = toNumeric(searchParams?.price_min);
    const maxPrice = toNumeric(searchParams?.price_max);

    if (typeof minPrice === "number") {
      productQuery.price_min = minPrice;
    }

    if (typeof maxPrice === "number") {
      productQuery.price_max = maxPrice;
    }

    const brandIds = toCsvArray(searchParams?.brand_ids);
    if (brandIds.length > 0) {
      productQuery.brand_ids = brandIds;
    }

    const fragranceNoteIds = toCsvArray(searchParams?.fragrance_note_ids);
    if (fragranceNoteIds.length > 0) {
      productQuery.fragrance_note_ids = fragranceNoteIds;
    }

    const seasonIds = toCsvArray(searchParams?.season_ids);
    if (seasonIds.length > 0) {
      productQuery.season_ids = seasonIds;
    }

    const productTypeIds = toCsvArray(searchParams?.product_type_ids);
    if (productTypeIds.length > 0) {
      productQuery.product_type_ids = productTypeIds;
    }

    if (isUnisexOnly) {
      productQuery.gender_audience = "unisex";
    } else if (gender) {
      productQuery.gender_audience = gender;
    }

    if (searchParams?.search) {
      productQuery.search = searchParams.search;
    }

    const productsResponse = await getProducts(productQuery);
    productsData = productsResponse?.data || [];
    pagination = productsResponse?.pagination || null;
  } catch (error) {
    productsData = [];
    pagination = null;
  }

  const priceFilter = filters?.price || null;
  const selectedFilters = {
    price: {
      min:
        toNumeric(searchParams?.price_min) ??
        priceFilter?.min ??
        null,
      max:
        toNumeric(searchParams?.price_max) ??
        priceFilter?.max ??
        null,
    },
    brand_ids: new Set(toCsvArray(searchParams?.brand_ids)),
    fragrance_note_ids: new Set(toCsvArray(searchParams?.fragrance_note_ids)),
    season_ids: new Set(toCsvArray(searchParams?.season_ids)),
    product_type_ids: new Set(toCsvArray(searchParams?.product_type_ids)),
    unisex: isUnisexOnly,
  };

  return (
    <CustomBackground
      singleImage={gender === "male" ? male : famale}
      className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-12 sm:pt-24 pb-4"
      quality={100}
      type="single"
      classNameImage={cn(
        gender === "male" ? "opacity-20" : "opacity-50 dark:opacity-30"
      )}
      priority
    >
      <div className="pt-4 w-11/12 containerCustom space-y-6">
        <div className="max-xl:flex justify-between items-center">
          <h1 className="text-center text-xl md:text-3xl font-bold font-montserrat-alt">
            {category?.name || FALLBACK_TITLE}
          </h1>
        </div>
        <div className="relative flex gap-6">
          <aside className="max-md:hidden w-64 shrink-0">
            <SidebarFilter
              filters={filters}
              selectedFilters={selectedFilters}
              categoryId={categoryId}
            />
          </aside>

          <main className="flex-1 min-h-screen">
            {productsData.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white/60 dark:bg-black/50 border border-border/50 py-16">
                <p className="text-sm md:text-base text-muted-foreground">
                  Товары не найдены.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {productsData.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    section={section}
                    genderParam={searchParams?.gender || gender}
                    categoryIdOverride={categoryId}
                  />
                ))}
              </div>
            )}

            {pagination?.total_pages > 1 && (
              <div className="mt-8 flex justify-center">
                <p className="text-xs text-muted-foreground">
                  Страница {pagination.current_page} из{" "}
                  {pagination.total_pages}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </CustomBackground>
  );
}
