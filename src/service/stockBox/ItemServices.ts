import StockRepository from "@/repository/stockBox/StockRepository";

const getInventoryByUserId = (user_id: number) => {
  return StockRepository.getStockInventory(user_id);
};

const ItemService = {
  getInventoryByUserId,
};

export default ItemService;
