import StoreModel from "../model/storeModel";

export const get_store_config_service = async () => {
  let store = await StoreModel.findOne();
  if (!store) {
    store = await StoreModel.create({ isSetup: false, categories: [] });
  }
  return store;
};

export const update_store_config_service = async (data: any) => {
  let store = await StoreModel.findOne();
  if (!store) {
    store = new StoreModel(data);
  } else {
    store.isSetup = data.isSetup;
    store.categories = data.categories;
  }
  await store.save();
  return store;
};

export const get_navigation_menu_service = async () => {
  const store = await StoreModel.findOne();
  if (!store) return [];

  const genders = ["Men", "Women"];
  const menu = genders.map((gender) => {
    const sections = store.categories
      .map((category: any) => {
        const genderGroup = category.genderGroups.find(
          (g: any) => g.name === gender
        );

        if (genderGroup && genderGroup.subCategories.length > 0) {
          return {
            title: category.name,
            items: genderGroup.subCategories.map((sub: any) => ({
              name: sub.name,
              href: `/shop?gender=${gender}&category=${encodeURIComponent(
                category.name
              )}&subcategory=${encodeURIComponent(sub.name)}`,
            })),
          };
        }
        return null;
      })
      .filter(Boolean);

    return {
      gender,
      sections,
      promo: {
        title: "Latest Offers",
        subtitle: `25% Off on ${gender}'s Collection`,
        ctaText: "Shop Now",
        ctaLink: `/shop?category=${gender}`,
        imageColor: gender === "Men" ? "bg-blue-100" : "bg-pink-100",
      },
    };
  });

  return menu;
};
