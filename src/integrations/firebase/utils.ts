import { database } from "./client";
import { get, ref, set, remove } from "firebase/database";

export const readData = async (path: string) => {
  const dataRef = ref(database, path);
  try {
    const snapshot = await get(dataRef);
    console.log(`readData: path=${path}, exists=${snapshot.exists()}`);
    if (snapshot.exists()) {
      console.log(`readData: data=${JSON.stringify(snapshot.val())}`);
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (err) {
    console.error("readData error:", err);
  }
  return null;
};

export const writeData = async (path: string, data: any) => {
  const dataRef = ref(database, path);
  await set(dataRef, data);
};

export const deleteData = async (path: string) => {
    const dataRef = ref(database, path);
    await remove(dataRef);
}