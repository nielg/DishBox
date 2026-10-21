import {
  addBatchItem,
  addItemQuantity,
  createStockItem,
  removeItemQuantity,
} from "./mutations";
import { getStockInventory, getStockItems } from "./queries";

const StockRepository = {
  getStockItems,
  getStockInventory,
  createStockItem,
  addBatchItem,
  addItemQuantity,
  removeItemQuantity,
};

export default StockRepository;
