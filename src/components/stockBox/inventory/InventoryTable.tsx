"use client";
import s from "@/styles/components/stockBox/inventoryTable.module.css";
import type { StockInventoryResponse } from "@/types/stock/stock.schema";
import InventoryActions from "./InventoryActions";

type Props = {
  inventory: StockInventoryResponse[];
};

export default function InventoryTable({ inventory }: Props) {
  return (
    <section className={s.inventory}>
      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead className={s.tableHead}>
            <tr>
              <th className={s.heading} scope="col">
                Name
              </th>
              <th className={s.heading} scope="col">
                Metric
              </th>
              <th className={`${s.heading} ${s.quantityHeading}`} scope="col">
                Quantity
              </th>
              <th className={`${s.heading} ${s.actionsHeading}`} scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((i) => {
              return (
                <tr className={s.row} key={i.item_id}>
                  <td className={s.cell}>{i.name}</td>
                  <td className={s.cell}>{i.metric}</td>
                  <td className={`${s.cell} ${s.quantity}`}>{i.quantity}</td>
                  <td className={`${s.cell} ${s.actionsCell}`}>
                    <InventoryActions item={i} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
