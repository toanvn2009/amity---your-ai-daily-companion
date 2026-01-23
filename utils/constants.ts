export const TOP_K_DEFAULT = 40;
export const TOP_P_DEFAULT = 0.95;
export const TEMPERATURE_DEFAULT = 0.7;

export const MODEL_IDS = {
  TEXT: "gemini-2.5-flash",
  TTS: "gemini-2.5-flash",
};

// Available voices for TTS
export const VOICE_NAMES = {
  DEFAULT: "Puck",
  SWEET: "Kore",
  ZEN: "Charon",
  COACH: "Fenrir",
  BESTIE: "Aoede",
} as const;

export const SYSTEM_TONE_MAP = {
  default: "Puck",
  sweet: "Kore",
  zen: "Charon",
  coach: "Fenrir",
  bestie: "Aoede",
} as const;

export const TONE_DATA = {
  default: { label: "Amity", icon: "🌸" },
  coach: { label: "Coach", icon: "🏆" },
  bestie: { label: "Bestie", icon: "🌈" },
  zen: { label: "Thiền", icon: "🧘" },
  sweet: { label: "Người yêu", icon: "💖" },
} as const;
