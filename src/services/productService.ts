import { productsType } from "../Interface/productsType";
import ProductDetails from "../model/productModel";

interface FilterOptions {
  search: any;
  main_category?: string;
  category?: string;
  subcategory?: string;
  gender?: string;
  color?: string;
  size?: string;
  price_min?: number;
  price_max?: number;
  status?: string;
}

interface QueryOptions {
  filters: FilterOptions;
  page: number;
  limit: number;
  sort_by: string;
  sort_order: string;
}

export async function create_product_service(data: productsType) {
  const existing = await ProductDetails.findOne({
    product_name: data.product_name,
  });
  if (existing) {
    throw new Error("Product already exists");
  }

  return await ProductDetails.create({
    product_gender: data.product_gender,
    product_category: data.product_category,
    sub_category: data.sub_category,
    product_name: data.product_name,
    description: data.description,
    color: data.color,
    size: data.size,
    tags: data.tags,
    price: data.price,
    discount: data.discount,
    quantity: data.quantity,
    product_image: data.product_image,
  });
}

export async function find_existing_product(product_name: string) {
  return await ProductDetails.findOne({ product_name });
}

export async function featured_product_service() {
  return await ProductDetails.find({}).limit(5);
}

export async function get_product_service_with_filters({
  filters,
  page,
  limit,
  sort_by,
  sort_order,
}: QueryOptions): Promise<{ products: productsType[]; total: number }> {
  const query: any = {};

  if (filters.category) query.product_category = filters.category;
  if (filters.subcategory) query.sub_category = filters.subcategory;
  if (filters.gender) query.product_gender = filters.gender;

  if (filters.color) {
    const colors = Array.isArray(filters.color)
      ? filters.color
      : [filters.color];
    query.color = { $in: colors.map((color) => new RegExp(`^${color}$`, "i")) };
  }

  if (filters.size) {
    const sizes = Array.isArray(filters.size) ? filters.size : [filters.size];
    query.size = { $in: sizes.map((size) => new RegExp(`^${size}$`, "i")) };
  }

  if (filters.price_min || filters.price_max) {
    query.price = {};
    if (filters.price_min) query.price.$gte = filters.price_min;
    if (filters.price_max) query.price.$lte = filters.price_max;
  }

  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.trim();
    query.$or = [{ product_name: { $regex: searchTerm, $options: "i" } }];
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    ProductDetails.find(query)
      .sort({ [sort_by]: sort_order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductDetails.countDocuments(query),
  ]);

  const mappedProducts: productsType[] = products.map((product: any) => ({
    product_name: product.product_name ?? "",
    product_category: product.product_category ?? "",
    sub_category: product.sub_category ?? "",
    product_gender: product.product_gender ?? "",
    description: product.description ?? "",
    color: product.color ?? [],
    size: product.size ?? [],
    tags: product.tags ?? [],
    quantity: product.quantity ?? 0,
    price: product.price ?? 0,
    rating: product.rating ?? 0,
    reviews: product.reviews ?? [],
    discount: product.discount ?? 0,
    status: product.status ?? "",
    product_image: product.product_image ?? [],
    _id: product._id?.toString() ?? "",
  }));

  return { products: mappedProducts, total };
}

export async function search_product_service(
  query: string,
  page: number,
  limit: number
) {
  const [products, total] = await Promise.all([
    ProductDetails.find({ product_name: { $regex: query, $options: "i" } })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    ProductDetails.countDocuments({
      product_name: { $regex: query, $options: "i" },
    }),
  ]);
  return { products, total };
}

export async function getOne_product_service(id: string) {
  return await ProductDetails.findOne({ _id: id });
}

export async function getByCategory_service(slug: string) {
  return await ProductDetails.find({ product_category: slug });
}

export async function edit_product_service(
  data: productsType & { id: string }
) {
  const result = await ProductDetails.findByIdAndUpdate(
    data.id,
    {
      product_name: data.product_name,
      product_category: data.product_category,
      sub_category: data.sub_category,
      product_gender: data.product_gender,
      description: data.description,
      color: data.color,
      size: data.size,
      tags: data.tags,
      quantity: data.quantity,
      price: data.price,
      discount: data.discount,
      product_image: data.product_image,
    },
    { new: true }
  );
  if (!result) throw new Error("Product not found");
  return result;
}

export async function delete_product_service(productId: string) {
  const result = await ProductDetails.deleteOne({ _id: productId });
  if (result.deletedCount === 0) throw new Error("Product not found");
  return result;
}
