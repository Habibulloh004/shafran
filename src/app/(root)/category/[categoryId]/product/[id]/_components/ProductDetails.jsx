import { Button } from "@/components/ui/button";
import { Price } from "@/lib/functions";
import Image from "next/image";
import ImageGallery from "./ImageGallery";
import { collectGalleryItems, resolveHeroImage } from "@/lib/media";
import AddToCartButton from "./AddToCartButton";

const genderLabel = (gender) => {
  if (gender === "female") return "Женский";
  if (gender === "male") return "Мужской";
  if (gender === "unisex" || gender === "uni") return "Унисекс";
  return gender || "";
};

export default function ProductDetails({
  product,
  heroImageOverride,
  galleryOverride,
}) {
  const primaryVariant = product?.variants?.[0];
  const gallery = galleryOverride ?? collectGalleryItems(product);
  const heroImage = heroImageOverride ?? resolveHeroImage(product, gallery);

  const priceAmount =
    primaryVariant?.price ??
    product?.base_price ??
    product?.price?.amount ??
    product?.shop_prices?.[0]?.retail_price ??
    0;
  const currency =
    primaryVariant?.currency ||
    product?.price?.currency ||
    product?.currency ||
    product?.shop_prices?.[0]?.retail_currency ||
    "USD";

  const description =
    product?.long_description ||
    product?.short_description ||
    product?.description ||
    "";

  const infoRows = [
    {
      label: "Тестер",
      value:
        typeof product?.is_tester_available === "boolean"
          ? product.is_tester_available
            ? "Да"
            : "Нет"
          : null,
    },
    { label: "Производитель", value: product?.manufacturer },
    { label: "Бренд", value: product?.brand?.name },
    { label: "Семейство", value: product?.fragrance_family },
    { label: "Группа ароматов", value: product?.fragrance_group },
    {
      label: "Пол",
      value: genderLabel(product?.gender_audience || product?.category?.gender),
    },
    { label: "Состав", value: product?.composition_notes },
    { label: "Страна производства", value: product?.country_of_origin },
  ].filter((item) => item.value);

  return (
    <div className="flex flex-col justify-end items-end gap-4 w-full">
      <div className="xl:hidden w-full justify-center items-center gap-10 flex flex-col">
        <ImageGallery
          heroImage={heroImage}
          gallery={gallery}
          productName={product?.name}
        />
        <div className="flex flex-col gap-3 justify-center items-center w-full sm:flex-row xl:flex-col">
        <AddToCartButton
          product={product}
          variant={primaryVariant}
          className="rounded-xl h-10 md:h-12 w-full sm:w-40 md:w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"
        />
          <Button
            type="button"
            className="rounded-xl h-10 md:h-12 w-full sm:w-40 md:w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"
          >
            Купить в 1 клик
          </Button>
          <Button
            type="button"
            className="rounded-xl h-10 md:h-12 w-full sm:w-40 md:w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"
          >
            Распив
          </Button>
        </div>
      </div>

      <div className="w-full md:w-11/12 xl:w-10/12 mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">
            {product?.name || product?.slug || "Без названия"}
          </h1>
          {primaryVariant?.label && (
            <span className="text-primary text-xs md:text-sm mt-1 inline-block">
              {primaryVariant.label}
            </span>
          )}
        </div>
        <Price amount={priceAmount} currency={currency} />
      </div>

      {description && (
        <div className="flex justify-between items-center gap-2 w-full">
          <p className="text-xs md:text-md w-full md:w-10/12 xl:w-8/12 mx-auto text-foreground/80 line-clamp-6">
            {description}
          </p>
          {gallery.length > 0 && (
            <div className="w-full md:hidden flex justify-end items-end">
              <div className="grid grid-cols-3 gap-[2px]">
                {gallery.slice(0, 6).map((image) => (
                  <div
                    key={image.id}
                    className="rounded-[10px] w-10 h-10 relative overflow-hidden"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt_text || product?.name || "product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-full md:w-11/12 xl:w-9/12 flex justify-between items-start gap-6 flex-col md:flex-row">
        <div className="w-full mt-4 md:mt-6 text-xs md:text-sm space-y-2">
          {infoRows.map((row) => (
            <p key={row.label}>
              <b>{row.label}:</b> {row.value}
            </p>
          ))}
        </div>
        <div className="max-md:hidden flex flex-col gap-3 justify-center items-center">
          <AddToCartButton
            product={product}
            variant={primaryVariant}
            className="w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"
          />
          <Button
            type="button"
            className="w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"
          >
            Купить в 1 клик
          </Button>
          <Button
            type="button"
            className="w-48 bg-white text-primary hover:text-primary hover:bg-white/70 cursor-pointer dark:bg-primary dark:text-white dark:hover:bg-primary/70"
          >
            Распив
          </Button>
        </div>
      </div>
      {gallery.length > 0 && (
        <div className="max-md:hidden w-10/12 mx-auto flex justify-start items-start">
          <div className="grid grid-cols-3 gap-[2px]">
            {gallery.slice(0, 6).map((image) => (
              <div
                key={image.id}
                className="rounded-[10px] w-10 h-10 relative overflow-hidden"
              >
                <Image
                  src={image.url}
                  alt={image.alt_text || product?.name || "product"}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
