import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'tony_math_hero_db';
const DB_VERSION = 1;

export interface AppDBSchema {
  players: {
    key: string;
    value: any;
  };
  campaign_progress: {
    key: string;
    value: any;
    indexes: {
      by_player: string;
      by_campaign: string;
    };
  };
  settings: {
    key: string;
    value: any;
  };
  active_session: {
    key: string;
    value: any;
  };
}

let dbInstance: IDBPDatabase<AppDBSchema> | null = null;
let isIndexedDbSupported = true;

export async function getDatabase(): Promise<IDBPDatabase<AppDBSchema> | null> {
  if (!isIndexedDbSupported) return null;
  if (dbInstance) return dbInstance;

  try {
    if (typeof window === 'undefined' || !window.indexedDB) {
      isIndexedDbSupported = false;
      return null;
    }

    dbInstance = await openDB<AppDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Player store
        if (!db.objectStoreNames.contains('players')) {
          db.createObjectStore('players', { keyPath: 'id' });
        }

        // Campaign progress store (key is `${playerId}_${campaignId}`)
        if (!db.objectStoreNames.contains('campaign_progress')) {
          const progressStore = db.createObjectStore('campaign_progress', { keyPath: 'id' });
          progressStore.createIndex('by_player', 'playerId');
          progressStore.createIndex('by_campaign', 'campaignId');
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }

        // Active session store
        if (!db.objectStoreNames.contains('active_session')) {
          db.createObjectStore('active_session', { keyPath: 'id' });
        }
      },
      blocked() {
        console.warn('IndexedDB database upgrade blocked by other open tab.');
      },
      blocking() {
        if (dbInstance) {
          dbInstance.close();
          dbInstance = null;
        }
      },
      terminated() {
        dbInstance = null;
      },
    });

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize IndexedDB, falling back to LocalStorage:', error);
    isIndexedDbSupported = false;
    return null;
  }
}
