export const TOP_K_DEFAULT = 40;
export const TOP_P_DEFAULT = 0.95;
export const TEMPERATURE_DEFAULT = 0.7;

export const MODEL_IDS = {
  TEXT: "combo-tw4",
  TTS: "gemini-2.0-flash",
  IMAGE: "gemini-2.0-flash", // Dùng trực tiếp Gemini cho image generation
};

export const API_CONFIG = {
  ROUTER_BASE_URL: import.meta.env.PROD ? "/v1" : "http://localhost:20128/v1",
  ROUTER_API_KEY: "sk-5e99218615354560-v2qyqn-3a15a461", // Key mặc định từ tham khảo
};

// Available voices for TTS
export const VOICE_NAMES = {
  SWEET: "Kore",
} as const;

export const SYSTEM_TONE_MAP = {
  sweet: "Kore",
} as const;

export const TONE_DATA = {
  sweet: { label: "Trang", icon: "💖" },
} as const;
