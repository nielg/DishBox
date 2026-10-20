import sql from "@/lib/db";
import type {
  StockBatchRequest,
  StockItemRequest,
} from "@/types/stock/stock.schema";
import { z } from "astro/zod";

export async function createStockItem(user_id: number, item: StockItemRequest) {
  let rows: unknown;

  try {
    const rows = sql``;
  } catch (error) {}
}

export async function addBatchItem(user_id: number, batch: StockBatchRequest) {
  let rows: unknown;

  try {
    const rows = sql``;
  } catch (error) {}
}
