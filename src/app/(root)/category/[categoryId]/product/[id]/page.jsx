import CustomBackground from "@/components/shared/customBackground";
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from "@/lib/utils";
import ImageGallery from "./_components/ImageGallery";
import ProductTabs from "./_components/ProductTabs";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
import ProductItem from "@/components/shared/productItem";
import ProductDetails from "./_components/ProductDetails";
import { getBillzProduct } from "../../../../../../../actions/get";
import { notFound } from "next/navigation";
import { collectGalleryItems, resolveHeroImage } from "@/lib/media";
import RelatedProductsTitle from "./_components/RelatedProductsTitle";

export const revalidate = 600;

const FALLBACK_MARKETING_IMAGES = [
  "/img/inf1.webp",
  "/img/inf2.webp",
  "/img/inf3.webp",
];

export default async function ProductItemPage({ params, searchParams }) {
  const { id, categoryId } = await params;
  const searchParamsResolved = await searchParams;

  const product = await getBillzProduct(id);

  if (!product) {
    notFound();
  }

  const gender =
    searchParamsResolved?.gender ||
    product.gender_audience ||
    product.category?.gender_audience ||
    null;

  const highlights = Array.isArray(product.highlights)
    ? product.highlights
    : [];

  const tickerTexts = highlights
    .filter((item) => item?.type === "text_ticker")
    .map((item) => item.text)
    .filter(Boolean);

  const marketingMedia =
    product.media?.marketing?.map((media) => media.url).filter(Boolean) || [];

  const relatedProducts =
    product.related_products?.products?.map((related) => ({
      ...related,
      category:
        related.category ||
        related.categories?.[0] ||
        product.category ||
        product.categories?.[0] ||
        null,
      category_id:
        related.category_id ||
        related.category?.id ||
        related.categories?.[0]?.id ||
        product.category?.id ||
        product.categories?.[0]?.id ||
        categoryId,
      gender_audience:
        related.gender_audience ||
        related.gender ||
        product.gender_audience ||
        gender,
      price:
        related.price && typeof related.price === "object"
          ? related.price
          : related.price
          ? { amount: related.price, currency: related.currency || product.currency }
          : undefined,
      base_price:
        related.base_price ??
        (typeof related.price === "number" ? related.price : undefined) ??
        related?.shop_prices?.[0]?.retail_price,
      shop_prices: related.shop_prices || product.shop_prices,
    })) || [];

  const gallery = collectGalleryItems(product);
  const heroImage = resolveHeroImage(product, gallery);

  const marketingImages =
    marketingMedia.length > 0 ? marketingMedia : FALLBACK_MARKETING_IMAGES;

  return (
    <CustomBackground
      singleImage={gender === "male" ? male : famale}
      className="relative font-montserrat w-full md:min-h-screen flex flex-col sm:gap-4 pt-12 sm:pt-24 pb-4"
      quality={100}
      type="single"
      classNameImage={cn(
        gender === "male" ? "opacity-20" : "opacity-50 dark:opacity-30"
      )}
      priority
    >
      <main className="w-full space-y-5 pt-4">
        <section className="w-11/12 mx-auto containerCustom flex justify-between gap-5">
          <ProductDetails
            product={product}
            heroImageOverride={heroImage}
            galleryOverride={gallery}
          />
          <div className="max-xl:hidden w-10/12">
            <ImageGallery
              heroImage={heroImage}
              gallery={gallery}
              productName={product.name}
            />
          </div>
        </section>

        <section className="containerCustom w-11/12">
          <ProductTabs product={product} />
        </section>

        <section>
          {tickerTexts.length > 0 && (
            <div className="bg-primary/15 max-sm:text-xs overflow-hidden">
              <Marquee className="[--duration:100s]">
                {tickerTexts.map((text, index) => (
                  <h1 key={index} className="px-4">
                    {text}
                  </h1>
                ))}
              </Marquee>
            </div>
          )}
          {marketingImages.length > 0 && (
            <div className="bg-primary/15 max-sm:text-xs overflow-hidden">
              <Marquee reverse className="[--duration:100s] gap-0 p-0">
                <div className="flex">
                  {marketingImages.map((image, index) => (
                    <div
                      key={index}
                      className="w-[300px] h-[200px] md:w-[500px] md:h-[300px] relative"
                    >
                      <Image
                        src={image}
                        alt={`marketing-${index}`}
                        className="object-cover"
                        fill
                      />
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          )}
        </section>

        {relatedProducts.length > 0 && (
          <section className="containerCustom w-11/12 pt-10 space-y-4">
            <h1 className="text-center text-xl md:text-3xl font-bold">
              <RelatedProductsTitle fallback={product.related_products?.title} />
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {relatedProducts.map((related) => (
                <ProductItem
                  key={related.id}
                  product={related}
                  section={searchParamsResolved?.section}
                  genderParam={searchParamsResolved?.gender || gender}
                  categoryIdOverride={related.category_id || categoryId}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </CustomBackground>
  );
}
