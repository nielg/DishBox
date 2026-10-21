import StockRepository from "@/repository/stockBox/StockRepository";

const addItemQuantity = (user_id: number, item_id: number, quantity: number) =>
  StockRepository.addItemQuantity(user_id, item_id, quantity);

const removeItemQuantity = (
  user_id: number,
  item_id: number,
  quantity: number,
) => StockRepository.removeItemQuantity(user_id, item_id, quantity);

const BatchService = {
  addItemQuantity,
  removeItemQuantity,
};

export default BatchService;
