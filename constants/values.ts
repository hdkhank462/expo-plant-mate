export const DEFAULT = {
  APP_THEME: "light",
  BASE_API_URL: "http://192.168.1.2:8000/api",
  ALARMS_ID_PREFIX: "plant-mate-alarm",
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_INFO: "userInfo",
  COLOR_SCHEME: "colorScheme",
  ALARMS: "alarms",
};

export const WEEKDAYS = [
  { value: "mon", label: "T2", number: 2 },
  { value: "tue", label: "T3", number: 3 },
  { value: "wed", label: "T4", number: 4 },
  { value: "thu", label: "T5", number: 5 },
  { value: "fri", label: "T6", number: 6 },
  { value: "sat", label: "T7", number: 7 },
  { value: "sun", label: "CN", number: 1 },
];

export const CARE_TYPES = [
  { value: "water", label: "Tưới nước" },
  { value: "fertilize", label: "Bón phân" },
  { value: "repot", label: "Chuyển chậu" },
  { value: "prune", label: "Tỉa cành" },
  { value: "clean", label: "Vệ sinh" },
];
