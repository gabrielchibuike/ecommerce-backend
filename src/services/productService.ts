import { productsType } from "../Interface/productsType";
import ProductDetails from "../model/productModel";
import adminProductDetails from "../model/productModel";

interface FilterOptions {
  search: any;
  main_category?: string;
  product_category?: string;
  sub_category?: string;
  manufacturer_brand?: string;
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

export async function create_product_service({
  product_name,
  product_category,
  sub_category,
  manufacturer_brand,
  description,
  color,
  size,
  status,
  quantity,
  price,
  discount,
  product_image,
}: productsType) {
  const result = await ProductDetails.create({
    product_name,
    product_category,
    sub_category,
    manufacturer_brand,
    description,
    color,
    size,
    status,
    quantity,
    price,
    discount,
    product_image,
  });
  console.log(result);

  return result;
}

export async function find_existing_product(product_name: string) {
  const isExisting = await ProductDetails.findOne({
    product_name,
  });
  return isExisting;
}

export async function featured_product_service() {
  const result = await ProductDetails.find({}).limit(5);
  return result;
}

export async function get_product_service_with_filters({
  filters,
  page,
  limit,
  sort_by,
  sort_order,
}: QueryOptions): Promise<{ products: productsType[]; total: number }> {
  // Build query object
  const query: any = {};

  if (filters.main_category) query.main_category = filters.main_category;
  if (filters.product_category)
    query.product_category = filters.product_category;
  if (filters.sub_category) query.sub_category = filters.sub_category;
  if (filters.manufacturer_brand)
    query.manufacturer_brand = filters.manufacturer_brand;

  // Handle color and size as arrays with case-insensitive matching
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

  // Handle price range (convert to string for comparison)
  if (filters.price_min || filters.price_max) {
    query.price = {};
    if (filters.price_min) query.price.$gte = filters.price_min.toString();
    if (filters.price_max) query.price.$lte = filters.price_max.toString();
  }

  // Handle search with validation
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.trim();
    query.$or = [{ product_name: { $regex: searchTerm, $options: "i" } }];
    console.log("Applied search term:", searchTerm); // Log search term
  }

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  console.log(limit);

  // Execute query
  const [products, total] = await Promise.all([
    ProductDetails.find(query)
      .sort({ [sort_by]: sort_order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductDetails.countDocuments(query), // Get total matching documents
  ]);

  const mappedProducts: productsType[] = products.map((product: any) => ({
    main_category: product.main_category ?? "",
    product_name: product.product_name ?? "",
    product_category: product.product_category ?? "",
    sub_category: product.sub_category ?? "",
    manufacturer_brand: product.manufacturer_brand ?? "",
    description: product.description ?? "",
    color: product.color ?? [],
    size: product.size ?? [],
    status: product.status ?? "",
    quantity: product.quantity ?? 0,
    price: product.price ?? 0,
    discount: product.discount ?? 0,
    product_image: product.product_image ?? [],
    id: product._id?.toString() ?? "",
  }));

  console.log(products);

  return { products: mappedProducts, total };
}

export async function search_product_service(
  query: string,
  page: number,
  limit: number
) {
  const searchResults = await ProductDetails.find({
    product_name: { $regex: query, $options: "i" }, // Case-insensitive search
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  // Count total matching documents
  const total = await ProductDetails.countDocuments({
    product_name: { $regex: query, $options: "i" },
  });

  return { products: searchResults, total };
}

export async function getOne_product_service(id: string) {
  const result = await ProductDetails.findOne({ _id: id });
  return result;
}

export async function getByCategory_service(slug: string) {
  const result = await ProductDetails.find({ product_category: slug });
  return result;
}

export async function edit_product_service({
  id,
  product_name,
  product_category,
  sub_category,
  manufacturer_brand,
  description,
  color,
  size,
  status,
  quantity,
  price,
  discount,
  product_image,
}: productsType) {
  const result = await ProductDetails.updateOne(
    { _id: id },
    {
      product_name,
      product_category,
      sub_category,
      manufacturer_brand,
      description,
      color,
      size,
      status,
      quantity,
      price,
      discount,
      product_image,
    },
    { new: true }
  );

  return result;
}

export async function delete_product_service(productId: string) {
  const result = await ProductDetails.deleteOne({ _id: productId });
  console.log(result);

  return result;
}
