import { CartType } from "../Interface/productsType";
import SavedItem from "../model/user.saveItem";

export async function saveItem_service({ userId, items }: CartType) {
  const result = await SavedItem.create({
    userId,
    items,
  });
  return result;
}

export async function find_existing_saved_item(userId: string) {
  const isExisting = await SavedItem.findOne({
    userId,
  });
  return isExisting;
}

export async function readSavedItem_service(userId: string) {
  const savedItem = await SavedItem.findOne({
    userId,
  });
  return savedItem;
}
export async function removeSavedItem_service(
  userId: string,
  item: {
    productId: string;
    quantity: number;
  }[]
) {
  const savedItem = await SavedItem.updateOne(
    { userId: userId },
    { items: item },
    { new: true }
  );
  return savedItem;
}
