export const TOP_K_DEFAULT = 40;
export const TOP_P_DEFAULT = 0.95;
export const TEMPERATURE_DEFAULT = 0.7;

export const MODEL_IDS = {
  TEXT: "gemini-2.0-flash-exp",
  TTS: "gemini-2.0-flash-exp",
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
