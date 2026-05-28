import { adminDb } from '@/lib/firebase/admin';
import { cacheLife } from "next/cache";

const SETTINGS_DOC_ID = "general";
const COLLECTION_NAME = "settings";

export interface Settings {
  whatsappNumber: string;
}

export class SettingsService {
  static async getSettings(): Promise<Settings> {
    "use cache";
    cacheLife("hours");
    const docSnap = await adminDb.collection(COLLECTION_NAME).doc(SETTINGS_DOC_ID).get();

    if (!docSnap.exists) {
      // Default fallback
      return { whatsappNumber: "244923456789" };
    }

    return docSnap.data() as Settings;
  }

  static async updateSettings(data: Partial<Settings>): Promise<Settings> {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(SETTINGS_DOC_ID);

    // Use merge to only update provided fields without overwriting others
    await docRef.set(data, { merge: true });

    return this.getSettings();
  }
}
