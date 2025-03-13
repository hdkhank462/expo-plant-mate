export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
  },
};

export const DEFAULT: AppDefault = {
  APP_THEME: "light",
  BASE_API_URL: "http://192.168.1.6:8000/api",
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_INFO: "userInfo",
  COLOR_SCHEME: "colorScheme",
};

export const WEEKDAYS = [
  { value: "mon", label: "T2" },
  { value: "tue", label: "T3" },
  { value: "wed", label: "T4" },
  { value: "thu", label: "T5" },
  { value: "fri", label: "T6" },
  { value: "sat", label: "T7" },
  { value: "sun", label: "CN" },
];

export const CARE_TYPES = [
  { value: "water", label: "Tưới nước" },
  { value: "fertilize", label: "Bón phân" },
  { value: "repot", label: "Chuyển chậu" },
  { value: "prune", label: "Tỉa cành" },
  { value: "clean", label: "Vệ sinh" },
];
