const FALLBACK_IMAGE = "/img/res1.webp";

const normalizeImageEntry = (entry, index = 0) => {
  if (!entry) return null;

  if (typeof entry === "string") {
    return {
      id: `image-${index}`,
      url: entry,
    };
  }

  const url =
    entry.url ||
    entry.image_url ||
    entry.image ||
    entry.full_url ||
    entry.path ||
    entry.src ||
    entry.main_image_url_full ||
    entry.main_image_url ||
    null;

  if (!url) return null;

  return {
    id: entry.id || entry.media_id || `image-${index}`,
    url,
    alt_text: entry.alt_text || entry.alt || entry.caption || null,
  };
};

export const collectGalleryItems = (product) => {
  const gallerySources = [
    ...(product?.media?.gallery || []),
    ...(product?.gallery_images || []),
    ...(product?.images || []),
    ...(product?.media?.marketing || []),
  ];

  return gallerySources
    .map((entry, index) => normalizeImageEntry(entry, index))
    .filter(Boolean);
};

export const resolveHeroImage = (product, gallery = []) => {
  const candidates = [
    product?.media?.hero_image,
    product?.main_image_url_full,
    product?.main_image_url,
    product?.hero_image,
    product?.thumbnail_image,
    product?.card_image,
    gallery[0]?.url,
  ];

  return (
    candidates.find((url) => typeof url === "string" && url.length > 0) ||
    FALLBACK_IMAGE
  );
};

export { FALLBACK_IMAGE };
