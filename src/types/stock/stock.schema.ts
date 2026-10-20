import { z } from "astro/zod";

const StockItemResponse = z.object({
  id: z.number(),
  name: z.string(),
  metric: z.string(),
});

const StockItemRequest = z.object({
  name: z.string(),
  metric: z.string(),
});

const StockBatchRequest = z.object({
  id: z.number(),
  stock_id: z.number(),
  user_id: z.number(),
  quantiy: z.number(),
  expireDate: z.date(),
});

const StockBatchItemResponse = z.object({
  name: z.string(),
  metric: z.string(),
  quantity: z.number(),
  nextExpire: z.object({
    quantity: z.number(),
    expireDate: z.date(),
  }),
});
