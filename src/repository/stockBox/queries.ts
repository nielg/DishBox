import sql from "@/lib/db";
import {
  StockInventoryResponseSchema,
  StockItemResponseSchema,
  type StockInventoryResponse,
  type StockItemResponse,
} from "@/types/stock/stock.schema";
import { z } from "astro/zod";

export async function getStockItems(
  user_id: number,
): Promise<StockItemResponse[]> {
  let rows: unknown;

  try {
    rows = await sql`
        SELECT 
            id,
            name,
            metric
        FROM stockbox.stock_items 
        WHERE public = true OR user_id = ${user_id}
    `;
  } catch (error) {
    console.error("DB: Failed to fetch stock items", error);
    throw new Error("Database fetch failed", { cause: error });
  }

  return z.array(StockItemResponseSchema).parse(rows);
}

export async function getStockInventory(
  user_id: number,
): Promise<StockInventoryResponse[]> {
  let rows: unknown;

  try {
    rows = await sql`
        SELECT
            item.id AS item_id,
            item.name AS name,
            item.metric AS metric,
            COALESCE(SUM(batch.quantity), 0) AS quantity
        FROM stockbox.stock_items item
        JOIN stockbox.stock_batches batch ON item.id = batch.stock_item_id
        WHERE item.user_id = 0 OR item.user_id = ${user_id}
        GROUP BY item.id, item.name, item.metric
    `;
  } catch (error) {
    console.error("DB: Failed to fetch inventory", error);
    throw new Error("Database fetch failed", { cause: error });
  }

  return z.array(StockInventoryResponseSchema).parse(rows);
}
