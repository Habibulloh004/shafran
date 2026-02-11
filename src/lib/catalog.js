const SECTION_DEFINITIONS = [
  {
    key: "flowers",
    title: "Цветы",
    matchers: [/flower/i, /bouquet/i, /цвет/i, /букет/i, /rose/i],
  },
  {
    key: "perfumes",
    title: "Парфюмерия",
    matchers: [/perfume/i, /parfum/i, /аромат/i, /дух/i, /парф/i, /fragrance/i],
  },
];

const toStringId = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  return String(value);
};

const flattenCategories = (categories = [], parentId = null, bucket = []) => {
  categories.forEach((category) => {
    if (!category) return;

    const id = toStringId(category.id ?? category.category_id);
    if (!id) return;

    bucket.push({
      ...category,
      id,
      parent_id: toStringId(
        category.parent_id ??
          category.parentId ??
          category.parent_category_id ??
          category.parent?.id ??
          parentId
      ),
    });

    if (Array.isArray(category.subRows) && category.subRows.length > 0) {
      flattenCategories(category.subRows, id, bucket);
    }
  });

  return bucket;
};

export function buildCategoryTree(categories = []) {
  const flatCategories = flattenCategories(categories);
  const categoryMap = new Map();

  flatCategories.forEach((category) => {
    const normalized = {
      id: toStringId(category.id),
      name: category.name ?? "",
      slug: category.slug ?? "",
      description: category.description ?? "",
      subtitle: category.subtitle ?? "",
      gender_audience: category.gender_audience ?? category.gender ?? null,
      parent_id: category.parent_id ? toStringId(category.parent_id) : null,
      card_image:
        category.card_image ??
        category.hero_image_light ??
        category.hero_image_dark ??
        null,
      hero_image_light: category.hero_image_light ?? null,
      hero_image_dark: category.hero_image_dark ?? null,
      data: category,
      children: [],
    };

    if (normalized.id) {
      categoryMap.set(normalized.id, normalized);
    }
  });

  const roots = [];

  categoryMap.forEach((category) => {
    if (category.parent_id && categoryMap.has(category.parent_id)) {
      categoryMap.get(category.parent_id).children.push(category);
    } else {
      roots.push(category);
    }
  });

  return roots;
}

const resolveSectionKey = (category) => {
  if (!category) {
    return null;
  }

  const haystack = `${category.slug || ""} ${category.name || ""}`.toLowerCase();

  const matchedSection = SECTION_DEFINITIONS.find(({ matchers }) =>
    matchers.some((matcher) => matcher.test(haystack))
  );

  return matchedSection?.key ?? null;
};

export function deriveCategorySections(categories = []) {
  const tree = buildCategoryTree(categories);

  const sections = SECTION_DEFINITIONS.map((section) => ({
    ...section,
    categories: [],
  }));

  const sectionByKey = sections.reduce((acc, section) => {
    acc[section.key] = section;
    return acc;
  }, {});

  tree.forEach((category) => {
    const key = resolveSectionKey(category) || "perfumes";
    if (sectionByKey[key]) {
      sectionByKey[key].categories.push(category);
    }
  });

  return sections;
}

export function extractLeafCategories(section) {
  if (!section) return [];

  const leaves = [];
  const stack = [...(section.categories || [])];

  while (stack.length) {
    const node = stack.shift();
    if (!node) continue;

    if (node.children && node.children.length > 0) {
      stack.push(...node.children);
    } else {
      leaves.push(node);
    }
  }

  return leaves;
}

export const SECTION_KEYS = SECTION_DEFINITIONS.reduce((acc, section) => {
  acc[section.key.toUpperCase()] = section.key;
  return acc;
}, {});

export const SECTION_METADATA = SECTION_DEFINITIONS;
