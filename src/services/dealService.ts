import DealModel from "../model/dealModel";
import { IDeal } from "../Interface/dealType";
import ProductDetails from "../model/productModel";

export const get_active_deals_service = async () => {
  const now = new Date();

  // Find deals that are currently active
  const deals = await DealModel.find({
    startAt: { $lte: now },
    endAt: { $gte: now },
    isActive: true,
  })
    .populate("productId")
    .lean();

  // Map to include calculated pricing
  return deals
    .map((deal: any) => {
      const product = deal.productId;
      if (!product) return null;

      let discountedPrice = product.price;
      if (deal.discountType === "PERCENT") {
        discountedPrice = product.price * (1 - deal.discountValue / 100);
      } else if (deal.discountType === "FLAT") {
        discountedPrice = Math.max(0, product.price - deal.discountValue);
      }

      return {
        ...deal,
        product: {
          ...product,
          originalPrice: product.price,
          dealPrice: discountedPrice,
          discountPercentage:
            deal.discountType === "PERCENT"
              ? deal.discountValue
              : Math.round(
                  ((product.price - discountedPrice) / product.price) * 100
                ),
        },
      };
    })
    .filter(Boolean);
};

export const create_deal_service = async (data: Partial<IDeal>) => {
  const { productId, startAt, endAt } = data;

  // Check for overlapping deals for the same product
  const overlapping = await DealModel.findOne({
    productId,
    $or: [
      { startAt: { $lte: startAt }, endAt: { $gte: startAt } },
      { startAt: { $lte: endAt }, endAt: { $gte: endAt } },
      { startAt: { $gte: startAt }, endAt: { $lte: endAt } },
    ],
    isActive: true,
  });

  if (overlapping) {
    throw new Error(
      "This product already has a deal scheduled during this time window."
    );
  }

  return await DealModel.create(data);
};

export const get_all_deals_service = async () => {
  return await DealModel.find().populate("productId").sort({ createdAt: -1 });
};

export const update_deal_service = async (id: string, data: Partial<IDeal>) => {
  const deal = await DealModel.findByIdAndUpdate(id, data, { new: true });
  if (!deal) throw new Error("Deal not found");
  return deal;
};

export const delete_deal_service = async (id: string) => {
  const deal = await DealModel.findByIdAndDelete(id);
  if (!deal) throw new Error("Deal not found");
  return deal;
};
