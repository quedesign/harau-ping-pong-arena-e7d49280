import { database } from "./client";
import { get, ref, set, remove } from "firebase/database";

export const readData = async (path: string) => {
  const dataRef = ref(database, path);
  const snapshot = await get(dataRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log("No data available");
    return null;
  }
};

export const writeData = async (path: string, data: any) => {
  const dataRef = ref(database, path);
  await set(dataRef, data);
};

export const deleteData = async (path: string) => {
    const dataRef = ref(database, path);
    await remove(dataRef);
}