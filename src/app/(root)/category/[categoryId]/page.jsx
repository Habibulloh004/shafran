import CustomBackground from "@/components/shared/customBackground";
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from "@/lib/utils";
import CategoryProductsWithFilters from "@/components/category/CategoryProductsWithFilters";
import { notFound } from "next/navigation";
import { getBillzCategory, getBillzProducts } from "../../../../../actions/get";

export const revalidate = 600;

const FALLBACK_TITLE = "";
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
  // Next.js 15: params va searchParams ni await qilish kerak
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { categoryId } = resolvedParams;

  // Kategoriyani olish
  const category = await getBillzCategory(categoryId);
  if (!category) {
    notFound();
  }

  // Filters obyektini tuzish
  const section = resolvedSearchParams?.section || null;
  const gender = resolvedSearchParams?.gender || category?.gender_audience || null;
  const isUnisexOnly = resolvedSearchParams?.unisex === "true";

  // Product filter parametrlarini tuzish
  const productQuery = {
    page: Number(resolvedSearchParams?.page) || DEFAULT_PAGINATION.page,
    limit: Number(resolvedSearchParams?.limit) || DEFAULT_PAGINATION.limit,
    category_id: categoryId,
  };

  const minPrice = toNumeric(resolvedSearchParams?.price_min);
  const maxPrice = toNumeric(resolvedSearchParams?.price_max);

  if (typeof minPrice === "number") {
    productQuery.price_min = minPrice;
  }

  if (typeof maxPrice === "number") {
    productQuery.price_max = maxPrice;
  }

  const brandIds = toCsvArray(resolvedSearchParams?.brand_ids);
  if (brandIds.length > 0) {
    productQuery.brand_ids = brandIds;
  }

  const fragranceNoteIds = toCsvArray(resolvedSearchParams?.fragrance_note_ids);
  if (fragranceNoteIds.length > 0) {
    productQuery.fragrance_note_ids = fragranceNoteIds;
  }

  const seasonIds = toCsvArray(resolvedSearchParams?.season_ids);
  if (seasonIds.length > 0) {
    productQuery.season_ids = seasonIds;
  }

  const productTypeIds = toCsvArray(resolvedSearchParams?.product_type_ids);
  if (productTypeIds.length > 0) {
    productQuery.product_type_ids = productTypeIds;
  }

  if (isUnisexOnly) {
    productQuery.gender_audience = "unisex";
  } else if (gender) {
    productQuery.gender_audience = gender;
  }

  if (resolvedSearchParams?.search) {
    productQuery.search = resolvedSearchParams.search;
  }

  // Productlarni olish
  const { data: productsData, pagination } = await getBillzProducts(productQuery);

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
        <CategoryProductsWithFilters
          products={productsData}
          section={section}
          genderParam={resolvedSearchParams?.gender || gender}
          categoryId={categoryId}
          pagination={pagination}
        />
      </div>
    </CustomBackground>
  );
}
