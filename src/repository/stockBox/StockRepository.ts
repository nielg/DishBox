import { addBatchItem, createStockItem } from "./mutations";
import { getStockInventory, getStockItems } from "./queries";

const StockRepository = {
  getStockItems,
  getStockInventory,
  createStockItem,
  addBatchItem,
};

export default StockRepository;
