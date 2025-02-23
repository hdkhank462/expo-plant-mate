import EncryptedStorage from "react-native-encrypted-storage";

async function set(key: string, value: any) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error during set encrypted storage:", error);
  }
}

async function get<T>(key: string) {
  try {
    const value = await EncryptedStorage.getItem(key);
    return value ? JSON.parse(value as Stringified<T>) : null;
  } catch (error) {
    console.error("Error during get encrypted storage:", error);
    return null;
  }
}

async function remove(key: string) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.error("Error during remove encrypted storage:", error);
  }
}

async function wipe() {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    console.error("Error during wipe encrypted storage:", error);
  }
}

export default {
  set,
  get,
  remove,
  wipe,
};
