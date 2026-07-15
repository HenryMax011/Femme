import { promises as fs } from "fs";
import path from "path";
import type { StoredOrder } from "@/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf8");
  }
}

export async function readOrders(): Promise<StoredOrder[]> {
  await ensureFile();
  const raw = await fs.readFile(ORDERS_FILE, "utf8");
  return JSON.parse(raw) as StoredOrder[];
}

export async function writeOrders(orders: StoredOrder[]) {
  await ensureFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function saveOrder(order: StoredOrder) {
  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
  return order;
}

export async function getOrderById(id: string) {
  const orders = await readOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export async function updateOrder(
  id: string,
  patch: Partial<StoredOrder>,
): Promise<StoredOrder | null> {
  const orders = await readOrders();
  const idx = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch };
  await writeOrders(orders);
  return orders[idx];
}
