import { Request, Response } from "express";
import {
  deleteSavedItemDocumentService,
  find_existing_saved_item,
  readSavedItem_service,
  removeSavedItem_service,
  saveItem_service,
} from "../services/saveItemService";

export async function saveItem_controller(req: Request, res: Response) {
  const { userId, productId, quantity } = req.body;
  try {
    const existing_item = await find_existing_saved_item(userId);

    if (existing_item && existing_item!.items.length > 0) {
      // Check if item already exists
      const itemExists = existing_item.items.some(
        (item) => item.productId.toString() === productId
      );

      if (itemExists) {
        return res
          .status(200)
          .json({ message: "Item already in wishlist", data: existing_item });
      }

      // add item in wishlist
      existing_item!.items.push({ productId, quantity });

      // Save the updated document
      await existing_item.save();

      res.status(200).json({ data: existing_item, message: "" });
    } else {
      // create wishlist for users
      const arr = [];

      arr.push({ productId, quantity });

      const products = await saveItem_service({
        userId,
        items: arr,
      });

      res.status(200).json({ data: products, message: "" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function readSavedItem_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const savedItem = await readSavedItem_service(userId as string);

    if (!savedItem) {
      return res
        .status(200)
        .json({ data: [], message: "No saved items found" });
    }

    const cart = await savedItem!.populate("items.productId");

    const items = cart.items.map((item: any) => {
      const itemObj = item.toObject();
      if (itemObj.productId) {
        const product = itemObj.productId;
        // Format date
        const date = new Date(product.createdAt);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        itemObj.productId.dateAdded = formattedDate;
        itemObj.productId.stockStatus =
          product.quantity > 0 && product.status === "Available"
            ? "In Stock"
            : "Out of Stock";
      }
      return itemObj;
    });

    res.status(200).json({ data: items, message: "" });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function removeSavedItem_controller(req: Request, res: Response) {
  const { userId, itemId } = req.params;
  try {
    const savedItem = await readSavedItem_service(userId as string);

    if (!savedItem) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const result = savedItem.items.filter(
      (item) => (item._id as unknown as string) != itemId
    );

    if (result.length === 0) {
      // Wishlist is empty, delete the document
      await deleteSavedItemDocumentService(userId as string);
      return res.status(200).send("Wishlist cleared and deleted");
    }

    const item = await removeSavedItem_service(
      userId as string,
      result as unknown as any
    );

    res.status(200).send("item deleted");
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
