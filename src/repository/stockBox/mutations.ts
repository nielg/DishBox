import sql from "@/lib/db";
import {
  StockItemResponseSchema,
  type StockBatchRequest,
  type StockItemRequest,
  type StockItemResponse,
} from "@/types/stock/stock.schema";
import { z } from "astro/zod";

export async function createStockItem(
  user_id: number,
  item: StockItemRequest,
): Promise<StockItemResponse> {
  let rows: unknown;
  try {
    rows = await sql`
      INSERT INTO stockbox.stock_items (user_id, name, metric)
      VALUES (${user_id}, ${item.name}, ${item.metric})
      RETURNING id, name, metric
    `;
  } catch (error) {
    console.error("DB: Failed to create stock item", error);
    throw new Error("Database insert failed", { cause: error });
  }

  const [createdItem] = z.array(StockItemResponseSchema).parse(rows);
  if (!createdItem) {
    throw new Error("Failed to create stock item");
  }

  return createdItem;
}

export async function addBatchItem(
  user_id: number,
  batch: StockBatchRequest,
): Promise<number> {
  let rows: unknown;
  try {
    rows = await sql`
      INSERT INTO stockbox.stock_batches (
        user_id,
        stock_item_id,
        quantity,
        expire_date
      )
      SELECT
        ${user_id},
        item.id,
        ${batch.quantiy},
        ${batch.expireDate}
      FROM stockbox.stock_items item
      WHERE item.id = ${batch.stock_id}
        AND (item.public = true OR item.user_id = ${user_id})
      RETURNING id
    `;
  } catch (error) {
    console.error("DB: Failed to add stock batch", error);
    throw new Error("Database insert failed", { cause: error });
  }

  const [createdBatch] = z.array(z.object({ id: z.number() })).parse(rows);
  if (!createdBatch) {
    throw new Error(
      `Stock item with ID ${batch.stock_id} not found or not accessible`,
    );
  }

  return createdBatch.id;
}
