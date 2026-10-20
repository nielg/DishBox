import { z } from "astro/zod";

export const StockItemResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  metric: z.string(),
});

export type StockItemResponse = z.infer<typeof StockItemResponseSchema>;

const StockItemRequestSchema = z.object({
  name: z.string(),
  metric: z.string(),
});

export const StockBatchRequestSchema = z.object({
  id: z.number(),
  stock_id: z.number(),
  user_id: z.number(),
  quantiy: z.number(),
  expireDate: z.date(),
});

export const StockInventoryResponseSchema = z.object({
  item_id: z.number(),
  name: z.string(),
  metric: z.string(),
  quantity: z.number(),
});

export type StockInventoryResponse = z.infer<
  typeof StockInventoryResponseSchema
>;

export type StockItemRequest = z.infer<typeof StockItemRequestSchema>;

export type StockBatchRequest = z.infer<typeof StockBatchRequestSchema>;
