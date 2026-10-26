export const BRAND = {
  red: "#FF2D3B", redGlow: "rgba(255,45,59,0.25)",
  gold: "#FFB800", goldSoft: "rgba(255,184,0,0.15)",
  electric: "#00D4FF", electricSoft: "rgba(0,212,255,0.12)",
  violet: "#7B3FE4", violetSoft: "rgba(123,63,228,0.12)",
  green: "#00C96B", greenSoft: "rgba(0,201,107,0.12)",
};
export const DARK = {
  mode: "dark", bg: "#09090B", bg2: "#111114", bg3: "#18181C", bg4: "#222228",
  border: "rgba(255,255,255,0.07)", borderBright: "rgba(255,255,255,0.14)",
  text1: "#FFFFFF", text2: "rgba(255,255,255,0.7)", text3: "rgba(255,255,255,0.4)", text4: "rgba(255,255,255,0.2)",
  ...BRAND,
};
export const LIGHT = {
  mode: "light", bg: "#F8F8F6", bg2: "#FFFFFF", bg3: "#F2F0EB", bg4: "#E8E5DE",
  border: "rgba(15,14,13,0.08)", borderBright: "rgba(15,14,13,0.15)",
  text1: "#0F0E0D", text2: "rgba(15,14,13,0.75)", text3: "rgba(15,14,13,0.45)", text4: "rgba(15,14,13,0.25)",
  ...BRAND,
};
