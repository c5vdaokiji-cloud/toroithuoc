import { openDB, DBSchema } from 'idb';
import { TradeItem } from '../types';

interface MediSearchDB extends DBSchema {
  items: {
    key: string; // We'll use a single key 'main-list' to store the array for simplicity, or we could store individual items.
                 // Storing the whole array is simpler for this specific "file load" use case.
    value: TradeItem[];
  };
}

const DB_NAME = 'medisearch-db';
const STORE_NAME = 'items';
const KEY = 'trade-list';

const dbPromise = openDB<MediSearchDB>(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export const dbService = {
  async saveItems(items: TradeItem[]) {
    const db = await dbPromise;
    await db.put(STORE_NAME, items, KEY);
  },

  async getItems(): Promise<TradeItem[] | undefined> {
    const db = await dbPromise;
    return await db.get(STORE_NAME, KEY);
  },

  async clearItems() {
    const db = await dbPromise;
    await db.delete(STORE_NAME, KEY);
  }
};