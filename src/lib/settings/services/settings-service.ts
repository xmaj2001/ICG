import { db } from "@/lib/firebase/config";
import { cacheLife } from "next/cache";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SETTINGS_DOC_ID = "general";
const COLLECTION_NAME = "settings";

export interface Settings {
  whatsappNumber: string;
}

export class SettingsService {
  static async getSettings(): Promise<Settings> {
    "use cache";
    cacheLife("hours");
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Default fallback
      return { whatsappNumber: "244923456789" };
    }

    return docSnap.data() as Settings;
  }

  static async updateSettings(data: Partial<Settings>): Promise<Settings> {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);

    // Use merge to only update provided fields without overwriting others
    await setDoc(docRef, data, { merge: true });

    return this.getSettings();
  }
}
